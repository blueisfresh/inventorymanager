"use server";

import { prisma } from "@/lib/prisma";
import { labSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function getLabs() {
  return await prisma.labs.findMany({
    include: {
      Users: true,
    },
  });
}

export async function getTeachers() {
  return await prisma.users.findMany({
    include: {
      Roles: true,
    },
    // Assuming role ID 2 is for teachers, adjust based on your data
    where: {
      RoleId: 2,
    },
  });
}

export async function getLab(id: number) {
  return await prisma.labs.findUnique({
    where: { Id: id },
    include: { Users: true },
  });
}

export async function createLab(formData: FormData) {
  const validated = labSchema.safeParse({
    Name: formData.get("Name"),
    TeacherId: formData.get("TeacherId")
      ? Number(formData.get("TeacherId"))
      : null,
  });

  if (!validated.success) {
    throw new Error("Validation failed");
  }

  await prisma.labs.create({
    data: validated.data,
  });

  revalidatePath("/labs");
  redirect("/labs");
}

export async function updateLab(id: number, formData: FormData) {
  const validated = labSchema.safeParse({
    Name: formData.get("Name"),
    TeacherId: formData.get("TeacherId")
      ? Number(formData.get("TeacherId"))
      : null,
  });

  if (!validated.success) {
    throw new Error("Validation failed");
  }

  await prisma.labs.update({
    where: { Id: id },
    data: validated.data,
  });

  revalidatePath("/labs");
  redirect("/labs");
}

export async function deleteLab(id: number) {
  await prisma.labs.delete({ where: { Id: id } });
  revalidatePath("/labs");
  redirect("/labs");
}
