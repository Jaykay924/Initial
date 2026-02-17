"use client"

import { useState, useEffect } from "react"

export default function Home() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [currentUser, setCurrentUser] = useState<string | null>(null)
    const [users, setUsers] = useState<any[]>([])
    const [search, setSearch] = useState("")
    const [newPost, setNewPost] = useState("")

    // Logout funkcija
    function handleLogout() {
        setCurrentUser(null)
        setUsers([])
        setUsername("")
        setPassword("")
        setSearch("")
        setNewPost("")
    }

    // Login funkcija
    async function handleLogin() {
        const res = await fetch("/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        })
        const data = await res.json()

        if (data.ok) {
            setCurrentUser(username)
            loadUsers()
        } else {
            alert(data.message)
        }
    }

    // Load all users
    async function loadUsers() {
        const res = await fetch("/api/users")
        const data = await res.json()
        setUsers(data)
    }

    // Toggle follow/unfollow
    async function toggleFollow(targetUser: string) {
        if (!currentUser) return
        await fetch("/api/follow", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ currentUser, targetUser }),
        })
        loadUsers()
    }

    // Post new feed
    async function handlePost() {
        if (!newPost.trim() || !currentUser) return

        await fetch("/api/post", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ currentUser, text: newPost }),
        })

        setNewPost("")
        loadUsers()
    }

    // Automatiškai load users jei prisijungęs
    useEffect(() => {
        if (currentUser) loadUsers()
    }, [currentUser])

    // Jei neprisijungęs -> rodom login
    if (!currentUser) {
        return (
            <div style={{ padding: "40px" }}>
                <h1>Mini Facebook Login</h1>
                <input
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <br /><br />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <br /><br />
                <button onClick={handleLogin}>Login</button>
            </div>
        )
    }

    const me = users.find(u => u.username === currentUser)

    const followingUsers = users.filter(u => me?.following.includes(u.username))

    const notFollowingUsers = users.filter(
        u =>
            u.username !== currentUser &&
            !me?.following.includes(u.username) &&
            u.username.toLowerCase().includes(search.toLowerCase())
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
        <>
            <div style={{ display: "flex", padding: "20px" }}>
                {/* Kairė pusė */}
                <div style={{ width: "30%" }}>
                    <h3>Users</h3>
                    <input
                        placeholder="Search user..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ marginBottom: "10px", width: "100%" }}
                    />
                    {notFollowingUsers.map(u => (
                        <div key={u.username}>
                            {u.username}
                            <button onClick={() => toggleFollow(u.username)}>Follow</button>
                        </div>
                    ))}
                </div>

                {/* Vidurys */}
                <div style={{ width: "40%", padding: "0 20px" }}>
                    <h3>Feed</h3>

                    {/* Naujas post */}
                    <div style={{ marginBottom: "20px" }}>
                        <textarea
                            placeholder="What's on your mind?"
                            value={newPost}
                            onChange={(e) => setNewPost(e.target.value)}
                            style={{ width: "100%", height: "60px" }}
                        />
                        <button onClick={handlePost} style={{ marginTop: "5px" }}>
                            Post
                        </button>
                    </div>

                    {feedPosts.map((post, i) => (
                        <div key={i} style={{ marginBottom: "10px" }}>
                            <strong>{post.author}</strong>
                            <p>{post.text}</p>
                            <small>{new Date(post.date).toLocaleString()}</small>
                        </div>
                    ))}
                </div>

                {/* Dešinė pusė */}
                <div style={{ width: "30%" }}>
                    <h3>Following</h3>
                    {followingUsers.map(u => (
                        <div key={u.username}>
                            {u.username}
                            <button onClick={() => toggleFollow(u.username)}>Unfollow</button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Logout */}
            <button
                onClick={handleLogout}
                style={{
                    position: "fixed",
                    bottom: "20px",
                    right: "20px",
                    padding: "10px 20px",
                    backgroundColor: "#f44336",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer"
                }}
            >
                Logout
            </button>
        </>
    )
}
