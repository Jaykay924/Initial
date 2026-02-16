"use client"

import { useState } from "react"

export default function Home() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [currentUser, setCurrentUser] = useState<string | null>(null)
    const [users, setUsers] = useState<any[]>([])

    async function handleLogin() {
        const res = await fetch("/api/login", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({username, password}),
        })

        const data = await res.json()

        if (data.ok) {
            setCurrentUser(username)
            loadUsers()
        } else {
            alert(data.message)
        }
    }

    async function loadUsers() {
        const res = await fetch("/api/users")
        const data = await res.json()
        setUsers(data)
    }

    async function toggleFollow(targetUser: string) {
        await fetch("/api/follow", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({currentUser, targetUser}),
        })

        loadUsers()
    }

//Jei neprisijungęs -> rodom login
    if (!currentUser) {
        return (
            <div style={{padding: "40px"}}>
                <h1>Mini Facebook Login</h1>


                <input
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

                <br/><br/>

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <br/><br/>


                <button onClick={handleLogin}>Login</button>
            </div>
        )
    }

    const me = users.find(u => u.username === currentUser)

    const followingUsers = users.filter(
        u => me?.following.includes(u.username)
    )

    const notFollowingUsers = users.filter(
        u => u.username !== currentUser && !me?.following.includes(u.username)
    )

    const feedPosts = followingUsers
        .flatMap(u =>
            u.posts.map((p: any) => ({
                ...p,
                author: u.username
            }))
        )
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    return (
        <div style={{display: "flex", padding: "20px"}}>

            {/* Kairė pusė */}
            <div style={{width: "30%"}}>
                <h3>Users</h3>

                {notFollowingUsers.map(u => (
                    <div key={u.username}>
                        {u.username}
                        <button onClick={() => toggleFollow(u.username)}>
                            Follow
                        </button>
                    </div>
                ))}
            </div>

            {/* Vidurys */}
            <div style={{width: "40%", padding: "0 20px"}}>
                <h3>Feed</h3>

                {feedPosts.map((post, i) => (
                    <div key={i} style={{marginBottom: "10px"}}>
                        <strong>{post.author}</strong>
                        <p>{post.text}</p>
                        <small>{new Date(post.date).toLocaleString()}</small>
                    </div>
                ))}
            </div>

            {/* Dešinė pusė */}
            <div style={{width: "30%"}}>
                <h3>Following</h3>

                {followingUsers.map(u => (
                    <div key={u.username}>
                        {u.username}
                        <button onClick={() => toggleFollow(u.username)}>
                            Unfollow
                        </button>
                    </div>
                ))}
            </div>

        </div>
    )
}
