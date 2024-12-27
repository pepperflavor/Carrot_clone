"use server";

import { z } from "zod";
import validator from "validator";
import { redirect } from "next/navigation";

const phoneSchema = z
  .string()
  .trim()
  .refine(
    (phone) => validator.isMobilePhone(phone, "ko-KR"),
    "Wrong phone format"
  );

// string으로 입력 받은 값을 강제로 number로 변환
const tokenSchema = z.coerce.number().min(100000).max(999999);

interface ActionState {
  token: boolean;
}

export async function smsVerifycation(
  prevState: ActionState,
  formData: FormData
) {


  const phone = formData.get("phone");
  const token = formData.get("token");
  // 페이지 첫 실행 구분
  if (!prevState.token) {
    const result = phoneSchema.safeParse(phone);

    if (!result.success) {
      return {
        token: false,
        error: result.error.flatten(),
      };
    } else {
      return {
        token: true,
      };
    }
  } else {
    // 첫실행이 아닐떄
    const result = tokenSchema.safeParse(token);
    if (!result.success) {
      return {
        token: true,
      };
    } else {
      // 인증 성공하면 홈화면으로
      redirect("/");
    }
  }
}
