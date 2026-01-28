"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";

export default function Header() {
  const pathname = usePathname();
  const token = useAuthStore((s) => s.token);

  return (
    <header className="border-b border-[#e8e4df] bg-[#faf9f7]">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-[#2c1810]"
        >
          Каталог
        </Link>
        <nav className="flex items-center gap-4">
          {token ? (
            <>
              <Link
                href="/admin"
                className={`text-sm font-medium ${
                  pathname?.startsWith("/admin") && pathname !== "/admin/login"
                    ? "text-[#8b6914]"
                    : "text-[#5c4a32] hover:text-[#2c1810]"
                }`}
              >
                Админ
              </Link>
              <LogoutButton />
            </>
          ) : (
            <Link
              href="/admin/login"
              className="text-sm font-medium text-[#5c4a32] hover:text-[#2c1810]"
            >
              Админ
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

function LogoutButton() {
  const logout = useAuthStore((s) => s.logout);

  return (
    <button
      type="button"
      onClick={() => {
        logout();
        window.location.href = "/";
      }}
      className="text-sm font-medium text-[#5c4a32] hover:text-[#2c1810]"
    >
      Выйти
    </button>
  );
}
