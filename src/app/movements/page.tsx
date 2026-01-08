// src/app/movements/page.tsx
import { getMovements } from "@/lib/actions/movements";
import { MovementType } from "@/lib/types";

export default async function MovementsPage() {
  // 1. Call your Java API through the server action
  const movements = await getMovements();

  // 2. Updated helper to handle String Enums from Java
  const getTypeLabel = (type: MovementType) => {
    switch (type) {
      case MovementType.ASSIGN_TO_LAB:
        return "Assign to Lab";
      case MovementType.RETURN_TO_TRANSFER:
        return "Return to Transfer";
      case MovementType.CONFIRM_RETURN:
        return "Return to Main";
      default:
        return type;
    }
  };

  return (
    <div className="py-6">
      <h1 className="text-3xl font-bold mb-6">Movements</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 text-left text-xs font-bold uppercase">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase">
                Item
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase">
                From
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase">
                To
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase">
                By
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {movements.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                  No movements recorded yet.
                </td>
              </tr>
            ) : (
              movements.map((m) => (
                <tr key={m.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(m.date).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getTypeLabel(m.type)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {m.inventoryItem?.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {m.fromStorageLocation?.name ?? "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {m.toStorageLocation?.name ?? "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {m.performedByUser?.username}
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
