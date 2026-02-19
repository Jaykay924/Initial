import { NextRequest, NextResponse } from "next/server"
import { users } from "../../data"

export async function POST(req: NextRequest) {
    const { username, password } = await req.json()
    if (!username || !password) return NextResponse.json({ ok: false, message: "Missing data" }, { status: 400 })

    let user = users.get(username)
    if (!user) {
        user = { username, password, posts: [], following: new Set() }
        users.set(username, user)
        return NextResponse.json({ ok: true, message: "User created" })
    }

    if (user.password !== password) return NextResponse.json({ ok: false, message: "Wrong password" })

    return NextResponse.json({ ok: true, message: "Login successful" })
}
