import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function authenticate(username: string, password: string) {
  // Get the User
  const user = await prisma.users.findFirst({
    where: { Username: username },
    include: { Roles: true }, // fetch role too
  });

  if (!user) return null;
  const valid = await bcrypt.compare(password, user.Password);
  if (!valid) return null;

  return {
    id: user.Id,
    username: user.Username,
    role: user.Roles.Name, // "Admin" / "Teacher"
  };
}
