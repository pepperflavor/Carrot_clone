"use server";

import bcrypt from "bcrypt"

import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
  PASSWORD_REGEX_ERROR,
} from "@/lib/constants";
import db from "@/lib/db";
import { z } from "zod";

const checkUsername = (username: string) => !username.includes("potato");

const checkPassword = ({
  password,
  confirm_password,
}: {
  password: string;
  confirm_password: string;
}) => password === confirm_password;


const checkUniqueUsername = async( username: string)=>{
      // 에러가 발생하지 않으면 db에서 값 확인 & db저장
      const user = await db.user.findUnique({
        where:{
          username: username
        },
        select:{
          id : true
        }
      })

    //  if(user){
    //   return false
    //  }else{
    //   return true
    //  }
    // if문이랑 같음
    return !Boolean(user)
}

const checkUniqueEmail = async(email : string)=>{
  const user = await db.user.findUnique({
    where:{
      email: email
    },
    select:{
      id : true
    }
  });

  return !Boolean(user)
}


const formSchema = z
  .object({
    username: z
      .string({
        invalid_type_error: "USername must be a string!!",
        required_error: "Empty username???",
      })
      .toLowerCase()
      .trim()
      .refine(checkUsername, "Potato can't allowed here!!")
      .refine(checkUniqueUsername, "This username is already taken"),
    email: z.string().email().toLowerCase().refine(checkUniqueEmail, "There is an account already registered with that email"),
    password: z
      .string()
      .min(PASSWORD_MIN_LENGTH),
      // .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
    confirm_password: z.string().min(PASSWORD_MIN_LENGTH),
  })
  .refine(checkPassword, {
    message: "Both password should be same!!",
    path: ["confirm_password"],
  });

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
  const hashedPassword = await bcrypt.hash(result.data.password, 12)
  console.log(hashedPassword)

  const user = await db.user.create({
    data:{
      username: result.data.username,
      email: result.data.email,
      password: hashedPassword
    },
    select:{
      id: true
    }
  })
  console.log(user)
  }
}
