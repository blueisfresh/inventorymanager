// src/lib/actions/auth.ts
"use server"; // WICHTIG: Muss in der ersten Zeile stehen

import { setSession } from "@/lib/session";
import { redirect } from "next/navigation";

const JAVA_API_BASE = "http://localhost:8080/api";

export async function loginAction(prevState: any, formData: FormData) {
  const username = formData.get("username");
  const password = formData.get("password");

  try {
    // 1. Login bei Spring Boot AuthController
    const res = await fetch(`${JAVA_API_BASE}/auth/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const result = await res.json();

    if (!res.ok) {
      return { error: result.message || "Login fehlgeschlagen" };
    }

    // result.data enthält den accessToken
    const accessToken = result.data.accessToken;

    // 2. User-Details von Spring Boot UserController holen (für ID und Rolle)
    const profileRes = await fetch(`${JAVA_API_BASE}/users/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    const profileResult = await profileRes.json();
    const user = profileResult.data;

    if (!profileRes.ok) {
      return { error: "Benutzerprofil konnte nicht geladen werden" };
    }

    // 3. Die Session im Next.js Cookie speichern
    await setSession({
      userId: user.id,
      username: user.username,
      role: user.role, // z.B. ROLE_ADMINISTRATOR
      accessToken: accessToken,
    });
  } catch (e) {
    console.error("Login Error:", e);
    return { error: "Verbindung zum Java-Server fehlgeschlagen" };
  }

  // 4. Nach erfolgreichem Login weiterleiten
  redirect("/");
}
