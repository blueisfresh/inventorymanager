import { Button } from "@/components/ui/button";
import {
  deleteStorageLocation,
  getStorageLocation,
} from "@/lib/actions/storage";
import { notFound } from "next/navigation";
import Link from "next/link";

interface PageProps {
  params: { id: string };
}

export default async function DeleteStoragePage({ params }: PageProps) {
  const id = parseInt(params.id);
  const loc = await getStorageLocation(id);
  if (!loc) notFound();

  return (
    <div className="max-w-md mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-6">Delete Storage Location</h1>
      <p className="mb-6">
        Are you sure you want to delete <strong>{loc.name}</strong>?
      </p>
      <form
        action={deleteStorageLocation.bind(null, id)}
        className="flex gap-2"
      >
        <Button type="submit" variant="destructive">
          Delete
        </Button>
        <Link href="/storage">
          <Button type="button" variant="secondary">
            Cancel
          </Button>
        </Link>
      </form>
    </div>
  );
}
