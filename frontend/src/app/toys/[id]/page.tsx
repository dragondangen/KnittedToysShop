import { notFound } from "next/navigation";
import { getToyById } from "@/lib/api";
import ToyDetail from "@/components/ToyDetail";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function ToyPage({ params }: Props) {
  const { id } = await params;
  const numId = parseInt(id, 10);
  if (Number.isNaN(numId)) notFound();

  let toy: Awaited<ReturnType<typeof getToyById>>["data"] | null = null;
  try {
    const res = await getToyById(numId);
    toy = res.data;
  } catch {
    notFound();
  }

  if (!toy) notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
      <ToyDetail toy={toy} />
    </div>
  );
}
