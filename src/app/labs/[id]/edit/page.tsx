import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getLab, getTeachers, updateLab } from "@/lib/actions/labs";
import { notFound } from "next/navigation";

interface PageProps {
  params: { id: string };
}

export default async function EditLabPage({ params }: PageProps) {
  const id = parseInt(params.id);
  const [lab, teachers] = await Promise.all([getLab(id), getTeachers()]);

  if (!lab) notFound();

  return (
    <div className="max-w-md mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-6">Edit Lab</h1>
      <form action={updateLab.bind(null, id)} className="space-y-4">
        <div>
          <label htmlFor="Name" className="block text-sm font-medium mb-1">
            Name *
          </label>
          <input
            id="Name"
            name="Name"
            defaultValue={lab.Name}
            required
            className="w-full border rounded-md px-3 py-2"
          />
        </div>
        <div>
          <label htmlFor="TeacherId" className="block text-sm font-medium mb-1">
            Teacher
          </label>
          <select
            id="TeacherId"
            name="TeacherId"
            defaultValue={lab.TeacherId ?? ""}
            className="w-full border rounded-md px-3 py-2"
          >
            <option value="">Select...</option>
            {teachers.map((t) => (
              <option key={t.Id} value={t.Id}>
                {t.Username}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-2 pt-4">
          <Button type="submit" variant="success">
            Save
          </Button>
          <Link href="/labs" className="inline-block">
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
