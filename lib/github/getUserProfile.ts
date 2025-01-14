export default async function getUserProfile(access_token: string){

    const data = await fetch("https://api.github.com/user", {
        headers:{
            "Authorization" : `Bearer ${access_token}`
        },
        cache: "no-cache"// next가 기본적으로 request를 저장해서 저장x
    })

    const profileData = await data.json()
    
    return profileData
}