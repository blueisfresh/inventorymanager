"use server";

import { apiRequest } from "../api-client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function getLabs() {
  const res = await apiRequest("/labs");
  return res.data;
}

export async function getTeachers() {
  // Points to your UserController endpoint
  const res = await apiRequest("/api/users/teachers");
  return res.data;
}

export async function createLab(formData: FormData) {
  const payload = {
    name: formData.get("Name"),
    teacherId: formData.get("TeacherId")
      ? Number(formData.get("TeacherId"))
      : null,
  };

  await apiRequest("/labs", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  revalidatePath("/labs");
  redirect("/labs?toast=Lab%20created&type=success");
}

// ... updateLab and deleteLab follow the same pattern with method: 'PUT' or 'DELETE'
