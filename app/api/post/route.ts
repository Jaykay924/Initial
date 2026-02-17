import { NextRequest, NextResponse } from "next/server"
import { users } from "../../data"

export async function POST(req: NextRequest) {
    const { currentUser, text } = await req.json()

    if (!currentUser || !text) {
        return NextResponse.json({ ok: false, message: "Missing data" }, { status: 400 })
    }

    const user = users.find(u => u.username === currentUser)
    if (!user) {
        return NextResponse.json({ ok: false, message: "User not found" }, { status: 404 })
    }

    if (!user.posts) user.posts = []
    user.posts.push({ text, date: new Date().toISOString() })

    return NextResponse.json({ ok: true })
}
