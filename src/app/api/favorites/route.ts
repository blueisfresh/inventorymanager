import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET(req: Request) {
  const header = req.headers.get("authorization");
  if (!header?.startsWith("Basic ")) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const base64 = header.split(" ")[1];
  const [username, password] = Buffer.from(base64, "base64")
    .toString()
    .split(":");

  const user = await prisma.users.findFirst({ where: { Username: username } });
  if (!user) return new NextResponse("User not found", { status: 401 });

  const valid = await bcrypt.compare(password, user.Password);
  if (!valid) return new NextResponse("Invalid password", { status: 401 });

  // If OK → return protected data
  const favorites = await prisma.favorites.findMany({
    where: { userId: user.Id },
  });

  return NextResponse.json({ favorites });
}
