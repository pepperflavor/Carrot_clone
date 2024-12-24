"use server";

import bcrypt from "bcrypt";

import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
  PASSWORD_REGEX_ERROR,
} from "@/lib/constants";
import db from "@/lib/db";
import { z } from "zod";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";

const checkEmailExists = async (email: string) => {
  // email로 유저 검증
  // 있으면 로그인 없으면 에러 출력
  const user = await db.user.findUnique({
    where: {
      email: email,
    },
    select: {
      id: true,
    },
  });

  return Boolean(user);
};

const formSchema = z.object({
  email: z
    .string()
    .email()
    .toLowerCase()
    .refine(checkEmailExists, "An account with this email dose not exist"),
  password: z
    .string({ required_error: "PASSWORD is required" })
    // .min(PASSWORD_MIN_LENGTH),
  // .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
});

export default async function logIn(preState: any, formData: FormData) {
  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const result = await formSchema.safeParseAsync(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    const user = await db.user.findUnique({
      where: {
        email: result.data.email,
      },
      select: {
        id: true,
        password: true,
      },
    });
    // 이 코드가 실행될ㄷ 경우는 무조건 유저가 존재한다는 뜻이기 떄문에 !
    // password가 null 일 경우도 있기 때문에 그때는 빈문자열과 비교하도록 함
    const ok = await bcrypt.compare(result.data.password, user!.password ?? "xxxx");

    if (ok) {
      const session = await getSession();
      session.id = user!.id;
      await session.save()
      redirect("/profile");
    } else {
      return {
        fieldErrors: {
          password: ["Wrong password"],
          email: [],
        },
      };
    }
  }
}
