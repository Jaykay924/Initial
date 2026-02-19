"use client"

import { useState } from "react"

type Props = {
    onLoginAction: (username: string, password: string) => Promise<void>
}

export default function Login({ onLoginAction }: Props) {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    return (
        <div style={{ padding: "40px" }}>
            <h1>Mini Facebook Login</h1>

            <input
                placeholder="Username"
                value={username}
                onChange={e => setUsername(e.target.value)}
            />

            <br /><br />

            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
            />

            <br /><br />

            <button onClick={() => onLoginAction(username, password)}>
                Login
            </button>
        </div>
    )
}
