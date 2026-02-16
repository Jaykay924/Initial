"use client"

import { useState } from "react"

export default function Home() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    async function handleLogin() {
        const res = await fetch("/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        })

        const data = await res.json()
        alert(data.message) // parodyti atsakymą
    }


    return (
        <div style={{ padding: "40px" }}>
            <h1>Mini Facebook Login</h1>

            <div>
                <input
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>

            <div style={{ marginTop: "10px" }}>
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>

            <div style={{ marginTop: "10px" }}>
                <button onClick={handleLogin}>Login</button>
            </div>
        </div>
    )
}
