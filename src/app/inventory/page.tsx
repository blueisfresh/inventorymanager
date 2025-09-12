import { Button } from '@/components/ui/button';
import { getInventoryItems } from '@/lib/actions/inventory';
import { ItemStatus } from '@/lib/types';
import type { InventoryItem } from '@/lib/types';
import Link from 'next/link';

export default async function InventoryPage() {
    const items: InventoryItem[] = await getInventoryItems();

    const getStatusLabel = (status: number): string => {
        switch (status) {
            case ItemStatus.Available: return 'Available';
            case ItemStatus.Borrowed: return 'Borrowed';
            case ItemStatus.InTransfer: return 'In Transfer';
            default: return 'Unknown';
        }
    };

    return (
        <div className="container mx-auto py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Inventory Items</h1>
                <Link href="/inventory/create">
                    <Button>➕ Add Item</Button>
                </Link>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300">
                    <thead>
                    <tr className="bg-gray-100">
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {items.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                                No items found
                            </td>
                        </tr>
                    ) : (
                        items.map((item: InventoryItem) => (
                            <tr key={item.Id}>
                                <td className="px-6 py-4 whitespace-nowrap">{item.Name}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{item.Category || '-'}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {getStatusLabel(item.Status)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {item.StorageLocations?.Name || '-'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                    <Link href={`/inventory/${item.Id}/edit`} className="inline-block">
                                        <Button size="sm" variant="outline">Edit</Button>
                                    </Link>
                                    <Link href={`/inventory/${item.Id}/delete`} className="inline-block">
                                        <Button size="sm" variant="destructive">Delete</Button>
                                    </Link>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}