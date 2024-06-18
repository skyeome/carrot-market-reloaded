import db from "@/lib/db";
import updateSession from "@/lib/session/updateSession";
import { notFound, redirect } from "next/navigation";
import { NextRequest } from "next/server";
import checkExistUsername from "@/lib/auth/checkExistUsername";
import fetchGithubEmail from "@/lib/auth/fetchGithubEmail";
import fetchGithubProfile from "@/lib/auth/fetchGithubProfile";
import getAccessToken from "@/lib/auth/getAccessToken";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  // parameter에 code 가 없으면 에러페이지 보여주기
  if (!code) {
    return notFound();
  }
  // 유저 정보 가져오기 위한 엑세스 토큰 발급
  const { error, access_token } = await getAccessToken(code);
  // 코드 만료 혹은 잘못된 코드일 경우 에러 페이지로 이동
  if (error) {
    return new Response(null, {
      status: 400,
    });
  }
  // github 유저 정보 가져오기
  const { login, id, avatar_url } = await fetchGithubProfile(access_token);
  const email = await fetchGithubEmail(access_token);

  // 같은 github_id 유저가 있는지 확인
  const user = await db.user.findUnique({
    where: {
      github_id: id + "",
    },
    select: {
      id: true,
    },
  });
  // github_id 유저가 있다면 이미 가입된 회원이므로 로그인 진행
  if (user) {
    await updateSession(user.id);
    return redirect("/profile");
  }
  // 기존의 유저와 username이 겹치는지 확인하기
  const isExist = await checkExistUsername(login);
  // github_id에 없는 유저면 새로 가입 진행
  const newUser = await db.user.create({
    data: {
      username: isExist ? login + "-gh" : login,
      github_id: id + "",
      avatar: avatar_url,
      email,
    },
    select: {
      id: true,
    },
  });
  await updateSession(newUser.id);
  return redirect("/profile");
}
