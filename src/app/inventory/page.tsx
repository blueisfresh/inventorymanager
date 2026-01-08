import { Button } from "@/components/ui/button";
import { getInventoryItems } from "@/lib/actions/inventory";
import Link from "next/link";
import { assignItemToLab, returnItemToTransfer } from "@/lib/actions/inventory";
import { ItemStatus } from "@/lib/types";
import type { InventoryItem } from "@/lib/types";

export default async function InventoryPage() {
  const items: InventoryItem[] = await getInventoryItems();

  console.log("RAW ITEMS FROM API:", JSON.stringify(items[0], null, 2));

  const getStatusLabel = (status: string): string => {
    // Change number to string
    switch (status) {
      case ItemStatus.AVAILABLE: // Corrected to all-caps
        return "Available";
      case ItemStatus.BORROWED:
        return "Borrowed";
      case ItemStatus.IN_TRANSFER:
        return "In Transfer";
      default:
        return "Unknown";
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
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
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
                  <td className="px-6 py-4">{item.category || "-"}</td>
                  <td className="px-6 py-4">{getStatusLabel(item.status)}</td>
                  <td className="px-6 py-4">
                    {item.storageLocation?.name || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <Link
                      href={`/inventory/${item.id}/edit`}
                      className="inline-block"
                    >
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                    </Link>
                    <Link
                      href={`/inventory/${item.id}/delete`}
                      className="inline-block"
                    >
                      <Button size="sm" variant="destructive">
                        Delete
                      </Button>
                    </Link>
                    <Link
                      href={`/inventory/${item.id}/move`}
                      className="inline-block"
                    >
                      <Button size="sm">Move</Button>
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
