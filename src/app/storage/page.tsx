import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getStorageLocations } from "@/lib/actions/storage";
import type { StorageLocation } from "@/lib/types";

export default async function StoragePage() {
  const locations: StorageLocation[] = await getStorageLocations();

  return (
    <div className="py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Storage Locations</h1>
        <Link href="/storage/create">
          <Button>➕ Add Location</Button>
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
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Lab
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Items
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {locations.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  No locations found
                </td>
              </tr>
            ) : (
              locations.map((loc) => (
                <tr key={loc.Id}>
                  <td className="px-6 py-4 whitespace-nowrap">{loc.Name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {loc.Description || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {loc.Labs?.Name ?? "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {loc.InventoryItems?.length ?? 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <Link
                      href={`/storage/${loc.Id}/edit`}
                      className="inline-block"
                    >
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                    </Link>
                    <Link
                      href={`/storage/${loc.Id}/delete`}
                      className="inline-block"
                    >
                      <Button size="sm" variant="destructive">
                        Delete
                      </Button>
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
