'use server';

import { prisma } from '@/lib/prisma';
import { storageLocationSchema } from '@/lib/validations';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import type { StorageLocation } from '@/lib/types';

export async function getStorageLocations(): Promise<StorageLocation[]> {
    return await prisma.storageLocations.findMany({
        include: {
            Labs: true,
            InventoryItems: true,
        },
    }) as StorageLocation[];
}

export async function getStorageLocation(id: number): Promise<StorageLocation | null> {
    return await prisma.storageLocations.findUnique({
        where: { Id: id },
        include: {
            Labs: true,
            InventoryItems: true,
        },
    }) as StorageLocation | null;
}

export async function createStorageLocation(formData: FormData) {
    const validatedFields = storageLocationSchema.safeParse({
        Name: formData.get('Name'),
        Description: formData.get('Description') || '',
        LabId: formData.get('LabId') ? Number(formData.get('LabId')) : null,
    });

    if (!validatedFields.success) {
        throw new Error('Validation failed');
    }

    await prisma.storageLocations.create({
        data: validatedFields.data,
    });

    revalidatePath('/storage');
    redirect('/storage');
}

export async function updateStorageLocation(id: number, formData: FormData) {
    const validatedFields = storageLocationSchema.safeParse({
        Name: formData.get('Name'),
        Description: formData.get('Description') || '',
        LabId: formData.get('LabId') ? Number(formData.get('LabId')) : null,
    });

    if (!validatedFields.success) {
        throw new Error('Validation failed');
    }

    await prisma.storageLocations.update({
        where: { Id: id },
        data: validatedFields.data,
    });

    revalidatePath('/storage');
    redirect('/storage');
}

export async function deleteStorageLocation(id: number) {
    await prisma.storageLocations.delete({
        where: { Id: id },
    });

    revalidatePath('/storage');
    redirect('/storage');
}