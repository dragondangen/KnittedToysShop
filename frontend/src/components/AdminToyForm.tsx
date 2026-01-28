"use client";

import { useState } from "react";
import type { Toy, ToyCreate } from "@/types/toy";

type Props = {
  toy?: Toy | null;
  onSave: (data: ToyCreate | Toy) => void;
  onCancel: () => void;
};

export default function AdminToyForm({ toy, onSave, onCancel }: Props) {
  const [name, setName] = useState(toy?.name ?? "");
  const [description, setDescription] = useState(toy?.description ?? "");
  const [price, setPrice] = useState(String(toy?.price ?? ""));
  const [imageUrl, setImageUrl] = useState(toy?.imageUrl ?? "");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const p = parseFloat(price.replace(",", "."));
    if (!name.trim()) {
      setError("Укажите название.");
      return;
    }
    if (Number.isNaN(p) || p <= 0) {
      setError("Укажите корректную цену.");
      return;
    }
    if (toy) {
      onSave({ ...toy, name: name.trim(), description: description.trim(), price: p, imageUrl: imageUrl.trim() });
    } else {
      onSave({ name: name.trim(), description: description.trim(), price: p, imageUrl: imageUrl.trim() });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
          {error}
        </p>
      )}
      <div>
        <label htmlFor="name" className="mb-1 block text-sm font-medium text-[#5c4a32]">
          Название
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg border border-[#e8e4df] bg-white px-3 py-2 text-[#2c1810] focus:border-[#8b6914] focus:outline-none focus:ring-1 focus:ring-[#8b6914]"
          required
        />
      </div>
      <div>
        <label htmlFor="description" className="mb-1 block text-sm font-medium text-[#5c4a32]">
          Описание
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-[#e8e4df] bg-white px-3 py-2 text-[#2c1810] focus:border-[#8b6914] focus:outline-none focus:ring-1 focus:ring-[#8b6914]"
        />
      </div>
      <div>
        <label htmlFor="price" className="mb-1 block text-sm font-medium text-[#5c4a32]">
          Цена (р.)
        </label>
        <input
          id="price"
          type="text"
          inputMode="decimal"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full rounded-lg border border-[#e8e4df] bg-white px-3 py-2 text-[#2c1810] focus:border-[#8b6914] focus:outline-none focus:ring-1 focus:ring-[#8b6914]"
          required
        />
      </div>
      <div>
        <label htmlFor="imageUrl" className="mb-1 block text-sm font-medium text-[#5c4a32]">
          URL изображения
        </label>
        <input
          id="imageUrl"
          type="url"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="w-full rounded-lg border border-[#e8e4df] bg-white px-3 py-2 text-[#2c1810] focus:border-[#8b6914] focus:outline-none focus:ring-1 focus:ring-[#8b6914]"
        />
      </div>
      <div className="flex gap-3">
        <button
          type="submit"
          className="rounded-lg bg-[#2c1810] px-4 py-2 text-sm font-medium text-white hover:bg-[#3d2216]"
        >
          {toy ? "Сохранить" : "Добавить"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-[#e8e4df] bg-white px-4 py-2 text-sm font-medium text-[#5c4a32] hover:bg-[#f5f2ee]"
        >
          Отмена
        </button>
      </div>
    </form>
  );
}
