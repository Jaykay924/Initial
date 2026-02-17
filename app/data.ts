// /app/data.ts
export type Post = {
    text: string
    date: string
}

export type User = {
    username: string
    password: string
    posts: Post[]
    following: string[]
}

// Pradiniai vartotojai
export const users: User[] = [
    { username: "alice", password: "123", posts: [], following: [] },
    { username: "bob", password: "456", posts: [], following: [] },
    { username: "charlie", password: "789", posts: [], following: [] },
]
