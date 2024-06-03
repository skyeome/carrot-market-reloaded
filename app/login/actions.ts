"use server";

import { PASSWORD_MIN_LENGTH, PASSWORD_REGEX } from "@/lib/constants";
import { z } from "zod";

const formSchema = z.object({
  email: z.string().email().toLowerCase().trim(),
  password: z
    .string({
      required_error: "비밀번호는 필수 입니다.",
    })
    .min(PASSWORD_MIN_LENGTH)
    .regex(PASSWORD_REGEX),
});

export async function login(prevState: any, formData: FormData) {
  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
  };
  const result = formSchema.safeParse(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    console.log(data);
  }
}
