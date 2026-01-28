"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { login } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";

export default function AdminLoginPage() {
  const router = useRouter();
  const setToken = useAuthStore((s) => s.setToken);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await login(userName, password);
      setToken(data.token);
      router.replace("/admin");
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: string } }).response?.data
          : null;
      setError(
        typeof msg === "string" ? msg : "Неверный логин или пароль"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-sm flex-col justify-center px-4 py-16 sm:py-24">
      <h1 className="text-xl font-semibold text-[#2c1810]">Вход в админку</h1>
      <p className="mt-2 text-sm text-[#5c4a32]">
        Учётные данные только для администратора.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        {error && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
            {error}
          </div>
        )}
        <div>
          <label
            htmlFor="userName"
            className="mb-1 block text-sm font-medium text-[#5c4a32]"
          >
            Логин
          </label>
          <input
            id="userName"
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full rounded-lg border border-[#e8e4df] bg-white px-3 py-2 text-[#2c1810] focus:border-[#8b6914] focus:outline-none focus:ring-1 focus:ring-[#8b6914]"
            required
            autoComplete="username"
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="mb-1 block text-sm font-medium text-[#5c4a32]"
          >
            Пароль
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-[#e8e4df] bg-white px-3 py-2 text-[#2c1810] focus:border-[#8b6914] focus:outline-none focus:ring-1 focus:ring-[#8b6914]"
            required
            autoComplete="current-password"
          />
        </div>
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 rounded-lg bg-[#2c1810] px-4 py-2 text-sm font-medium text-white hover:bg-[#3d2216] disabled:opacity-60"
          >
            {loading ? "Вход..." : "Войти"}
          </button>
          <Link
            href="/"
            className="rounded-lg border border-[#e8e4df] bg-white px-4 py-2 text-center text-sm font-medium text-[#5c4a32] hover:bg-[#f5f2ee]"
          >
            Назад
          </Link>
        </div>
      </form>
    </div>
  );
}
