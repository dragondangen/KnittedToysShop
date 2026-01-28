"use client";

import Image from "next/image";
import Link from "next/link";
import type { Toy } from "@/types/toy";

const TELEGRAM_DIRECT = "https://t.me/miracles211";

type Props = { toy: Toy };

export default function ToyDetail({ toy }: Props) {
  const text = `Хочу купить: ${toy.name}`;
  const href = `${TELEGRAM_DIRECT}?text=${encodeURIComponent(text)}`;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="overflow-hidden rounded-xl border border-[#e8e4df] bg-white shadow-sm">
        <div className="relative aspect-[4/3] bg-[#f5f2ee]">
          {toy.imageUrl ? (
            <Image
              src={toy.imageUrl}
              alt={toy.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 672px"
              priority
              unoptimized={toy.imageUrl.startsWith("http")}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-[#a89f94]">
              Нет изображения
            </div>
          )}
        </div>
        <div className="p-6 sm:p-8">
          <h1 className="text-xl font-semibold text-[#2c1810] sm:text-2xl">
            {toy.name}
          </h1>
          <p className="mt-2 text-[#5c4a32]">
            {Number(toy.price).toLocaleString("ru-RU")} р.
          </p>
          {toy.description && (
            <p className="mt-4 text-[#5c4a32] leading-relaxed">
              {toy.description}
            </p>
          )}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-lg bg-[#2c1810] px-5 py-3 text-sm font-medium text-white hover:bg-[#3d2216]"
            >
              Написать в Telegram
            </a>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-lg border border-[#e8e4df] bg-white px-5 py-3 text-sm font-medium text-[#5c4a32] hover:bg-[#f5f2ee]"
            >
              Назад в каталог
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
