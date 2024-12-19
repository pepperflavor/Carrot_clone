import { Session } from "inspector/promises";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { number } from "zod";

interface SessionContent {
  id?: number;
}

export default function getSession() {
  //ironSession 초기 설정
  return getIronSession<SessionContent>(cookies(), {
    cookieName: "my-karrot",
    password: process.env.COOKIE_PASSWORD!, // 쿠키 암호화
  });
}
