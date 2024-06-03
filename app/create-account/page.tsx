"use client";

import { useFormState } from "react-dom";
import { createAccount } from "./actions";
import Button from "@/components/button";
import Input from "@/components/input";
import SocialLogin from "@/components/social-login";

export default function CreateAccount() {
  const [state, dispatch] = useFormState(createAccount, null);
  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">안녕하세요!</h1>
        <h2 className="text-xl">Fill in the form below to join!</h2>
      </div>
      <form action={dispatch} className="flex flex-col gap-3">
        <Input
          name="username"
          type="text"
          placeholder="Username"
          autoComplete="new-username"
          required
          errors={state?.fieldErrors.username}
          minLength={3}
          maxLength={10}
        />
        <Input
          name="email"
          type="email"
          placeholder="Email"
          autoComplete="new-email"
          required
          errors={state?.fieldErrors.email}
        />
        <Input
          name="password"
          type="password"
          placeholder="Password"
          autoComplete="new-password"
          required
          errors={state?.fieldErrors.password}
          minLength={4}
        />
        <Input
          name="confirm_password"
          type="password"
          placeholder="Confirm Password"
          autoComplete="new-password"
          required
          errors={state?.fieldErrors.confirm_password}
          minLength={4}
        />
        <Button text="Create account" />
      </form>
      <SocialLogin />
    </div>
  );
}
