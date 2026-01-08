import { cookies } from "next/headers";

// name of the cookie
const SESSION_COOKIE = "session";

export type SessionData = {
  userId: number;
  role: string;
  username: string;
  accessToken: string; // <--- ADD THIS to store the JWT
};

// Save session as cookie
export async function setSession(session: SessionData) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, JSON.stringify(session), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 2, // 2 hours
  });
}

// Get session if it exists
export async function getSession(): Promise<SessionData | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(SESSION_COOKIE);
  if (!cookie) return null;

  try {
    return JSON.parse(cookie.value) as SessionData;
  } catch {
    return null;
  }
}

// Destroy session
export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}
