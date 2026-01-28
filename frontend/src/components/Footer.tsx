const TELEGRAM_DIRECT = "https://t.me/miracles211";

export default function Footer() {
  return (
    <footer className="border-t border-[#e8e4df] bg-[#faf9f7]">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-[#5c4a32]">
            Магазин вязаных игрушек. Заказы через Telegram.
          </p>
          <a
            href={TELEGRAM_DIRECT}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-[#8b6914] hover:text-[#2c1810]"
          >
            Написать в Telegram
          </a>
        </div>
      </div>
    </footer>
  );
}
