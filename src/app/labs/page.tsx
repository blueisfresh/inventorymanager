import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getLabs, getTeachers } from "@/lib/actions/labs";
import type { Lab } from "@/lib/types";

export default async function LabsPage() {
  const labs: Lab[] = await getLabs();

  return (
    <div className="py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Labs</h1>
        <Link href="/labs/create">
          <Button>➕ Add Lab</Button>
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Teacher
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {labs.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                  No labs found
                </td>
              </tr>
            ) : (
              labs.map((lab) => (
                <tr key={lab.Id}>
                  <td className="px-6 py-4 whitespace-nowrap">{lab.Name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {lab.Users?.Username ?? "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <Link
                      href={`/labs/${lab.Id}/edit`}
                      className="inline-block"
                    >
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                    </Link>
                    <Link
                      href={`/labs/${lab.Id}/delete`}
                      className="inline-block"
                    >
                      <Button size="sm" variant="destructive">
                        Delete
                      </Button>
                    </Link>
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
