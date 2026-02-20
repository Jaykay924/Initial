export type Post = {
    text: string
    date: string
}

export type User = {
    username: string
    password: string
    posts: Post[]
    following: Set<string>
}

declare global {
    var _users: Map<string, User> | undefined
}

export const users: Map<string, User> =
    global._users ??
    new Map([
        ["alice", { username: "Alice", password: "123", posts: [], following: new Set() }],
        ["bob", { username: "Bob", password: "456", posts: [], following: new Set() }],
        ["charlie", { username: "Charlie", password: "789", posts: [], following: new Set() }],
    ])

if (!global._users) {
    global._users = users
}
