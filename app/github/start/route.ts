import { redirect } from "next/navigation"

export function GET(){
    const basURL = "https://github.com/login/oauth/authorize"
    const params = {
        client_id : process.env.GITHUB_CLIENT_ID!,
        scope : "read:user, user:email",
        allow_singup: "true" // 깃헙 계정없으면 생성할 수 있도록 함
    }
    const formattedParams = new URLSearchParams(params).toString()
    const finalURL = `${basURL}?${formattedParams}`

    return redirect(finalURL)
}