import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createLab, getTeachers } from "@/lib/actions/labs";

export default async function CreateLabPage() {
  const teachers = await getTeachers();

  return (
    <div className="max-w-md mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-6">Create Lab</h1>
      <form action={createLab} className="space-y-4">
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
          <label htmlFor="TeacherId" className="block text-sm font-medium mb-1">
            Teacher
          </label>
          <select
            id="TeacherId"
            name="TeacherId"
            className="w-full border rounded-md px-3 py-2"
          >
            <option value="">Select...</option>
            {teachers.map((t) => (
              <option key={t.id} value={t.id}>
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
