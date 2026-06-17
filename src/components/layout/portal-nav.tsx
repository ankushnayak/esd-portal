"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type NavItem = { href: string; label: string };

export function PortalNav({ items, title }: { items: NavItem[]; title: string }) {
  const pathname = usePathname();

  return (
    <aside className="surface-card-muted p-4">
      <p className="px-3 pb-3 text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">{title}</p>
      <div className="flex flex-col gap-1">
        {items.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-2xl px-3 py-2.5 text-sm font-medium transition",
                active
                  ? "bg-[linear-gradient(135deg,#0f172a,#1d4ed8)] text-white shadow-[0_16px_32px_-24px_rgba(29,78,216,0.9)]"
                  : "text-slate-700 hover:bg-slate-100 hover:text-slate-950",
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
