import { NextRequest, NextResponse } from "next/server"
import { users } from "../../data"

export async function POST(req: NextRequest) {
    const { currentUser, targetUser } = await req.json()

    if (!currentUser || !targetUser) {
        return NextResponse.json({ ok: false, message: "Missing data" }, { status: 400 })
    }

    const me = users.find(u => u.username === currentUser)
    const target = users.find(u => u.username === targetUser)

    if (!me || !target) {
        return NextResponse.json({ ok: false, message: "User not found" }, { status: 404 })
    }

    if (!me.following) me.following = []

    if (me.following.includes(targetUser)) {
        // Unfollow
        me.following = me.following.filter(u => u !== targetUser)
    } else {
        // Follow
        me.following.push(targetUser)
    }

    return NextResponse.json({ ok: true, following: me.following })
}
