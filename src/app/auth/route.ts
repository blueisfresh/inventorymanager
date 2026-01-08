import { NextResponse } from "next/server";
import { setSession } from "@/lib/session";

const JAVA_API_BASE = "http://localhost:8080/api";

export async function GET(req: Request) {
  const header = req.headers.get("authorization");

  if (!header?.startsWith("Basic ")) {
    return new NextResponse("Unauthorized - missing header", { status: 401 });
  }

  // 1. Extract credentials from Basic Auth (Frontend -> Next.js)
  const base64 = header.split(" ")[1];
  const [username, password] = Buffer.from(base64, "base64")
    .toString()
    .split(":");

  try {
    // 2. Call Spring Boot to Authenticate (Next.js -> Java)
    const loginRes = await fetch(`${JAVA_API_BASE}/auth/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const loginResult = await loginRes.json();

    if (!loginRes.ok) {
      return new NextResponse(loginResult.message || "Unauthorized", {
        status: 401,
      });
    }

    const accessToken = loginResult.data.accessToken;

    // 3. Call Spring Boot to get Profile Details (using the new JWT)
    const profileRes = await fetch(`${JAVA_API_BASE}/users/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    const profileResult = await profileRes.json();
    const user = profileResult.data;

    if (!profileRes.ok) {
      return new NextResponse("Failed to fetch user profile", { status: 500 });
    }

    // 4. Role check (match the Spring Boot Enum strings)
    if (user.role === "ROLE_TEACHER" && req.url.includes("/admin")) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    // 5. Save cookie with session data (Including the JWT!)
    await setSession({
      userId: user.id,
      username: user.username,
      role: user.role, // Matches Java ROLE_ADMINISTRATOR, etc.
      accessToken: accessToken,
    });

    return NextResponse.json(
      {
        message: "✅ Auth successful",
        role: user.role,
        username: user.username,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Auth Route Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
