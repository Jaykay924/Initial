import { NextRequest, NextResponse } from "next/server"
import { users } from "../../data"

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const currentUser = searchParams.get("user")
    if (!currentUser) return NextResponse.json({ ok: false, message: "Missing user" }, { status: 400 })

    const me = users.get(currentUser)
    if (!me) return NextResponse.json({ ok: false, message: "User not found" }, { status: 404 })

    const followingUsers = Array.from(users.values()).filter(u => me.following.has(u.username))
    const feedPosts = followingUsers.flatMap(u => u.posts.map(p => ({ ...p, author: u.username })))
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    return NextResponse.json(feedPosts)
}
