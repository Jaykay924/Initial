import { NextResponse } from "next/server"
import { users } from "@/app/data"

export async function GET(
    _req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    const user = users.get(id)

    if (!user) {
        return NextResponse.json(
            { ok: false, message: "User not found" },
            { status: 404 }
        )
    }

    return NextResponse.json({
        username: user.username,
        posts: user.posts,
        following: Array.from(user.following),
    })
}