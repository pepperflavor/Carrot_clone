"use server";

import { PASSWORD_MIN_LENGTH } from "@/lib/constants";
import { z } from "zod";

const formSchema = z.object({
  email: z.string().email().toLowerCase(),
  password: z.string().min(PASSWORD_MIN_LENGTH),
});

export default async function login(preState: any, formData: FormData) {
  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
  };
  return {
    errors: ["wrong password", "password too short"],
  };
}
