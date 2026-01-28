import Image from "next/image";
import Link from "next/link";
import type { Toy } from "@/types/toy";

type Props = { toy: Toy };

export default function ToyCard({ toy }: Props) {
  return (
    <Link
      href={`/toys/${toy.id}`}
      className="group block overflow-hidden rounded-lg border border-[#e8e4df] bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-[4/3] bg-[#f5f2ee]">
        {toy.imageUrl ? (
          <Image
            src={toy.imageUrl}
            alt={toy.name}
            fill
            className="object-cover transition-transform group-hover:scale-[1.02]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            unoptimized={toy.imageUrl.startsWith("http")}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[#a89f94]">
            Нет изображения
          </div>
        )}
      </div>
      <div className="p-4">
        <h2 className="font-semibold text-[#2c1810] line-clamp-1">
          {toy.name}
        </h2>
        <p className="mt-1 text-sm text-[#5c4a32]">
          {Number(toy.price).toLocaleString("ru-RU")} р.
        </p>
      </div>
    </Link>
  );
}
