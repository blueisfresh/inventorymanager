"use client";

import { useEffect } from "react";

type ToastType = "success" | "error" | "info" | "warning";

export function showToast(message: string, type: ToastType = "info") {
  const event = new CustomEvent("app:toast", { detail: { message, type } });
  window.dispatchEvent(event);
}

export function Toaster() {
  useEffect(() => {
    const container = document.createElement("div");
    container.id = "toast-container";
    container.style.position = "fixed";
    container.style.top = "16px";
    container.style.right = "16px";
    container.style.zIndex = "9999";
    document.body.appendChild(container);

    function handleToast(e: Event) {
      const detail = (e as CustomEvent).detail as {
        message: string;
        type: ToastType;
      };
      const toast = document.createElement("div");
      toast.className = `shadow rounded-md px-4 py-3 mb-2 text-white text-sm animate-in fade-in slide-in-from-top-2`;
      toast.style.backgroundColor =
        detail.type === "success"
          ? "#16a34a"
          : detail.type === "error"
          ? "#dc2626"
          : detail.type === "warning"
          ? "#d97706"
          : "#2563eb";
      toast.textContent = detail.message;
      container.appendChild(toast);
      setTimeout(() => toast.remove(), 3500);
    }

    window.addEventListener("app:toast", handleToast as EventListener);
    return () => {
      window.removeEventListener("app:toast", handleToast as EventListener);
      container.remove();
    };
  }, []);

  return null;
}
