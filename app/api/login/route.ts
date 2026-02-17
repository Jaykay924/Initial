import { NextRequest, NextResponse } from "next/server"
import { users, User } from "../../data"

export async function POST(req: NextRequest) {
    const { username, password } = await req.json()

    let user = users.find(u => u.username === username)

    if (!user) {
        // Sukuriam naują vartotoją
        user = { username, password, posts: [], following: [] }
        users.push(user)
        return NextResponse.json({ ok: true, message: "User created" })
    }

    if (user.password !== password) {
        return NextResponse.json({ ok: false, message: "Wrong password" })
    }

    return NextResponse.json({ ok: true, message: "Login successful" })
}
