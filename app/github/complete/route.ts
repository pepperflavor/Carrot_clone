import { notFound } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(request : NextRequest){
    const code = request.nextUrl.searchParams.get("code")
    if(!code){
        return notFound()
    }

    const accessTokenParams = new URLSearchParams ({
        client_id: process.env.GITHUB_CLIENT_ID!,
        client_secret : process.env.GITHUB_CLIENT_SECRET!,
        code : code,
    }).toString()
   const accessTokenURL = `https://github.com/login/oauth/access_token?${accessTokenParams}`
   const accessTokenResponse = await fetch(accessTokenURL, {
    method: "POST",
    headers:{
        Accept: "application/json"
    }
   })

   const {error, access_token} = await accessTokenResponse.json()
    if(error){
        return new Response(null,{
            status : 400
        } )
    }
    // GET request들은 Nextjs의 cache에 의해 저장된다
    const userProfileResponse = await fetch("https://api.github.com/user", {
        headers:{
            "Authorization" : `Bear ${access_token}`
        },
        cache: "no-cache"
    })
    const userProfileData = await userProfileResponse.json()
   return Response.json({access_token})
}