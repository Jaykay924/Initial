import { NextRequest, NextResponse } from "next/server"

//Paprasti vartotojai atminyje
let users: { username: string; password: string }[] = []

export async function POST(req: NextRequest) {
    const body = await req.json()
    const { username, password } = body
    //Čia yra login/signup logika
    
    //Ieškome vartotojo
    let user = users.find(u => u.username === username)
    
    if (!user) {
        //Sukuriam naują vartotoją
        user = { username, password }
        users.push(user)
        return NextResponse.json({ ok: true, message: "User created" })
    }
    
    if (user.password !== password) {
        return NextResponse.json({ ok: false, message: "Wrong password" })
    }
    
    return NextResponse.json({ ok: true, message: "Login successful" })
}
