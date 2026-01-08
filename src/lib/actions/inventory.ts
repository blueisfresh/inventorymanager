"use server";

import { apiRequest } from "../api-client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { InventoryItem } from "@/lib/types";

export async function getInventoryItems(): Promise<InventoryItem[]> {
  const res = await apiRequest("/inventory");
  return res.data;
}

export async function getInventoryItem(
  id: number
): Promise<InventoryItem | null> {
  const res = await apiRequest(`/inventory/${id}`);
  return res.data;
}

export async function createInventoryItem(formData: FormData) {
  const payload = {
    name: formData.get("Name"),
    category: formData.get("Category") || "",
    serialNumber: formData.get("SerialNumber") || null,
    status: "AVAILABLE", // Matches Java Enum String
    storageLocationId: Number(formData.get("StorageLocationId")),
  };

  await apiRequest("/inventory", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  revalidatePath("/inventory");
  redirect("/inventory?toast=Item%20created&type=success");
}

export async function deleteInventoryItem(id: number) {
  await apiRequest(`/inventory/${id}`, { method: "DELETE" });
  revalidatePath("/inventory");
  redirect("/inventory?toast=Item%20deleted&type=success");
}

// MOVEMENT LOGIC: Calling your Stored Procedures
export async function assignItemToLab(itemId: number, targetLabId: number) {
  await apiRequest(`/inventory/${itemId}/assign-to-lab`, {
    method: "POST",
    body: JSON.stringify({ targetLabId }),
  });
  revalidatePath("/inventory");
}

export async function returnItemToTransfer(itemId: number) {
  // Argument changed: SP handles the location finding
  await apiRequest(`/inventory/${itemId}/return-to-transfer`, {
    method: "POST",
  });
  revalidatePath("/inventory");
}

export async function confirmReturnToMain(itemId: number) {
  // Argument changed: SP handles the location finding
  await apiRequest(`/inventory/${itemId}/confirm-return`, { method: "POST" });
  revalidatePath("/inventory");
}
