import { Button } from '@/components/ui/button';
import { deleteInventoryItem, getInventoryItem } from '@/lib/actions/inventory';
import { notFound } from 'next/navigation';
import Link from 'next/link';

interface PageProps {
    params: { id: string };
}

export default async function DeleteInventoryPage({ params }: PageProps) {
    const id = parseInt(params.id);
    const item = await getInventoryItem(id);

    if (!item) {
        notFound();
    }

    return (
        <div className="max-w-md mx-auto mt-8">
            <h1 className="text-2xl font-bold mb-6">Delete Inventory Item</h1>

            <p className="mb-6">
                Are you sure you want to delete <strong>{item.Name}</strong>?
            </p>

            <form action={deleteInventoryItem.bind(null, id)} className="flex gap-2">
                <Button type="submit" variant="destructive">
                    Delete
                </Button>
                <Link href="/inventory">
                    <Button type="button" variant="secondary">Cancel</Button>
                </Link>
            </form>
        </div>
    );
}