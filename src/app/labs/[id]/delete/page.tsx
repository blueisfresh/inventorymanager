import { Button } from "@/components/ui/button";
import { deleteLab, getLab } from "@/lib/actions/labs";
import { notFound } from "next/navigation";
import Link from "next/link";

interface PageProps {
  params: { id: string };
}

export default async function DeleteLabPage({ params }: PageProps) {
  const id = parseInt(params.id);
  const lab = await getLab(id);
  if (!lab) notFound();

  return (
    <div className="max-w-md mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-6">Delete Lab</h1>
      <p className="mb-6">
        Are you sure you want to delete <strong>{lab.Name}</strong>?
      </p>
      <form action={deleteLab.bind(null, id)} className="flex gap-2">
        <Button type="submit" variant="destructive">
          Delete
        </Button>
        <Link href="/labs">
          <Button type="button" variant="secondary">
            Cancel
          </Button>
        </Link>
      </form>
    </div>
  );
}
