"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";

type Props = { children: React.ReactNode };

export default function AdminGuard({ children }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const { hydrate, hydrated, token } = useAuthStore();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const isLoginPage = pathname === "/admin/login";

  // Redirect authenticated users away from login page
  useEffect(() => {
    if (hydrated && isLoginPage && token) {
      router.replace("/admin");
    }
  }, [hydrated, isLoginPage, token, router]);

  // Redirect unauthenticated users to login page
  useEffect(() => {
    if (hydrated && !isLoginPage && !token) {
      router.replace("/admin/login");
    }
  }, [hydrated, isLoginPage, token, router]);

  if (!hydrated) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#e8e4df] border-t-[#8b6914]" />
      </div>
    );
  }

  if (isLoginPage) {
    if (token) {
      return (
        <div className="flex min-h-[40vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#e8e4df] border-t-[#8b6914]" />
        </div>
      );
    }
    return <>{children}</>;
  }

  if (!token) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#e8e4df] border-t-[#8b6914]" />
      </div>
    );
  }

  return <>{children}</>;
}
