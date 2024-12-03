"use client";

import FormInput from "../components/form-input";
import FormButton from "../components/form-button";
import SocialLogin from "../components/social-login";

import { useFormState } from "react-dom";
import handleForm from "./action";

export default function LogIn() {
  const [state, action] = useFormState(handleForm, {
    potato: 1,
  } as any);

  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">어서오세요</h1>
        <h2 className="text-xl">Log in with email</h2>
      </div>
      <form action={action} className="flex flex-col gap-3">
        <FormInput type="email" placeholder="Email" required errors={[]} />
        <FormInput
          type="password"
          placeholder="Password"
          required
          errors={state.errors ?? []}
        />
        <FormButton text="Login" />
      </form>
      <SocialLogin />
    </div>
  );
}
