"use client";

import FormInput from "../components/input";
import FormButton from "../components/button";
import SocialLogin from "../components/social-login";

import { useFormState } from "react-dom";
import login from "./action";
import { PASSWORD_MIN_LENGTH } from "@/lib/constants";

export default function LogIn() {
  const [state, action] = useFormState(login, {
    potato: 1,
  } as any);

  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">어서오세요</h1>
        <h2 className="text-xl">Log in with email</h2>
      </div>
      <form action={action} className="flex flex-col gap-3">
        <FormInput name="email" type="email" placeholder="Email" required />
        <FormInput
          name="password"
          type="password"
          placeholder="Password"
          required
          minLength={PASSWORD_MIN_LENGTH}
        />
        <FormButton text="Login" />
      </form>
      <SocialLogin />
    </div>
  );
}
