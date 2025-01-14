export default async function getUserEmail(access_token: string){

    const data = await fetch("https://api.github.com/user/emails", {
        headers:{
            "Authorization" : `Bearer ${access_token}`
        },
        cache: "no-cache"// next가 기본적으로 request를 저장해서 저장x
    })

    const email = await data.json()
    
    return email
}