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
import { ItemStatus } from "@/lib/types";

interface PageProps {
  params: { id: string };
}

export default async function MoveInventoryPage({ params }: PageProps) {
  const id = parseInt(params.id);
  const [item, locations] = await Promise.all([
    getInventoryItem(id),
    getStorageLocations(),
  ]);

  if (!item) notFound();

  async function assignAction(formData: FormData) {
    "use server";
    const toId = Number(formData.get("toId"));
    if (!toId) throw new Error("Target location required");
    await assignItemToLab(id, toId);
    return {
      redirect: `/inventory?toast=Assigned%20to%20lab&type=success`,
    } as any;
  }

  async function toTransferAction(formData: FormData) {
    "use server";
    const transferId = Number(formData.get("transferId"));
    if (!transferId) throw new Error("Transfer location required");
    await returnItemToTransfer(id, transferId);
    return {
      redirect: `/inventory?toast=Sent%20to%20transfer&type=success`,
    } as any;
  }

  async function toMainAction(formData: FormData) {
    "use server";
    const mainId = Number(formData.get("mainId"));
    if (!mainId) throw new Error("Main location required");
    await confirmReturnToMain(id, mainId);
    return {
      redirect: `/inventory?toast=Returned%20to%20main&type=success`,
    } as any;
  }

  const labLocations = locations.filter((l) => l.LabId != null);
  const nonLabLocations = locations.filter((l) => l.LabId == null);

  return (
    <div className="max-w-xl mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-6">Move Item: {item.Name}</h1>

      <div className="space-y-8">
        <section>
          <h2 className="font-semibold mb-2">Assign to Lab</h2>
          {labLocations.length === 0 ? (
            <p className="text-sm text-gray-600">
              No lab storage locations available. Create a lab storage first.
            </p>
          ) : (
            <form action={assignAction} className="flex gap-2 items-center">
              <select
                name="toId"
                required
                className="border rounded-md px-3 py-2"
              >
                <option value="">Select...</option>
                {labLocations.map((l) => (
                  <option key={l.Id} value={l.Id}>
                    {l.Name}
                  </option>
                ))}
              </select>
              <Button type="submit">Assign</Button>
            </form>
          )}
        </section>

        <section>
          <h2 className="font-semibold mb-2">Return to Transfer Storage</h2>
          {nonLabLocations.length === 0 ? (
            <p className="text-sm text-gray-600">
              No non-lab storage locations available. Create a main/transfer
              storage first.
            </p>
          ) : (
            <form action={toTransferAction} className="flex gap-2 items-center">
              <select
                name="transferId"
                required
                className="border rounded-md px-3 py-2"
              >
                <option value="">Select...</option>
                {nonLabLocations.map((l) => (
                  <option key={l.Id} value={l.Id}>
                    {l.Name}
                  </option>
                ))}
              </select>
              <Button type="submit" variant="outline">
                Send to Transfer
              </Button>
            </form>
          )}
        </section>

        <section>
          <h2 className="font-semibold mb-2">Confirm Return to Main Storage</h2>
          {nonLabLocations.length === 0 ? (
            <p className="text-sm text-gray-600">
              No main storage available. Create a non-lab storage first.
            </p>
          ) : (
            <form action={toMainAction} className="flex gap-2 items-center">
              <select
                name="mainId"
                required
                className="border rounded-md px-3 py-2"
              >
                <option value="">Select...</option>
                {nonLabLocations.map((l) => (
                  <option key={l.Id} value={l.Id}>
                    {l.Name}
                  </option>
                ))}
              </select>
              <Button type="submit" variant="success">
                Move to Main
              </Button>
            </form>
          )}
        </section>

        <div className="pt-4">
          <Link href="/inventory" className="inline-block">
            <Button variant="secondary">Back</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
