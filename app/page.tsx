"use client";

import { MainNav } from "@/components/main-nav";
import { useAuthStore } from "@/lib/store/auth-store";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const { user } = useAuthStore();
  if (user) {
    router.push("/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col container mx-auto">
      <MainNav />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Welcome to Prexun
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                A modern authentication system built with Next.js, Laravel, and shadcn/ui.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}