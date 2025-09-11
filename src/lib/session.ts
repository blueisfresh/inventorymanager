import { cookies } from "next/headers";

// name of the cookie
const SESSION_COOKIE = "session";

export type SessionData = {
    userId: number;
    role: string;
    username: string;
};

// Save session as cookie
export function setSession(session: SessionData) {
    cookies().set(SESSION_COOKIE, JSON.stringify(session), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 2, // 2 hours
    });
}

// Get session if it exists
export function getSession(): SessionData | null {
    const cookie = cookies().get(SESSION_COOKIE);
    if (!cookie) return null;

    try {
        return JSON.parse(cookie.value) as SessionData;
    } catch {
        return null;
    }
}

// Destroy session
export function clearSession() {
    cookies().delete(SESSION_COOKIE);
}