import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  getStorageLocation,
  updateStorageLocation,
} from "@/lib/actions/storage";
import { getLabs } from "@/lib/actions/labs";
import { notFound } from "next/navigation";

interface PageProps {
  params: { id: string };
}

export default async function EditStoragePage({ params }: PageProps) {
  const id = parseInt(params.id);
  const [location, labs] = await Promise.all([
    getStorageLocation(id),
    getLabs(),
  ]);

  if (!location) notFound();

  return (
    <div className="max-w-md mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-6">Edit Storage Location</h1>
      <form action={updateStorageLocation.bind(null, id)} className="space-y-4">
        <div>
          <label htmlFor="Name" className="block text-sm font-medium mb-1">
            Name *
          </label>
          <input
            id="Name"
            name="Name"
            defaultValue={location.name}
            required
            className="w-full border rounded-md px-3 py-2"
          />
        </div>
        <div>
          <label
            htmlFor="Description"
            className="block text-sm font-medium mb-1"
          >
            Description
          </label>
          <input
            id="Description"
            name="Description"
            defaultValue={location.description || ""}
            className="w-full border rounded-md px-3 py-2"
          />
        </div>
        <div>
          <label htmlFor="LabId" className="block text-sm font-medium mb-1">
            Lab
          </label>
          <select
            id="LabId"
            name="LabId"
            defaultValue={location.lab?.id ?? ""}
            className="w-full border rounded-md px-3 py-2"
          >
            <option value="">Select...</option>
            {labs.map(
              (
                l: any // Added :any or :Lab to fix implicit any
              ) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              )
            )}
          </select>
        </div>
        <div className="flex gap-2 pt-4">
          <Button type="submit" variant="success">
            Save
          </Button>
          <Link href="/storage" className="inline-block">
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
