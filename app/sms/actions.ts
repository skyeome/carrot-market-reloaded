"use server";

import crypto from "crypto";
import { z } from "zod";
import validator from "validator";
import { redirect } from "next/navigation";
import db from "@/lib/db";
import updateSession from "@/lib/session/updateSession";
import twilio from "twilio";

interface ActionState {
  token: boolean;
}

const phoneSchema = z
  .string()
  .trim()
  .refine(
    (phone) => validator.isMobilePhone(phone, "ko-KR"),
    "전화번호 형식으로 입력해주세요."
  );

const tokenSchema = z.coerce
  .number()
  .min(100000)
  .max(999999)
  .refine(tokenExists, "토큰이 일치하지 않습니다.");

async function getToken() {
  const token = crypto.randomInt(100000, 999999).toString();
  const exists = await db.sMSToken.findUnique({
    where: { token },
    select: { id: true },
  });
  if (exists) {
    return getToken();
  } else {
    return token;
  }
}

async function tokenExists(token: number) {
  const exists = await db.sMSToken.findUnique({
    where: { token: token.toString() },
    select: { id: true },
  });
  return Boolean(exists);
}

export async function smsLogin(prevState: ActionState, formData: FormData) {
  const phone = formData.get("phone");
  const token = formData.get("token");

  if (!prevState.token) {
    const result = phoneSchema.safeParse(phone);
    // 전화번호 형식이 아닌 경우
    if (!result.success) {
      return {
        token: false,
        error: result.error.flatten(),
      };
    } else {
      // 전화번호 형식인 경우
      // 기존에 내 번호로 만들어진 이전 토큰은 삭제
      await db.sMSToken.deleteMany({
        where: {
          user: {
            phone: result.data,
          },
        },
      });
      // 기존 회원이면 토큰을 생성하고 회원이 아니라면 랜덤 username을 생성하고 회원 가입진행
      const token = await getToken();
      await db.sMSToken.create({
        data: {
          token,
          user: {
            connectOrCreate: {
              where: {
                phone: result.data,
              },
              create: {
                username: crypto.randomBytes(10).toString("hex"),
                phone: result.data,
              },
            },
          },
        },
      });

      const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
      await client.messages.create({
        body: `요청하신 인증번호는 [${token}] 입니다.`,
        from: process.env.TWILIO_FROM_PHONE_NUMBER!,
        to: process.env.TWILIO_MY_PHONE_NUMBER!,
      });
      return {
        token: true,
      };
    }
  } else {
    // 정상적인 폰 번호 일 때
    const result = await tokenSchema.safeParseAsync(token);
    if (!result.success) {
      return {
        token: true,
        error: result.error.flatten(),
      };
    } else {
      // 입력한 토큰에 연결된 유저의 id를 가져오기
      const token = await db.sMSToken.findUnique({
        where: { token: result.data.toString() },
        select: { id: true, userId: true },
      });
      await updateSession(token!.userId);
      await db.sMSToken.delete({
        where: { id: token!.id },
      });

      // 로그인 진행
      redirect("/profile");
    }
  }
}
