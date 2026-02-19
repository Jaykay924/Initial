import { NextRequest, NextResponse } from "next/server"
import { users } from "../../data"

export async function POST(req: NextRequest) {
    const { currentUser, targetUser } = await req.json()
    if (!currentUser || !targetUser) return NextResponse.json({ ok: false, message: "Missing data" }, { status: 400 })

    const me = users.get(currentUser)
    const target = users.get(targetUser)
    if (!me || !target) return NextResponse.json({ ok: false, message: "User not found" }, { status: 404 })

    if (me.following.has(targetUser)) me.following.delete(targetUser)
    else me.following.add(targetUser)

    return NextResponse.json({ ok: true, following: Array.from(me.following) })
}
