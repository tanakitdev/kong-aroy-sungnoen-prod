"use client"

import { createContext, useContext, useEffect, useState } from "react"

type AuthContextType = {
    isLoggedIn: boolean
    userId: string | null
    login: (token: string, userId: string) => void
    logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [userId, setUserId] = useState<string | null>(null)

    useEffect(() => {
        const token = localStorage.getItem("token")
        const uid = localStorage.getItem("userId")
        if (token && uid) {
            setIsLoggedIn(true)
            setUserId(uid)
        }
    }, [])

    const login = (token: string, userId: string) => {
        localStorage.setItem("token", token)
        localStorage.setItem("userId", userId)
        setIsLoggedIn(true)
        setUserId(userId)
    }

    const logout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("userId")
        setIsLoggedIn(false)
        setUserId(null)
    }

    return (
        <AuthContext.Provider value={{ isLoggedIn, userId, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) throw new Error("useAuth must be used within AuthProvider")
    return context
}
