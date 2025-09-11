import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma"; // Custom MSSQL prisma client

export async function GET(req: Request) {
  const header = req.headers.get("authorization");

  if (!header?.startsWith("Basic ")) {
    return new NextResponse("Unauthorized - missing header", { status: 401 });
  }

  const base64 = header.split(" ")[1];
  const [username, password] = Buffer.from(base64, "base64")
    .toString()
    .split(":");

  const user = await prisma.users.findFirst({
    where: { Username: username },
  });

  if (!user) {
    return new NextResponse("Unauthorized - user not found", { status: 401 });
  }

  const valid = await bcrypt.compare(password, user.Password);
  if (!valid) {
    return new NextResponse("Unauthorized - invalid password", { status: 401 });
  }

  // Role guard logic
  if (user.Roles.Name === "Teacher" && req.url.includes("/admin")) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  console.log(
    `User ${username} authenticated successfully with role ${user.Roles.Name}`
  );
  return new NextResponse(JSON.stringify({ message: "✅ Auth successful" }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "x-user-role": user.Roles.Name,
      "x-user-id": user.Id.toString(),
    },
  });
}
