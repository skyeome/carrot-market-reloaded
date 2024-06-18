"use server";
import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
  PASSWORD_REGEX_ERROR,
} from "@/lib/constants";
import db from "@/lib/db";
import { z } from "zod";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";
import getSession from "@/lib/session/getSession";

const checkUsername = (username: string) => !username.includes("potato");

const checkPassword = ({
  password,
  confirm_password,
}: {
  password: string;
  confirm_password: string;
}) => password === confirm_password;

const formSchema = z
  .object({
    username: z
      .string({
        invalid_type_error: "문자열로 입력해주세요.",
        required_error: "유저명은 필수 입니다.",
      })
      .toLowerCase()
      .trim()
      .refine(checkUsername, "potato는 사용할수 없습니다."),
    // .refine(checkUniqueUsername, "이미 존재하는 사용자명 입니다."),
    email: z.string().email().toLowerCase().trim(),
    // .refine(checkUniqueEmail, "이미 존재하는 이메일 입니다."),
    password: z
      .string()
      .min(PASSWORD_MIN_LENGTH)
      .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
    confirm_password: z.string().min(PASSWORD_MIN_LENGTH),
  })
  .superRefine(async ({ username }, ctx) => {
    const user = await db.user.findUnique({
      where: { username },
      select: { id: true },
    });
    if (user) {
      ctx.addIssue({
        code: "custom",
        path: ["username"],
        message: "이미 존재하는 사용자명 입니다.",
        fatal: true,
      });
      return z.NEVER;
    }
  })
  .superRefine(async ({ email }, ctx) => {
    const user = await db.user.findUnique({
      where: { email },
      select: { id: true },
    });
    if (user) {
      ctx.addIssue({
        code: "custom",
        path: ["email"],
        message: "이미 존재하는 이메일 입니다.",
        fatal: true,
      });
      return z.NEVER;
    }
  })
  .refine(checkPassword, {
    path: ["confirm_password"],
    message: "비밀번호가 동일해야 합니다.",
  });

export async function createAccount(prevState: any, formData: FormData) {
  const data = {
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirm_password: formData.get("confirm_password"),
  };

  const result = await formSchema.safeParseAsync(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    // 비밀번호 암호화
    const hashedPassword = await bcrypt.hash(result.data.password, 12);

    // 사용자 db에 저장
    const user = await db.user.create({
      data: {
        username: result.data.username,
        email: result.data.email,
        password: hashedPassword,
      },
      select: {
        id: true,
      },
    });
    // 저장한 사용자 id 값 쿠키에 저장
    const session = await getSession();
    session.id = user.id;
    await session.save();

    // redirect "/home"
    redirect("/profile");
  }
}
