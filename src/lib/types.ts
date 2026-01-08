// src/lib/types.ts

export enum ItemStatus {
  AVAILABLE = "AVAILABLE",
  BORROWED = "BORROWED",
  IN_TRANSFER = "IN_TRANSFER",
}

export enum MovementType {
  ASSIGN_TO_LAB = "ASSIGN_TO_LAB",
  RETURN_TO_TRANSFER = "RETURN_TO_TRANSFER",
  CONFIRM_RETURN = "CONFIRM_RETURN",
}

export interface UserSummary {
  id: number;
  username: string;
}

export interface LabSummary {
  id: number;
  name: string;
}

export interface StorageLocationSummary {
  id: number;
  name: string;
}

export interface InventoryItem {
  id: number;
  name: string;
  category: string;
  serialNumber?: string;
  status: ItemStatus;
  storageLocation: { id: number; name: string }; // SINGULAR!
  lab?: { id: number; name: string } | null; // SINGULAR!
}

export interface Lab {
  id: number;
  name: string;
  teacher?: { id: number; username: string } | null; // teacher statt Users
}

export interface StorageLocation {
  id: number;
  name: string;
  description?: string;
  lab?: { id: number; name: string } | null; // lab statt Labs
}

export interface Movement {
  id: number;
  date: string; // ISO Date String from Java
  type: MovementType;
  inventoryItem: {
    id: number;
    name: string;
    serialNumber: string;
  };
  fromStorageLocation?: StorageLocationSummary | null;
  toStorageLocation?: StorageLocationSummary | null;
  performedByUser: UserSummary;
}
