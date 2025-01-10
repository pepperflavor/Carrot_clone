
import { redirect } from "next/navigation";
import db from "../db";
import randomNickName from "../randomNick";

interface CheckUsernameProps{
    username : string,
}

// 닉네임 중복이면 랜덤닉네임 리턴, 아니면 false
export async function CheckUsername(username: string){
    const isExist = await db.user.findUnique({
        where : {
            username : username + ""
        },
        select:{
            username: true
        }
    })

    const temp =  randomNickName()
    
    if(isExist){
        return temp
    }

    return Boolean(isExist)
}