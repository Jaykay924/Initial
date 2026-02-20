"use client"

import { useState } from "react"

type Props = {
    onLoginAction: (username: string, password: string) => Promise<void>
}

export default function Login({ onLoginAction }: Props) {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-10 rounded-xl shadow-lg w-full max-w-sm">
                <h1 className="text-2xl font-bold text-center mb-6 text-blue-600">
                    Mini Facebook
                </h1>

                <input
                    className="w-full p-3 mb-4 border rounded text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                />

                <input
                    type="password"
                    className="w-full p-3 mb-4 border rounded text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />

                <button
                    onClick={() => onLoginAction(username, password)}
                    className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 hover:scale-105 transition-transform duration-200"
                >
                    Login
                </button>
            </div>
        </div>
    )
}