import db from "../db";

export function CheckUsername(username: string){
    const isExist = db.user.findUnique({
        where : {
            username : username
        }
    })
}