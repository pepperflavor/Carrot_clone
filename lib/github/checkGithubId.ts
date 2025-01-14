import  db  from '@/lib/db';
import saveSession from '../session/saveSession';
import { redirect } from 'next/navigation';


export default async function checkGithubId(id : string){

    console.log("깃 아이디 : ")
    console.log(id)
     
    const isExist = await db.user.findUnique({
        where:{
            github_id : id + ""
        },
        select:{
            id: true
        }
    })
    
    console.log("존재하는지 ")
    console.log(isExist)

    // 깃허브아이디가 존재하면 바로 profile 페이지로 이동
    if(isExist){
        await saveSession(isExist.id)
        return redirect("/profile")
    }

    return Boolean(isExist)
}