import db from "@/lib/db";
import getAccessToken from "@/lib/github/getAccesstoken";
import getSession from "@/lib/session";
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

//     const accessTokenParams = new URLSearchParams ({
//         client_id: process.env.GITHUB_CLIENT_ID!,
//         client_secret : process.env.GITHUB_CLIENT_SECRET!,
//         code : code,
//     }).toString()
//    const accessTokenURL = `https://github.com/login/oauth/access_token?${accessTokenParams}`
//    const accessTokenResponse = await fetch(accessTokenURL, {
//     method: "POST",
//     headers:{
//         Accept: "application/json"
//     }
//    })
//    const {error, access_token} = await accessTokenResponse.json()


    if(error){
        return new Response(null,{
            status : 400
        } )
    }
    
    //--------
    const userEmailResponse = await fetch("https://api.github.com/user/emails", {
        headers: {
             "Authorization" : `Bearer ${access_token}`
        },
        cache: "no-cache"
    })
    
    const getEmail = await userEmailResponse.json()

    console.log(getEmail[0].email)
    

    // GET request들은 Nextjs의 cache에 의해 저장된다
    const userProfileResponse = await fetch("https://api.github.com/user", {
        headers:{
            "Authorization" : `Bearer ${access_token}`
        },
        cache: "no-cache"// next가 기본적으로 request를 저장해서 저장x
    })

    // login - response 내용을 보면 깃허브에서 쓰는 아이디를 리턴해줌
    const {id, avatar_url, login} = await userProfileResponse.json()


    // console.log("깃허브 아이디 ")
    // console.log(login)
    const user = await db.user.findUnique({
        where:{
            github_id : id + ""
        },
        select: {
            id : true
        }
    })

    if(user){
        const session = await getSession()
        session.id = user.id
        await session.save()
        return redirect("/profile")
    }

    const newUser = await db.user.create({
        data:{
            username: login,
            github_id: id + "",
            avatar : avatar_url,
            email: getEmail[0].email
        },
        select:{
            id: true
        }
    })
    const session = await getSession()
    session.id = newUser.id
    await session.save()
    return redirect("/profile")

}

// 세션관련 패키징
// 일반 이메일가입유저 닉네임 중복 확인
// 유저 이메일 받은걸로 이메일받아서 저장하기
// fetch requst / response 나누기 request 보내는 곳 response json으로 바꾸는 걸 function으로 만들기