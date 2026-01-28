import { getToys } from "@/lib/api";
import ToyCard from "@/components/ToyCard";

export const dynamic = "force-dynamic";

export default async function Home() {
  let toys: Awaited<ReturnType<typeof getToys>>["data"] = [];
  let error = false;
  try {
    const res = await getToys();
    toys = res.data ?? [];
  } catch {
    error = true;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-[#2c1810] sm:text-3xl">
          Каталог вязаных игрушек
        </h1>
        <p className="mt-2 text-[#5c4a32]">
          Выберите игрушку и напишите в Telegram для заказа.
        </p>
      </div>

      {error ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800">
          Не удалось загрузить каталог. Проверьте, что API запущен и{" "}
          <code className="rounded bg-amber-100 px-1">NEXT_PUBLIC_API_URL</code>{" "}
          указан верно.
        </div>
      ) : toys.length === 0 ? (
        <div className="rounded-lg border border-[#e8e4df] bg-white px-4 py-8 text-center text-[#5c4a32]">
          В каталоге пока нет игрушек.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {toys.map((t) => (
            <ToyCard key={t.id} toy={t} />
          ))}
        </div>
      )}
    </div>
  );
}
