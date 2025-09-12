'use server';

import { prisma } from '@/lib/prisma';
import { inventoryItemSchema } from '@/lib/validations';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import type { InventoryItem } from '@/lib/types';

export async function getInventoryItems(): Promise<InventoryItem[]> {
    return await prisma.inventoryItems.findMany({
        include: {
            StorageLocations: true,
        },
    }) as InventoryItem[];
}

export async function getInventoryItem(id: number): Promise<InventoryItem | null> {
    return await prisma.inventoryItems.findUnique({
        where: { Id: id },
        include: {
            StorageLocations: true,
        },
    }) as InventoryItem | null;
}

export async function createInventoryItem(formData: FormData) {
    const validatedFields = inventoryItemSchema.safeParse({
        Name: formData.get('Name'),
        Category: formData.get('Category') || '',
        SerialNumber: formData.get('SerialNumber') || null,
        Status: Number(formData.get('Status')),
        StorageLocationId: Number(formData.get('StorageLocationId')),
    });

    if (!validatedFields.success) {
        throw new Error('Validation failed');
    }

    await prisma.inventoryItems.create({
        data: validatedFields.data,
    });

    revalidatePath('/inventory');
    redirect('/inventory');
}

export async function updateInventoryItem(id: number, formData: FormData) {
    const validatedFields = inventoryItemSchema.safeParse({
        Name: formData.get('Name'),
        Category: formData.get('Category') || '',
        SerialNumber: formData.get('SerialNumber') || null,
        Status: Number(formData.get('Status')),
        StorageLocationId: Number(formData.get('StorageLocationId')),
    });

    if (!validatedFields.success) {
        throw new Error('Validation failed');
    }

    await prisma.inventoryItems.update({
        where: { Id: id },
        data: validatedFields.data,
    });

    revalidatePath('/inventory');
    redirect('/inventory');
}

export async function deleteInventoryItem(id: number) {
    await prisma.inventoryItems.delete({
        where: { Id: id },
    });

    revalidatePath('/inventory');
    redirect('/inventory');
}