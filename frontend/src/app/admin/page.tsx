"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  getToys,
  createToy,
  updateToy,
  deleteToy,
} from "@/lib/api";
import type { Toy, ToyCreate } from "@/types/toy";
import AdminToyForm from "@/components/AdminToyForm";

export default function AdminPage() {
  const [toys, setToys] = useState<Toy[]>([]);
  const [loading, setLoading] = useState(true);
  const [formToy, setFormToy] = useState<Toy | null | "new">(null);

  const fetchToys = async () => {
    try {
      const { data } = await getToys();
      setToys(data ?? []);
    } catch {
      setToys([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchToys();
  }, []);

  const handleCreate = async (payload: ToyCreate) => {
    await createToy(payload);
    setFormToy(null);
    await fetchToys();
  };

  const handleUpdate = async (payload: Toy) => {
    await updateToy(payload.id, payload);
    setFormToy(null);
    await fetchToys();
  };

  const handleDelete = async (t: Toy) => {
    if (!confirm(`Удалить «${t.name}»?`)) return;
    await deleteToy(t.id);
    await fetchToys();
  };

  const handleSave = (data: ToyCreate | Toy) => {
    if ("id" in data && data.id) {
      handleUpdate(data as Toy);
    } else {
      handleCreate(data as ToyCreate);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#2c1810]">
            Управление каталогом
          </h1>
          <p className="mt-1 text-[#5c4a32]">Добавление, редактирование и удаление игрушек.</p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setFormToy("new")}
            className="rounded-lg bg-[#2c1810] px-4 py-2 text-sm font-medium text-white hover:bg-[#3d2216]"
          >
            Добавить
          </button>
          <Link
            href="/"
            className="rounded-lg border border-[#e8e4df] bg-white px-4 py-2 text-center text-sm font-medium text-[#5c4a32] hover:bg-[#f5f2ee]"
          >
            В каталог
          </Link>
        </div>
      </div>

      {formToy !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-xl border border-[#e8e4df] bg-[#faf9f7] p-6 shadow-lg">
            <h2 className="mb-4 text-lg font-semibold text-[#2c1810]">
              {formToy === "new" ? "Новая игрушка" : "Редактировать"}
            </h2>
            <AdminToyForm
              toy={formToy === "new" ? undefined : formToy}
              onSave={handleSave}
              onCancel={() => setFormToy(null)}
            />
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#e8e4df] border-t-[#8b6914]" />
        </div>
      ) : toys.length === 0 ? (
        <div className="rounded-lg border border-[#e8e4df] bg-white px-4 py-8 text-center text-[#5c4a32]">
          Нет игрушек. Нажмите «Добавить», чтобы создать первую.
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-[#e8e4df] bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[540px]">
              <thead>
                <tr className="border-b border-[#e8e4df] bg-[#f5f2ee]">
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#5c4a32]">
                    Фото
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#5c4a32]">
                    Название
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#5c4a32]">
                    Цена
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-[#5c4a32]">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody>
                {toys.map((t) => (
                  <tr
                    key={t.id}
                    className="border-b border-[#e8e4df] last:border-0"
                  >
                    <td className="px-4 py-3">
                      <div className="relative h-12 w-12 overflow-hidden rounded bg-[#f5f2ee]">
                        {t.imageUrl ? (
                          <Image
                            src={t.imageUrl}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="48px"
                            unoptimized={t.imageUrl.startsWith("http")}
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-[#a89f94] text-xs">
                            —
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium text-[#2c1810]">
                      {t.name}
                    </td>
                    <td className="px-4 py-3 text-[#5c4a32]">
                      {Number(t.price).toLocaleString("ru-RU")} р.
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => setFormToy(t)}
                        className="mr-2 text-sm font-medium text-[#8b6914] hover:text-[#2c1810]"
                      >
                        Изменить
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(t)}
                        className="text-sm font-medium text-[#a64343] hover:text-[#7a2e2e]"
                      >
                        Удалить
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
