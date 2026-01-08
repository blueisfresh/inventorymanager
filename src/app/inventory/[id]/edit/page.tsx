import InventoryForm from "@/components/forms/inventory-form";
import { getInventoryItem } from "@/lib/actions/inventory";
import { getStorageLocations } from "@/lib/actions/storage";
import type { InventoryItem, StorageLocation } from "@/lib/types";
import { notFound } from "next/navigation";

interface PageProps {
  params: { id: string };
}

export default async function EditInventoryPage({ params }: PageProps) {
  const id = parseInt(params.id);
  const [item, storageLocations]: [InventoryItem | null, StorageLocation[]] =
    await Promise.all([getInventoryItem(id), getStorageLocations()]);

  if (!item) {
    notFound();
  }

  return <InventoryForm item={item} storageLocations={storageLocations} />;
}
