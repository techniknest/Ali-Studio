"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ISettings } from "@/models/Settings";

const links = [
  { href: "/", label: "Home" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/reviews", label: "Reviews" },
  { href: "/contact", label: "Contact" },
  { href: "/admin/login", label: "Login" },
];

export function Navbar({ settings }: { settings: ISettings | null }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 z-40 w-full transition-all duration-300",
        scrolled
          ? "bg-[#080808]/90 backdrop-blur-md border-b border-[var(--border)]"
          : "bg-transparent"
      )}
    >
      <nav className="container-main flex h-16 items-center justify-between md:h-20">
        <Link href="/" className="font-display text-2xl font-light tracking-tight">
          {settings?.studioName ?? "Ali Studio"}
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  "text-sm uppercase tracking-widest transition-colors hover:text-[var(--accent)]",
                  pathname === link.href
                    ? "text-[var(--accent)]"
                    : "text-[var(--text-secondary)]"
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <button
          type="button"
          className="md:hidden text-[var(--text-primary)]"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-[var(--border)] bg-[#080808] md:hidden">
          <ul className="flex flex-col gap-4 p-6">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block text-sm uppercase tracking-widest"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
