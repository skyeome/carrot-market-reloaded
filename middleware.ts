import { NextRequest, NextResponse } from "next/server";
import getSession from "./lib/session/getSession";

interface Routes {
  [key: string]: boolean;
}

const publicOnlyUrls: Routes = {
  "/": true,
  "/login": true,
  "/sms": true,
  "/create-account": true,
  "/github/start": true,
  "/github/complete": true,
};

export async function middleware(request: NextRequest) {
  const session = await getSession();
  const exists = publicOnlyUrls[request.nextUrl.pathname];
  if (!session.id) {
    // 로그인 안한 상태
    if (!exists) {
      // 로그인이 필요한 페이지인 경우
      return NextResponse.redirect(new URL("/", request.url));
    }
  } else {
    // 이미 로그인 한 상태
    if (exists) {
      // 로그인, 회원가입 관련 페이지 일때
      return NextResponse.redirect(new URL("/products", request.url));
    }
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
