import { NextResponse } from "next/server"
import { users } from "../../data"

export async function GET() {
    const allUsers = Array.from(users.values()).map(u => ({
        username: u.username,
        posts: u.posts,
        following: Array.from(u.following),
    }))

    return NextResponse.json(allUsers)
}