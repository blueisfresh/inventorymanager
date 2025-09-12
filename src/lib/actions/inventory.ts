"use server";

import { prisma } from "@/lib/prisma";
import { inventoryItemSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { InventoryItem } from "@/lib/types";
import { MovementType, ItemStatus } from "@/lib/types";

export async function getInventoryItems(): Promise<InventoryItem[]> {
  return (await prisma.inventoryItems.findMany({
    include: {
      StorageLocations: true,
    },
  })) as InventoryItem[];
}

export async function getInventoryItem(
  id: number
): Promise<InventoryItem | null> {
  return (await prisma.inventoryItems.findUnique({
    where: { Id: id },
    include: {
      StorageLocations: true,
    },
  })) as InventoryItem | null;
}

export async function createInventoryItem(formData: FormData) {
  const validatedFields = inventoryItemSchema.safeParse({
    Name: formData.get("Name"),
    Category: formData.get("Category") || "",
    SerialNumber: formData.get("SerialNumber") || null,
    Status: Number(formData.get("Status")),
    StorageLocationId: Number(formData.get("StorageLocationId")),
  });

  if (!validatedFields.success) {
    throw new Error("Validation failed");
  }

  await prisma.inventoryItems.create({
    data: validatedFields.data,
  });

  revalidatePath("/inventory");
  redirect("/inventory?toast=Item%20created&type=success");
}

export async function updateInventoryItem(id: number, formData: FormData) {
  const validatedFields = inventoryItemSchema.safeParse({
    Name: formData.get("Name"),
    Category: formData.get("Category") || "",
    SerialNumber: formData.get("SerialNumber") || null,
    Status: Number(formData.get("Status")),
    StorageLocationId: Number(formData.get("StorageLocationId")),
  });

  if (!validatedFields.success) {
    throw new Error("Validation failed");
  }

  await prisma.inventoryItems.update({
    where: { Id: id },
    data: validatedFields.data,
  });

  revalidatePath("/inventory");
  redirect("/inventory?toast=Item%20updated&type=success");
}

export async function deleteInventoryItem(id: number) {
  await prisma.inventoryItems.delete({
    where: { Id: id },
  });

  revalidatePath("/inventory");
  redirect("/inventory?toast=Item%20deleted&type=success");
}

// Movement helpers
export async function assignItemToLab(
  itemId: number,
  toStorageLocationId: number,
  performedByUserId = 1
) {
  // Move from its current location to lab storage
  const item = await prisma.inventoryItems.findUnique({
    where: { Id: itemId },
  });
  if (!item) throw new Error("Item not found");

  await prisma.$transaction([
    prisma.movements.create({
      data: {
        Date: new Date(),
        Type: MovementType.AssignToLab,
        InventoryItemId: itemId,
        FromStorageLocationId: item.StorageLocationId,
        ToStorageLocationId: toStorageLocationId,
        PerformedByUserId: performedByUserId,
        PerformedById: performedByUserId,
      },
    }),
    prisma.inventoryItems.update({
      where: { Id: itemId },
      data: {
        StorageLocationId: toStorageLocationId,
        Status: ItemStatus.Borrowed,
      },
    }),
  ]);

  revalidatePath("/inventory");
}

export async function returnItemToTransfer(
  itemId: number,
  transferLocationId: number,
  performedByUserId = 1
) {
  const item = await prisma.inventoryItems.findUnique({
    where: { Id: itemId },
  });
  if (!item) throw new Error("Item not found");

  await prisma.$transaction([
    prisma.movements.create({
      data: {
        Date: new Date(),
        Type: MovementType.ReturnToTransferStorage,
        InventoryItemId: itemId,
        FromStorageLocationId: item.StorageLocationId,
        ToStorageLocationId: transferLocationId,
        PerformedByUserId: performedByUserId,
        PerformedById: performedByUserId,
      },
    }),
    prisma.inventoryItems.update({
      where: { Id: itemId },
      data: {
        StorageLocationId: transferLocationId,
        Status: ItemStatus.InTransfer,
      },
    }),
  ]);

  revalidatePath("/inventory");
}

export async function confirmReturnToMain(
  itemId: number,
  mainLocationId: number,
  performedByUserId = 1
) {
  const item = await prisma.inventoryItems.findUnique({
    where: { Id: itemId },
  });
  if (!item) throw new Error("Item not found");

  await prisma.$transaction([
    prisma.movements.create({
      data: {
        Date: new Date(),
        Type: MovementType.ReturnToMainStorage,
        InventoryItemId: itemId,
        FromStorageLocationId: item.StorageLocationId,
        ToStorageLocationId: mainLocationId,
        PerformedByUserId: performedByUserId,
        PerformedById: performedByUserId,
      },
    }),
    prisma.inventoryItems.update({
      where: { Id: itemId },
      data: { StorageLocationId: mainLocationId, Status: ItemStatus.Available },
    }),
  ]);

  revalidatePath("/inventory");
}
