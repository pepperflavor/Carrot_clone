"use server";
import { z } from "zod";

// 정규표현식
const passwordRegex = new RegExp(
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*?[#?!@$%^&*]).+$/
);

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
        invalid_type_error: "USername must be a string!!",
        required_error: "Empty username???",
      })
      .min(3, "Way too short!!!")
      // .max(10, "That is too Loooooong!!!")
      .toLowerCase()
      .trim()
      .refine(checkUsername, "Potato can't allowed here!!"),
    email: z.string().email().toLowerCase(),
    password: z
      .string()
      .min(4)
      .regex(
        passwordRegex,
        "A password must have lowercase, UPPERCASE, a number and special charaters"
      ),
    confirm_password: z.string().min(4),
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

  const result = formSchema.safeParse(data);

  if (!result.success) {
    console.log(result.error.flatten());
    return result.error.flatten();
  } else {
    console.log(result.data);
  }
}
