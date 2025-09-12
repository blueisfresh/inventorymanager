import { Button } from '@/components/ui/button';
import { createInventoryItem, updateInventoryItem } from '@/lib/actions/inventory';
import type { InventoryItem, StorageLocation } from '@/lib/types';
import Link from 'next/link';

interface InventoryFormProps {
    item?: InventoryItem;
    storageLocations: StorageLocation[];
}

export default function InventoryForm({ item, storageLocations }: InventoryFormProps) {
    const isEdit = !!item;
    const action = isEdit
        ? updateInventoryItem.bind(null, item.Id)
        : createInventoryItem;

    return (
        <div className="max-w-md mx-auto mt-8">
            <h1 className="text-2xl font-bold mb-6">
                {isEdit ? 'Edit' : 'Create'} Inventory Item
            </h1>

            <form action={action} className="space-y-4">
                <div>
                    <label htmlFor="Name" className="block text-sm font-medium mb-1">
                        Name *
                    </label>
                    <input
                        type="text"
                        id="Name"
                        name="Name"
                        defaultValue={item?.Name || ''}
                        className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="Category" className="block text-sm font-medium mb-1">
                        Category
                    </label>
                    <input
                        type="text"
                        id="Category"
                        name="Category"
                        defaultValue={item?.Category || ''}
                        className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label htmlFor="SerialNumber" className="block text-sm font-medium mb-1">
                        Serial Number
                    </label>
                    <input
                        type="text"
                        id="SerialNumber"
                        name="SerialNumber"
                        defaultValue={item?.SerialNumber || ''}
                        className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label htmlFor="Status" className="block text-sm font-medium mb-1">
                        Status
                    </label>
                    <select
                        id="Status"
                        name="Status"
                        defaultValue={item?.Status?.toString() || '0'}
                        className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="0">Available</option>
                        <option value="1">Borrowed</option>
                        <option value="2">In Transfer</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="StorageLocationId" className="block text-sm font-medium mb-1">
                        Storage Location *
                    </label>
                    <select
                        id="StorageLocationId"
                        name="StorageLocationId"
                        defaultValue={item?.StorageLocationId?.toString() || ''}
                        className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    >
                        <option value="">Select...</option>
                        {storageLocations.map((location: StorageLocation) => (
                            <option key={location.Id} value={location.Id}>
                                {location.Name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex gap-2 pt-4">
                    <Button type="submit" variant="success">
                        Save
                    </Button>
                    <Link href="/inventory" className="inline-block">
                        <Button type="button" variant="secondary">
                            Cancel
                        </Button>
                    </Link>
                </div>
            </form>
        </div>
    );
}