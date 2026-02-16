import { NextResponse } from "next/server"
import { users } from "../login/route"

export async function GET() {
    try {
        const safeUsers = users.map(u => ({
            username: u.username,
            following: u.following,
            posts: u.posts
        }))

        return NextResponse.json(safeUsers)
    } catch (error) {
        console.error("ERROR IN /api/users:", error)
        return NextResponse.json({ error: "Server error" }, { status: 500 })
    }
}
