import FormInput from "../components/form-input";
import FormButton from "../components/form-button";
import SocialLogin from "../components/social-login";

export default function LogIn() {
  const handleForm = async () => {
    "use server";
    console.log("I'm in server!");
  };

  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">어서오세요</h1>
        <h2 className="text-xl">Log in with email</h2>
      </div>
      <form action={handleForm} className="flex flex-col gap-3">
        <FormInput type="email" placeholder="Email" required errors={[]} />
        <FormInput
          type="password"
          placeholder="Password"
          required
          errors={[]}
        />

        <FormButton text="Login" loading={false}></FormButton>
      </form>
      <SocialLogin />
    </div>
  );
}
