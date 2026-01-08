// src/lib/actions/movements.ts
"use server";

import { apiRequest } from "../api-client";
import { Movement } from "../types";

export async function getMovements(): Promise<Movement[]> {
  const res = await apiRequest("/movements");
  return res.data;
}
