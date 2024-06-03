"use server";
import { z } from "zod";

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
      .min(3, "유저명은 2글자 이상만 가능합니다.")
      .max(10, "유저명은 10글자 이하만 가능합니다.")
      .refine(checkUsername, "potato는 사용할수 없습니다."),
    email: z.string().email(),
    password: z.string().min(10),
    confirm_password: z.string().min(10),
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

  const result = formSchema.safeParse(data);
  if (!result.success) {
    return result.error.flatten();
  }
}
