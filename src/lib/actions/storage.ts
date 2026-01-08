"use server";

import { apiRequest } from "../api-client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function getStorageLocations() {
  const res = await apiRequest("/storage");
  return res.data;
}

export async function createStorageLocation(formData: FormData) {
  const payload = {
    name: formData.get("Name"),
    description: formData.get("Description") || "",
    labId: formData.get("LabId") ? Number(formData.get("LabId")) : null,
  };

  await apiRequest("/storage", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  revalidatePath("/storage");
  redirect("/storage?toast=Location%20created&type=success");
}
