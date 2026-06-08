"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Images,
  Briefcase,
  Star,
  Mail,
  Settings,
  Server,
  User,
  Users,
  LogOut,
  Menu,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";

const nav = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/portfolio", label: "Portfolio", icon: Images },
  { href: "/admin/services", label: "Services", icon: Briefcase },
  { href: "/admin/team", label: "Team", icon: Users },
  { href: "/admin/reviews", label: "Reviews", icon: Star },
  { href: "/admin/messages", label: "Messages", icon: Mail },
  { href: "/admin/settings", label: "Settings", icon: Settings },
  { href: "/admin/settings/infrastructure", label: "Infrastructure", icon: Server },
  { href: "/admin/settings/account", label: "Account", icon: User },
];

export function Sidebar({ unreadCount = 0 }: { unreadCount?: number }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Close sidebar on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-[var(--border)] bg-[var(--surface)] shrink-0 sticky top-0 z-20">
        <Link href="/admin/dashboard" className="font-display text-xl text-[var(--accent)]">
          Ali Studio
        </Link>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg bg-[var(--surface-alt)] text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 flex h-screen w-64 flex-col border-r border-[var(--border)] bg-[var(--surface)] transition-transform duration-300 ease-in-out md:static md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="hidden md:block border-b border-[var(--border)] p-6 shrink-0">
          <Link href="/admin/dashboard" className="font-display text-xl text-[var(--accent)]">
            Ali Studio
          </Link>
          <p className="text-xs text-[var(--text-secondary)] mt-1">Admin Panel</p>
        </div>
        
        {/* Mobile Header (Inside Drawer) */}
        <div className="md:hidden flex items-center justify-between p-6 border-b border-[var(--border)] shrink-0">
          <div>
            <span className="font-display text-xl text-[var(--accent)]">Ali Studio</span>
            <p className="text-xs text-[var(--text-secondary)] mt-1">Admin Panel</p>
          </div>
          <button onClick={() => setIsOpen(false)} className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--accent)]">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {nav.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors border-l-2",
                  active
                    ? "border-[var(--accent)] bg-[var(--surface-alt)] text-[var(--accent)]"
                    : "border-transparent text-[var(--text-secondary)] hover:bg-[var(--surface-alt)] hover:text-[var(--text-primary)]"
                )}
              >
                <Icon size={18} />
                {item.label}
                {item.href === "/admin/messages" && unreadCount > 0 && (
                  <span className="ml-auto rounded-full bg-[var(--accent)] px-2 py-0.5 text-xs text-[#080808]">
                    {unreadCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-[var(--border)] p-4 shrink-0">
          <button
            type="button"
            onClick={async () => {
              await signOut({ redirect: false });
              window.location.href = "/admin/login";
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[var(--text-secondary)] hover:bg-[var(--surface-alt)] hover:text-[var(--danger)]"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
