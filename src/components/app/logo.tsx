import Image from "next/image";
import Link from "next/link";
import { appMetadata } from "@/lib/constants";

export function Logo() {
  return (
    <Link href="/" className="flex min-w-0 items-center gap-3">
      <Image
        src="/brand/expert-alumni-logo.png"
        alt={`${appMetadata.shortBrand} logo`}
        width={52}
        height={52}
        className="size-10 rounded-2xl bg-white object-contain p-1 shadow-sm ring-1 ring-slate-200 sm:size-12"
      />
      <div className="flex min-w-0 flex-col">
        <span className="truncate text-[11px] font-semibold tracking-[0.24em] text-slate-500 sm:text-sm">EXPERT Alumni</span>
        <span className="truncate text-base font-semibold text-slate-950 sm:text-lg">Expert Seva Diwas</span>
      </div>
    </Link>
  );
}
