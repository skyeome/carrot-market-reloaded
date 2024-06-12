export interface EmailResponse {
  email: string;
  primary: boolean;
  verified: boolean;
  visibility?: string;
}

export default async function fetchGithubEmail(token: string) {
  const emailData: EmailResponse[] = await (
    await fetch("https://api.github.com/user/emails", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-cache",
    })
  ).json();

  const primayEmail = emailData.find((email) => email.primary);
  const email = primayEmail?.email;

  return email;
}
