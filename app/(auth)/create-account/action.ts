"use server";

import bcrypt from "bcrypt";
import { redirect } from "next/navigation";

import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
  PASSWORD_REGEX_ERROR,
} from "@/lib/constants";
import db from "@/lib/db";
import { z } from "zod";
import getSession from "@/lib/session";

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
        invalid_type_error: "Username must be a string!!",
        required_error: "Empty username???",
      })
      .toLowerCase()
      .trim()
      .refine(checkUsername, "Potato can't allowed here!!"),

    email: z.string().email().toLowerCase(),

    password: z.string().min(PASSWORD_MIN_LENGTH),
    // .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
    confirm_password: z.string().min(PASSWORD_MIN_LENGTH),
  })
  .superRefine(async ({ username }, ctx) => {
    const user = await db.user.findUnique({
      where: {
        username,
      },
      select: {
        id: true,
      },
    });
    if (user) {
      // superRefine에 fatal: true가 있다면 치명적인 오류리고 지정해놓은거라 다른 refine이 실행되지 않음
      // return z.NEVER도 해야함. break 같은 느낌인듯
      ctx.addIssue({
        code: "custom",
        message: "This username is already taken",
        path: ["username"],
        fatal: true,
      });
      return z.NEVER;
    }
  })
  .superRefine(async ({ email }, ctx) => {
    const user = await db.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
      },
    });
    if (user) {
      // superRefine에 fatal: true가 있다면 치명적인 오류리고 지정해놓은거라 다른 refine이 실행되지 않음
      // return z.NEVER도 해야함. break 같은 느낌인듯
      ctx.addIssue({
        code: "custom",
        message: "This email is already taken",
        path: ["email"],
        fatal: true,
      });
      return z.NEVER;
    }
  })
  .refine(checkPassword, {
    message: "Both password should be same!!",
    path: ["confirm_password"],
  });
// superRefine(refine할 값 즉 z.object를 말함, RefinementCtx==에러묶음, )

export default async function createAccount(preState: any, formData: FormData) {
  const data = {
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirm_password: formData.get("confirm_password"),
  };

  // zod의 값 인증에 await이 작동하려면 async가 필요함
  // 모든 refine 함수에 대해 await하도록 함 - safeParseAsync
  const result = await formSchema.safeParseAsync(data);

  if (!result.success) {
    return result.error.flatten();
  } else {
    // 두번째 인수 = 알고리즘을 돌릴 횟수
    // hash : promise임
    const hashedPassword = await bcrypt.hash(result.data.password, 12);

    const user = await db.user.create({
      data: {
        username: result.data.username,
        email: result.data.email,
        password: hashedPassword,
      },
      select: {
        id: true,
      },
    });

    const session = await getSession();
    // 쿠키에 원하는 정보 집어 넣기
    session.id = user.id;
    await session.save();
    redirect("/profile");
  }
}
