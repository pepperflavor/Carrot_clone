import { CheckUsername } from "@/lib/auth/checkUsername";
import db from "@/lib/db";
import checkGithubId from "@/lib/github/checkGithubId";
import getAccessToken from "@/lib/github/getAccesstoken";
import getUserEmail from "@/lib/github/getUserEmail";
import getUserProfile from "@/lib/github/getUserProfile";

import saveSession from "@/lib/session/saveSession";
import { notFound, redirect } from "next/navigation";
import { NextRequest } from "next/server";

// github에서 돌려준 access token처리
export async function GET(request : NextRequest){
    const code = request.nextUrl.searchParams.get("code")
    if(!code){
        return notFound()
    }

    const reponseToken = await getAccessToken(code)

    const {error, access_token} = await reponseToken.json()


    if(error){
        return new Response(null,{
            status : 400
        } )
    }
    

    // login - response 내용을 보면 깃허브에서 쓰는 아이디를 리턴해줌
    const {id, avatar_url, login} = await getUserProfile(access_token)

    
    // 깃허브 아이디 중복검사
    const isExistGit = await checkGithubId(id.toString())
    
    // 닉네임 중복검사
    const isExistNick = await CheckUsername(login)

    // 이메일 정보 요청
    const email = await getUserEmail(access_token)

    if(typeof isExistNick === "string"){
        const newUser = await db.user.create({
            data:{
                username: isExistNick,
                github_id: id + "",
                avatar : avatar_url,
                email: email[0].email
            },
            select:{
                id: true
            }
        })
    
        await saveSession(newUser.id)
        return redirect("/profile")
}

}

// 세션관련 패키징 V
// 일반 이메일가입유저 닉네임 중복 확인
// 유저 이메일 받은걸로 이메일받아서 저장하기
// fetch requst / response 나누기 request 보내는 곳 response json으로 바꾸는 걸 function으로 만들기


    /*
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
*/
