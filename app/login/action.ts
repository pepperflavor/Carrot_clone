"use server";

export default async function handleForm(preState: any, formData: FormData) {
  console.log(preState);
  await new Promise((resolve) => setTimeout(resolve, 5000));
  console.log("I'm in server!");
  return {
    errors: ["wrong password", "password too short"],
  };
}
