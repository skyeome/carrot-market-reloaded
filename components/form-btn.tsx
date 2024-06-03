interface FormButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading: boolean;
  text: string;
}

export default function FormButton({
  loading,
  text,
  ...rest
}: FormButtonProps) {
  return (
    <button
      disabled={loading}
      className="primary-btn h-10 disabled:bg-neutral-400  disabled:text-neutral-300 disabled:cursor-not-allowed"
      {...rest}
    >
      {loading ? "로딩 중" : text}
    </button>
  );
}
