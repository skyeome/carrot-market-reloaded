"use server";

import { z } from "zod";
import validator from "validator";
import { redirect } from "next/navigation";

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

const tokenSchema = z.coerce.number().min(100000).max(999999);

export async function smsLogin(prevState: ActionState, formData: FormData) {
  const phone = formData.get("phone");
  const token = formData.get("token");

  if (!prevState.token) {
    const result = phoneSchema.safeParse(phone);
    if (!result.success) {
      return {
        token: false,
        error: result.error.flatten(),
      };
    } else {
      return {
        token: true,
      };
    }
  } else {
    // 정상적인 폰 번호 일 때
    const result = tokenSchema.safeParse(token);
    if (!result.success) {
      return {
        token: true,
        error: result.error.flatten(),
      };
    } else {
      redirect("/");
    }
  }
}
