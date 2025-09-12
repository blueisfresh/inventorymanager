import { z } from 'zod';

export const inventoryItemSchema = z.object({
    Name: z.string().min(1, 'Name is required').max(150),
    Category: z.string().max(50).optional().default(''),
    SerialNumber: z.string().max(100).optional().nullable(),
    Status: z.number().int().min(0).max(2).default(0),
    StorageLocationId: z.number().int().positive('Storage location is required'),
});

export const labSchema = z.object({
    Name: z.string().min(1, 'Name is required').max(100),
    TeacherId: z.number().int().positive().optional().nullable(),
});

export const movementSchema = z.object({
    Type: z.number().int().min(0).max(2),
    InventoryItemId: z.number().int().positive(),
    FromStorageLocationId: z.number().int().positive().optional().nullable(),
    ToStorageLocationId: z.number().int().positive().optional().nullable(),
    PerformedByUserId: z.number().int().positive(),
});

export const userSchema = z.object({
    Username: z.string().min(1, 'Username is required').max(100),
    Password: z.string().min(1, 'Password is required').max(100),
    RoleId: z.number().int().positive('Role is required'),
});

export const storageLocationSchema = z.object({
    Name: z.string().min(1, 'Name is required').max(100),
    Description: z.string().max(200).optional().default(''),
    LabId: z.number().int().positive().optional().nullable(),
});