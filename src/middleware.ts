import { get } from "http";
import { NextResponse, NextRequest } from "next/server";
import { getSession } from "./lib/session";

export async function middleware(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    const header = req.headers.get("authorization");

    if (!header?.startsWith("Basic ")) {
      return new NextResponse("Authentication required", {
        status: 401,
        headers: { "WWW-Authenticate": 'Basic realm="Secure Area"' },
      });
    }

    return NextResponse.next();
  }

  // ✅ Session exists → enforce role restrictions here
  if (session.role === "Teacher" && req.nextUrl.pathname.startsWith("/admin")) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  // Inject user headers downstream
  const res = NextResponse.next();
  res.headers.set("x-user-role", session.role);
  res.headers.set("x-user-id", session.userId.toString());
  res.headers.set("x-user-username", session.username);
  return res;
}

export const config = {
  matcher: ["/:path*"],
};
