import { NextResponse } from "next/server"
import { users } from "@/app/data"

export async function GET(
    _req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    const me = users.get(id)

    if (!me) {
        return NextResponse.json(
            { ok: false, message: "User not found" },
            { status: 404 }
        )
    }

    const followingUsers = Array.from(users.values())
        .filter(u => me.following.has(u.username))
        .map(u => ({
            username: u.username,
            posts: u.posts,
        }))

    return NextResponse.json(followingUsers)
}