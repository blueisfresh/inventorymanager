import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { setSession } from "@/lib/session";

export async function GET(req: Request) {
  const header = req.headers.get("authorization");

  if (!header?.startsWith("Basic ")) {
    return new NextResponse("Unauthorized - missing header", { status: 401 });
  }

  const base64 = header.split(" ")[1];
  const [username, password] = Buffer.from(base64, "base64")
    .toString()
    .split(":");

  // include Roles
  const user = await prisma.users.findFirst({
    where: { Username: username },
    include: { Roles: true },
  });

  if (!user) {
    return new NextResponse("Unauthorized - user not found", { status: 401 });
  }

  const valid = await bcrypt.compare(password, user.Password);
  if (!valid) {
    return new NextResponse("Unauthorized - invalid password", { status: 401 });
  }

  // Role example check
  if (user.Roles?.Name === "Teacher" && req.url.includes("/admin")) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  // Save cookie with session data
  setSession({
    userId: user.Id,
    username: user.Username,
    role: user.Roles?.Name ?? "Unknown",
  });

  return NextResponse.json(
    {
      message: "✅ Auth successful",
      role: user.Roles?.Name,
      username: user.Username,
    },
    {
      status: 200,
    }
  );
}
