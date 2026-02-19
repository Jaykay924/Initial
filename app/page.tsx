"use client"

import { useState, useEffect } from "react"
import Login from "./components/login"

type User = {
    username: string
    posts: { text: string; date: string }[]
    following: string[]
}

type FeedPost = {
    text: string
    date: string
    author: string
}

export default function Home() {
    const [currentUser, setCurrentUser] = useState<string | null>(null)
    const [allUsers, setAllUsers] = useState<User[]>([])
    const [feedPosts, setFeedPosts] = useState<FeedPost[]>([])
    const [search, setSearch] = useState("")
    const [newPost, setNewPost] = useState("")

    async function handleLogin(username: string, password: string) {
        const res = await fetch("/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        })

        const data = await res.json()

        if (data.ok) {
            setCurrentUser(username)
        } else {
            alert(data.message)
        }
    }

    async function loadUsers() {
        const res = await fetch("/api/users")
        const data = await res.json()
        setAllUsers(data)
    }

    async function loadFeed() {
        if (!currentUser) return

        const res = await fetch(`/api/feed?user=${currentUser}`)
        const data = await res.json()

        if (Array.isArray(data)) {
            setFeedPosts(data)
        } else {
            setFeedPosts([])
        }
    }

    async function handleFollow(targetUser: string) {
        if (!currentUser) return

        await fetch("/api/follow", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ currentUser, targetUser }),
        })

        await loadUsers()
        await loadFeed()
    }

    async function handlePost() {
        if (!newPost.trim() || !currentUser) return

        await fetch("/api/post", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ currentUser, text: newPost }),
        })

        setNewPost("")
        await loadFeed()
    }

    useEffect(() => {
        if (!currentUser) return

        const init = async () => {
            await loadUsers()
            await loadFeed()
        }

        void init()
    }, [currentUser])


    if (!currentUser) {
        return <Login onLoginAction={handleLogin} />
    }


    const me = allUsers.find(u => u.username === currentUser)

    if (!me) return null

    const followingUsers = allUsers.filter(u =>
        me.following.includes(u.username)
    )

    const notFollowingUsers = allUsers.filter(u =>
        u.username !== currentUser &&
        !me.following.includes(u.username) &&
        u.username.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <>
            <div style={{ display: "flex", padding: "20px" }}>
                <div style={{ width: "30%" }}>
                    <h3>Users</h3>

                    <input
                        placeholder="Search..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{ marginBottom: "10px", width: "100%" }}
                    />

                    {notFollowingUsers.map(u => (
                        <div key={u.username}>
                            {u.username}
                            <button onClick={() => handleFollow(u.username)}>
                                Follow
                            </button>
                        </div>
                    ))}
                </div>

                <div style={{ width: "40%", padding: "0 20px" }}>
                    <h3>Feed</h3>

                    <textarea
                        placeholder="What's on your mind?"
                        value={newPost}
                        onChange={e => setNewPost(e.target.value)}
                        style={{ width: "100%", height: "60px" }}
                    />

                    <button
                        onClick={handlePost}
                        style={{ marginTop: "5px" }}
                    >
                        Post
                    </button>

                    {feedPosts.map((post, i) => (
                        <div key={i} style={{ marginBottom: "10px" }}>
                            <strong>{post.author}</strong>
                            <p>{post.text}</p>
                            <small>
                                {new Date(post.date).toLocaleString()}
                            </small>
                        </div>
                    ))}
                </div>

                <div style={{ width: "30%" }}>
                    <h3>Following</h3>

                    {followingUsers.map(u => (
                        <div key={u.username}>
                            {u.username}
                            <button onClick={() => handleFollow(u.username)}>
                                Unfollow
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <button
                onClick={() => setCurrentUser(null)}
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
