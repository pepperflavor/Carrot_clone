"use server";

import twilio from "twilio";
import crypto from "crypto"
import { z } from "zod";
import validator from "validator";
import { redirect } from "next/navigation";
import db from "@/lib/db";
import { error } from "console";
import saveSession from "@/lib/session/saveSession";
import getSession from "@/lib/session";

const phoneSchema = z
  .string()
  .trim()
  .refine(
    (phone) => validator.isMobilePhone(phone, "ko-KR"),
    "Wrong phone format"
  );

  async function checkTokenExist(token: number){
    const exist = await db.sMSToken.findUnique({
      where:{
        token: token.toString()
      },
      select:{
        id: true
      }
    })
    return Boolean(exist)
  }

// string으로 입력 받은 값을 강제로 number로 변환
const tokenSchema = z.coerce.number().min(100000).max(999999).refine(checkTokenExist, "This token dose not exist.");

interface ActionState {
  token: boolean;
}

async function getToken() {
  const token = crypto.randomInt(100000, 999999).toString()
  // 랜덤 생성한 토큰인데 기존 유저와 중복될 수도 있으므로
  const exist = await db.sMSToken.findUnique({
    where : {
      token
    },
    select:{
      id : true
    }
  })
  if(exist){
    return getToken()
  }else{
    return token
  }
}


export async function smsVerifycation(
  prevState: ActionState,
  formData: FormData
) {

  const phone = formData.get("phone");
  const token = formData.get("token");
  // 페이지 첫 실행 구분
  if (!prevState.token) {
    const result =  phoneSchema.safeParse(phone);

    if (!result.success) {
      return {
        token: false,
        error: result.error.flatten(),
      };
    } else {
      // 이전 토큰 삭제
      await db.sMSToken.deleteMany({
        where: {
          user : {
            phone: result.data
          }
        }
      })

      const token = await getToken()
      await db.sMSToken.create({
        data:{
          token,
          user:{
            connectOrCreate:{
              where:{
                phone: result.data
              },
              create:{
                phone: result.data,
                username: crypto.randomBytes(10).toString("hex")
              }
            }
          }
        }
      })
      // 새 토큰 생성후 sms로 보내주기- twilio
      const client = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN,
      )
      await client.messages.create({
        body: `Your Karrot verification code is ${token}`,
        from: process.env.TWILIO_PHONE_NUMBER!,
        to: process.env.MY_PHONE_NUMBER!,
        // result.data여야 하는데 체험판이라 내번호 적음
      })
      return {
        token: true,
      };
    }
  } else {
    // 첫실행이 아닐떄
    const result = await tokenSchema.spa(token);
    if (!result.success) {
      return {
        token: true,
        error: result.error.flatten()
      };
    } else {
      const token = await db.sMSToken.findUnique({
        where: {
          token: result.data.toString(),
        },
        select: {
          id: true,
          userId: true,
        },
      });
      const session = await getSession();
      // session.id = token!.userId;
      // await session.save();
      await saveSession(token!.userId)
      await db.sMSToken.delete({
        where: {
          id: token!.id,
        },
      });
      redirect("/profile");
    }
  }
}
