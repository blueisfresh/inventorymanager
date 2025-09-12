// Import Prisma generated types
import type {
    InventoryItems,
    Labs,
    Movements,
    Users,
    StorageLocations,
    Roles
} from '../generated/prisma';

// Re-export Prisma types with better names
export type InventoryItem = InventoryItems & {
    StorageLocations?: StorageLocations;
    Labs?: Labs | null;
};

export type Lab = Labs & {
    Users?: Users | null;
    InventoryItems?: InventoryItems[];
    StorageLocations?: StorageLocations[];
};

export type Movement = Movements & {
    InventoryItems?: InventoryItems;
    StorageLocations_Movements_FromStorageLocationIdToStorageLocations?: StorageLocations | null;
    StorageLocations_Movements_ToStorageLocationIdToStorageLocations?: StorageLocations | null;
    Users?: Users;
};

export type User = Users & {
    Roles?: Roles;
    Labs?: Labs[];
    Movements?: Movements[];
};

export type StorageLocation = StorageLocations & {
    Labs?: Labs | null;
    InventoryItems?: InventoryItems[];
};

export type Role = Roles & {
    Users?: Users[];
};

// Keep the enums as they match your database
export enum ItemStatus {
    Available = 0,
    Borrowed = 1,
    InTransfer = 2
}

export enum MovementType {
    AssignToLab = 0,
    ReturnToTransferStorage = 1,
    ReturnToMainStorage = 2
}