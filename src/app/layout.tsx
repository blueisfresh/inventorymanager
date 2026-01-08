import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientToasts from "./toasts";
import { getSession, clearSession } from "@/lib/session"; // Neu hinzugefügt
import { redirect } from "next/navigation"; // Neu hinzugefügt
import { Button } from "@/components/ui/button"; // Falls vorhanden

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EVITA Inventory Manager",
  description: "Next.js Java Backend Integration",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Session abrufen
  const session = await getSession();

  // Server Action für den Logout
  async function handleLogout() {
    "use server";
    await clearSession();
    redirect("/login");
  }

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <header className="border-b bg-white">
          <nav className="container mx-auto flex items-center justify-between py-4">
            <a href="/" className="text-xl font-semibold">
              EVITA Inventory
            </a>
            <div className="flex gap-4 items-center">
              <a href="/" className="text-gray-700 hover:text-black">
                Home
              </a>
              <a href="/inventory" className="text-gray-700 hover:text-black">
                Inventory
              </a>
              <a href="/storage" className="text-gray-700 hover:text-black">
                Storage
              </a>
              <a href="/labs" className="text-gray-700 hover:text-black">
                Labs
              </a>
              <a href="/movements" className="text-gray-700 hover:text-black">
                Movements
              </a>

              <div className="border-l pl-4 flex gap-4 items-center">
                {session ? (
                  <>
                    <span className="text-sm font-medium text-gray-500">
                      Hi, {session.username}
                    </span>
                    <form action={handleLogout}>
                      <button
                        type="submit"
                        className="text-red-600 hover:underline text-sm font-medium"
                      >
                        Logout
                      </button>
                    </form>
                  </>
                ) : (
                  <a
                    href="/login"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                  >
                    Sign In
                  </a>
                )}
              </div>
            </div>
          </nav>
        </header>
        <main className="container mx-auto py-6">{children}</main>
        <ClientToasts />
      </body>
    </html>
  );
}
