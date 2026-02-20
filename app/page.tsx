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
    const [me, setMe] = useState<User | null>(null)
    const [followingUsers, setFollowingUsers] = useState<User[]>([])
    const [notFollowingUsers, setNotFollowingUsers] = useState<User[]>([])
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
        if (data.ok) setCurrentUser(username)
        else alert(data.message)
    }

    async function loadMe() {
        if (!currentUser) return
        const res = await fetch(`/api/users/${currentUser}`)
        const data = await res.json()
        setMe(data.ok === false ? null : data)
    }

    async function loadFollowing() {
        if (!currentUser) return
        const res = await fetch(`/api/users/${currentUser}/following`)
        const data = await res.json()
        setFollowingUsers(Array.isArray(data) ? data : [])
    }

    async function loadNotFollowing() {
        if (!currentUser) return
        const res = await fetch(
            `/api/users/${currentUser}/not-following?search=${search}`
        )
        const data = await res.json()
        setNotFollowingUsers(Array.isArray(data) ? data : [])
    }

    async function loadFeed() {
        if (!currentUser) return
        const res = await fetch(`/api/users/${currentUser}/feed`)
        const data = await res.json()
        setFeedPosts(Array.isArray(data) ? data : [])
    }

    async function handleFollow(targetUser: string) {
        if (!currentUser) return
        await fetch("/api/follow", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ currentUser, targetUser }),
        })
        await refreshAll()
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

    async function refreshAll() {
        await loadMe()
        await loadFollowing()
        await loadNotFollowing()
        await loadFeed()
    }

    useEffect(() => {
        if (!currentUser) return
        void refreshAll()
    }, [currentUser])

    useEffect(() => {
        if (!currentUser) return
        void loadNotFollowing()
    }, [search])

    if (!currentUser) return <Login onLoginAction={handleLogin} />
    if (!me) return null

    return (
        <div className="bg-gray-100 min-h-screen p-5">
            <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-5">

                {/* LEFT - NOT FOLLOWING */}
                <div className="lg:w-1/3">
                    <h3 className="text-xl font-bold mb-3 !text-black">Users</h3>
                    <input
                        className="w-full p-3 border rounded mb-3 text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Search..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                    <div className="space-y-3">
                        {notFollowingUsers.map(u => (
                            <div
                                key={u.username}
                                className="flex justify-between items-center bg-white p-3 rounded shadow"
                            >
                                <span className="font-medium text-black text-base">{u.username}</span>
                                <button
                                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 hover:scale-105 transition-transform duration-200"
                                    onClick={() => handleFollow(u.username)}
                                >
                                    Follow
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CENTER - FEED */}
                <div className="lg:w-2/5 flex flex-col gap-5 px-5">
                    <h3 className="text-xl font-bold mb-3 !text-black">Feed</h3>
                    <div className="bg-white p-4 rounded shadow">
                        <textarea
                            className="w-full p-3 border rounded mb-3 text-black text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="What's on your mind?"
                            value={newPost}
                            onChange={e => setNewPost(e.target.value)}
                        />
                        <button
                            className="bg-green-500 text-white px-5 py-2 rounded hover:bg-green-600 hover:scale-105 transition-transform duration-200"
                            onClick={handlePost}
                        >
                            Post
                        </button>
                    </div>

                    <div className="space-y-4">
                        {feedPosts.map((post, i) => (
                            <div
                                key={i}
                                className="p-4 border rounded shadow bg-white"
                            >
                                <strong className="block mb-1 text-black text-base">{post.author}</strong>
                                <p className="mb-1 text-black text-base">{post.text}</p>
                                <small className="text-gray-500">{new Date(post.date).toLocaleString()}</small>
                            </div>
                        ))}
                    </div>
                </div>

                {/* RIGHT - FOLLOWING */}
                <div className="lg:w-1/3">
                    <h3 className="text-xl font-bold mb-3 !text-black">Following</h3>
                    <div className="space-y-3">
                        {followingUsers.map(u => (
                            <div
                                key={u.username}
                                className="flex justify-between items-center bg-white p-3 rounded shadow"
                            >
                                <span className="font-medium text-black text-base">{u.username}</span>
                                <button
                                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 hover:scale-105 transition-transform duration-200"
                                    onClick={() => handleFollow(u.username)}
                                >
                                    Unfollow
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Logout */}
            <button
                onClick={() => setCurrentUser(null)}
                className="fixed bottom-5 right-5 px-5 py-2 bg-red-500 text-white rounded hover:bg-red-600 hover:scale-105 transition-transform duration-200"
            >
                Logout
            </button>
        </div>
    )
}