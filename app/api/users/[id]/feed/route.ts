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

    const feedPosts = Array.from(users.values())
        .filter(u => me.following.has(u.username))
        .flatMap(u =>
            u.posts.map(p => ({
                ...p,
                author: u.username,
            }))
        )
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    return NextResponse.json(feedPosts)
}