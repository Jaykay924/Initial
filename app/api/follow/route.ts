import { NextRequest, NextResponse } from "next/server"
import { users } from "../login/route"

export async function POST(req: NextRequest) {
    const body = await req.json()
    const { currentUser, targetUser } = body

    const user = users.find(u => u.username === currentUser)

    if (!user) {
        return NextResponse.json({ ok: false })
    }

    const isFollowing = user.following.includes(targetUser)

    if (isFollowing) {
        // Unfollow
        user.following = user.following.filter(u => u !== targetUser)
    } else {
        // Follow
        user.following.push(targetUser)
    }

    return NextResponse.json({ ok: true })
}
