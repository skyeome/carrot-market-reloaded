"use server";
import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
  PASSWORD_REGEX_ERROR,
} from "@/lib/constants";
import db from "@/lib/db";
import { z } from "zod";

const checkUsername = (username: string) => !username.includes("potato");

const checkPassword = ({
  password,
  confirm_password,
}: {
  password: string;
  confirm_password: string;
}) => password === confirm_password;

const checkUniqueUsername = async (username: string) => {
  // username이 중복인지 확인
  const user = await db.user.findUnique({
    where: { username },
    select: { id: true },
  });
  return !Boolean(user);
};

const checkUniqueEmail = async (email: string) => {
  const user = await db.user.findUnique({
    where: { email },
    select: { id: true },
  });
  return !Boolean(user);
};

const formSchema = z
  .object({
    username: z
      .string({
        invalid_type_error: "문자열로 입력해주세요.",
        required_error: "유저명은 필수 입니다.",
      })
      .toLowerCase()
      .trim()
      .refine(checkUsername, "potato는 사용할수 없습니다.")
      .refine(checkUniqueUsername, "이미 존재하는 사용자명 입니다."),
    email: z
      .string()
      .email()
      .toLowerCase()
      .trim()
      .refine(checkUniqueEmail, "이미 존재하는 이메일 입니다."),
    password: z
      .string()
      .min(PASSWORD_MIN_LENGTH)
      .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
    confirm_password: z.string().min(PASSWORD_MIN_LENGTH),
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
    // TODO: 회원가입 후 로그인 로직 작성
    // 비밀번호 암호화
    // 사용자 db에 저장
    // redirect "/home"
  }
}
