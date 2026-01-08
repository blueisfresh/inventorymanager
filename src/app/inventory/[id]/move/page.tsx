import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  getInventoryItem,
  assignItemToLab,
  returnItemToTransfer,
  confirmReturnToMain,
} from "@/lib/actions/inventory";
import { getStorageLocations } from "@/lib/actions/storage";
import { notFound } from "next/navigation";
import { StorageLocation } from "@/lib/types";

interface PageProps {
  params: Promise<{ id: string }>; // Updated for Next.js 15
}

export default async function MoveInventoryPage({ params }: PageProps) {
  const { id: pathId } = await params;
  const id = parseInt(pathId);

  const [item, locations] = await Promise.all([
    getInventoryItem(id),
    getStorageLocations(),
  ]);

  if (!item) notFound();

  // Action for Assign to Lab (Still needs a target location ID)
  async function assignAction(formData: FormData) {
    "use server";
    const toId = Number(formData.get("toId"));
    if (!toId) throw new Error("Target location required");
    await assignItemToLab(id, toId);
    return {
      redirect: `/inventory?toast=Assigned%20to%20lab&type=success`,
    } as any;
  }

  // Updated: Stored Procedure handles finding the transfer location automatically
  async function toTransferAction() {
    "use server";
    await returnItemToTransfer(id);
    return {
      redirect: `/inventory?toast=Sent%20to%20transfer&type=success`,
    } as any;
  }

  // Updated: Stored Procedure handles finding the main storage automatically
  async function toMainAction() {
    "use server";
    await confirmReturnToMain(id);
    return {
      redirect: `/inventory?toast=Returned%20to%20main&type=success`,
    } as any;
  }

  // Filter locations using lowercase lab.id
  const labLocations = locations.filter(
    (l: StorageLocation) => l.lab?.id != null
  );

  return (
    <div className="max-w-xl mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-6">Move Item: {item.name}</h1>

      <div className="space-y-8">
        {/* SECTION 1: ASSIGN TO LAB */}
        <section className="p-4 border rounded-lg">
          <h2 className="font-semibold mb-2 text-blue-600">Assign to Lab</h2>
          <p className="text-sm text-gray-500 mb-4">
            Choose a specific storage shelf inside a Lab.
          </p>
          {labLocations.length === 0 ? (
            <p className="text-sm text-red-500">
              No lab storage locations found.
            </p>
          ) : (
            <form action={assignAction} className="flex gap-2 items-center">
              <select
                name="toId"
                required
                className="border rounded-md px-3 py-2 flex-1"
              >
                <option value="">Select Target Shelf...</option>
                {labLocations.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name}
                  </option>
                ))}
              </select>
              <Button type="submit">Assign</Button>
            </form>
          )}
        </section>

        {/* SECTION 2: RETURN TO TRANSFER */}
        <section className="p-4 border rounded-lg">
          <h2 className="font-semibold mb-2 text-orange-600">
            Return to Transfer Storage
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            The item will be moved to the Main Transfer Area.
          </p>
          <form action={toTransferAction}>
            <Button type="submit" variant="outline" className="w-full">
              Confirm Move to Transfer
            </Button>
          </form>
        </section>

        {/* SECTION 3: CONFIRM RETURN TO MAIN */}
        <section className="p-4 border rounded-lg">
          <h2 className="font-semibold mb-2 text-green-600">
            Confirm Return to Main Storage
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            The item will be moved to the Main Storage Room.
          </p>
          <form action={toMainAction}>
            <Button type="submit" variant="success" className="w-full">
              Confirm Final Return
            </Button>
          </form>
        </section>

        <div className="pt-4 text-center">
          <Link href="/inventory">
            <Button variant="secondary">Back to Inventory</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
