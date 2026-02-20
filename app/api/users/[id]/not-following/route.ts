import { NextRequest, NextResponse } from "next/server"
import { users } from "@/app/data"

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    const { searchParams } = new URL(req.url)
    const search = searchParams.get("search")?.toLowerCase() ?? ""

    const me = users.get(id)
    if (!me) {
        return NextResponse.json(
            { ok: false, message: "User not found" },
            { status: 404 }
        )
    }

    const notFollowingUsers = Array.from(users.values())
        .filter(
            u =>
                u.username !== id &&
                !me.following.has(u.username) &&
                u.username.toLowerCase().includes(search)
        )
        .map(u => ({ username: u.username }))

    return NextResponse.json(notFollowingUsers)
}