import { NextRequest, NextResponse } from "next/server"


//Post tipas
type Post = {
    text:string
    date:string
}

//User tipas
type User = {
    username:string
    password:string
    following: string[]
    posts: Post[]
}


//Vartotojai atminyje
let users: User[] = []

export async function POST(req: NextRequest) {
    const body = await req.json()
    const { username, password } = body
    //Čia yra login/signup logika
    
    //Ieškome vartotojo
    let user = users.find(u => u.username === username)

    //Jei nerastas -> sukuriam
    if (!user) {
        user = {
            username,
            password,
            following: [],
        posts: [
            {
                text: `Hello from ${username}`,
                date: new Date().toISOString()
            }
        ]
        }
        users.push(user)
        
        
        return NextResponse.json({
            ok: true,
            message: "User created"
        })
    }
    
    if (user.password !== password) {
        return NextResponse.json({
            ok: false,
            message: "Wrong password"
        })
    }
    
    return NextResponse.json({
        ok: true,
        message: "Login successful"
    })
}

//Labai svarbu - eksportuojam users
export { users }