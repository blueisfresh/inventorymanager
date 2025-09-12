import { prisma } from "@/lib/prisma";
import { MovementType } from "@/lib/types";

export default async function MovementsPage() {
  const movements = await prisma.movements.findMany({
    orderBy: { Date: "desc" },
    include: {
      InventoryItems: true,
      StorageLocations_Movements_FromStorageLocationIdToStorageLocations: true,
      StorageLocations_Movements_ToStorageLocationIdToStorageLocations: true,
      Users: true,
    },
  });

  const getType = (t: number) => {
    switch (t) {
      case MovementType.AssignToLab:
        return "Assign to Lab";
      case MovementType.ReturnToTransferStorage:
        return "Return to Transfer";
      case MovementType.ReturnToMainStorage:
        return "Return to Main";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="py-6">
      <h1 className="text-3xl font-bold mb-6">Movements</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Item
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                From
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                To
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                By
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {movements.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                  No movements
                </td>
              </tr>
            ) : (
              movements.map((m) => (
                <tr key={m.Id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(m.Date).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getType(m.Type)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {m.InventoryItems?.Name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {m
                      .StorageLocations_Movements_FromStorageLocationIdToStorageLocations
                      ?.Name ?? "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {m
                      .StorageLocations_Movements_ToStorageLocationIdToStorageLocations
                      ?.Name ?? "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {m.Users?.Username}
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
