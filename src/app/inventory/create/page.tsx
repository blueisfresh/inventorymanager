import InventoryForm from '@/components/forms/inventory-form';
import { getStorageLocations } from '@/lib/actions/storage';
import type { StorageLocation } from '@/lib/types';

export default async function CreateInventoryPage() {
    const storageLocations: StorageLocation[] = await getStorageLocations();

    return <InventoryForm storageLocations={storageLocations} />;
}