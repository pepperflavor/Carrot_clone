export default function randomNickName(){
      
    const nickArr = require("/public/NickNameData.json")

        const randomNick = nickArr.determiners[ Math.floor(Math.random() * nickArr.determiners.length)
    ] + " " +  nickArr.animals[ Math.floor(Math.random() * nickArr.animals.length)] + ( Math.random()* 10000) + ""

  
    return randomNick
}