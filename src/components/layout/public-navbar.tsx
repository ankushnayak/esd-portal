"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/app/logo";
import { navigation } from "@/lib/constants";

export function PublicNavbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <div className="min-w-0 flex-1 lg:flex-none">
          <Logo />
        </div>
        <nav className="hidden items-center gap-6 lg:flex">
          {navigation.public.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm text-slate-700 transition hover:text-slate-950">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 sm:flex">
          <Button variant="outline" render={<Link href="/login" />}>
            Alumni Login
          </Button>
          <Button render={<Link href="/register" />}>Register</Button>
        </div>
        <button
          type="button"
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          className="inline-flex size-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-sm transition hover:bg-slate-50 lg:hidden"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-slate-200 bg-white lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4 sm:px-6">
            {navigation.public.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-2xl px-3 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-950"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 grid gap-2 sm:hidden">
              <Button variant="outline" render={<Link href="/login" />} onClick={() => setOpen(false)}>
                Alumni Login
              </Button>
              <Button render={<Link href="/register" />} onClick={() => setOpen(false)}>
                Register as Alumni
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
