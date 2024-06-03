"use client";

import { useFormStatus } from "react-dom";

interface FormButtonProps
  extends React.PropsWithChildren<
    React.ButtonHTMLAttributes<HTMLButtonElement>
  > {
  text: string;
}

export default function FormButton({
  text,
  children,
  ...rest
}: FormButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      disabled={pending}
      className="primary-btn h-10 disabled:bg-neutral-400  disabled:text-neutral-300 disabled:cursor-not-allowed"
      {...rest}
    >
      {pending ? "로딩 중" : text}
    </button>
  );
}
