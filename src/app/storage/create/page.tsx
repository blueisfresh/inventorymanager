import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createStorageLocation } from "@/lib/actions/storage";
import { getLabs } from "@/lib/actions/labs";

export default async function CreateStoragePage() {
  const labs = await getLabs();

  return (
    <div className="max-w-md mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-6">Create Storage Location</h1>
      <form action={createStorageLocation} className="space-y-4">
        <div>
          <label htmlFor="Name" className="block text-sm font-medium mb-1">
            Name *
          </label>
          <input
            id="Name"
            name="Name"
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
            className="w-full border rounded-md px-3 py-2"
          >
            <option value="">Select...</option>
            {labs.map((l) => (
              <option key={l.Id} value={l.Id}>
                {l.Name}
              </option>
            ))}
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
