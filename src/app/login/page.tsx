// src/app/login/page.tsx
"use client";

import { useActionState } from "react";
import { loginAction } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, null);

  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <div className="w-full max-w-md rounded-lg border bg-white p-8 shadow-sm">
        <h1 className="mb-6 text-2xl font-bold text-center">EVITA Login</h1>

        <form action={formAction} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input
              name="username"
              type="text"
              required
              className="w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Passwort</label>
            <input
              name="password"
              type="password"
              required
              className="w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {state?.error && (
            <p className="text-sm text-red-500 bg-red-50 p-2 rounded">
              {state.error}
            </p>
          )}

          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? "Wird eingeloggt..." : "Einloggen"}
          </Button>
        </form>
      </div>
    </div>
  );
}
