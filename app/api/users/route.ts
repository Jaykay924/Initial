import { NextRequest, NextResponse } from "next/server"
import { users } from "../../data"

export async function GET(req: NextRequest) {
    return NextResponse.json(users)
}
