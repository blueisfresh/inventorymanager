"use client";

import { useEffect } from "react";
import { Toaster, showToast } from "@/components/ui/toaster";
import { useSearchParams } from "next/navigation";

export default function ClientToasts() {
  const params = useSearchParams();

  useEffect(() => {
    const msg = params.get("toast");
    const type = (params.get("type") as "success" | "error" | null) ?? null;
    if (msg) {
      showToast(msg, type ?? "success");
    }
  }, [params]);

  return <Toaster />;
}
