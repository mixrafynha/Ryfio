"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => {
        if (window.history.length > 1) {
          router.back();
          return;
        }

        router.push("/products");
      }}
      className="group absolute right-3 grid h-8 w-8 place-items-center rounded-full border border-white/[0.1] bg-white/[0.045] text-white/76 shadow-[0_8px_24px_rgba(0,0,0,0.18)] transition active:scale-[0.96] hover:border-fuchsia-300/30 hover:bg-white/[0.07] hover:text-white sm:right-5 md:static md:h-9 md:w-9"
      aria-label="Back to previous page"
    >
      <ArrowLeft
        size={14}
        className="transition-transform duration-200 md:group-hover:-translate-x-0.5"
        aria-hidden="true"
      />
    </button>
  );
}
