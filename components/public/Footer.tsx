import Link from "next/link";
import { formatWhatsAppUrl } from "@/lib/utils";
import type { ISettings } from "@/models/Settings";
import { Instagram, Facebook, Mail, Music, MessageCircle, Youtube } from "lucide-react";

export function Footer({ settings }: { settings: ISettings | null }) {
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-10 border-t border-white/5 bg-[#0a0a0a] section-padding pt-24 pb-12">
      {/* Decorative Top Line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-30" />
      
      <div className="container-main">
        <div className="grid gap-16 md:grid-cols-2 lg:grid-cols-4">
          
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <h3 className="font-display text-3xl font-light text-white mb-4">
              {settings?.studioName ?? "Ali Studio"}<span className="text-[var(--accent)]">.</span>
            </h3>
            <p className="text-sm text-[var(--text-secondary)] font-light leading-relaxed max-w-xs">
              {settings?.tagline ?? "Cinematic Stories, Timeless Memories"}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-6 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
              Explore
            </h4>
            <ul className="space-y-4 text-sm font-light text-[var(--text-secondary)]">
              <li><Link href="/portfolio" className="hover:text-[var(--accent)] transition-colors">Portfolio</Link></li>
              <li><Link href="/services" className="hover:text-[var(--accent)] transition-colors">Services</Link></li>
              <li><Link href="/about" className="hover:text-[var(--accent)] transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-[var(--accent)] transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="mb-6 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
              Connect
            </h4>
            <ul className="space-y-4 text-sm font-light text-[var(--text-secondary)]">
              <li>
                <a href={settings?.instagram || "#"} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-[var(--accent)] transition-colors">
                  <Instagram size={16} className="text-[var(--accent)]" /> Instagram
                </a>
              </li>
              <li>
                <a href={settings?.facebook || "#"} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-[var(--accent)] transition-colors">
                  <Facebook size={16} className="text-[var(--accent)]" /> Facebook
                </a>
              </li>
              <li>
                <a href={settings?.tiktok || "#"} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-[var(--accent)] transition-colors">
                  <Music size={16} className="text-[var(--accent)]" /> TikTok
                </a>
              </li>
              <li>
                <a href={settings?.youtube || "#"} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-[var(--accent)] transition-colors">
                  <Youtube size={16} className="text-[var(--accent)]" /> YouTube
                </a>
              </li>
              <li>
                <a href={settings?.whatsappNumber ? formatWhatsAppUrl(settings.whatsappNumber) : "#"} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-[var(--accent)] transition-colors">
                  <MessageCircle size={16} className="text-[var(--accent)]" /> WhatsApp
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="mb-6 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
              Inquiries
            </h4>
            <ul className="space-y-4 text-sm font-light text-[var(--text-secondary)]">
              <li>
                <a href={`mailto:${settings?.email || "hello@alistudio.com"}`} className="flex items-center gap-3 hover:text-[var(--accent)] transition-colors">
                  <Mail size={16} className="text-[var(--accent)]" /> {settings?.email || "Email Us"}
                </a>
              </li>
              {settings?.phone && (
                <li>
                  <span className="flex items-center gap-3">
                    <span className="opacity-60">Tel:</span> {settings.phone}
                  </span>
                </li>
              )}
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-20 pt-8 border-t border-white/5 flex flex-col items-center justify-between gap-6 md:flex-row text-center md:text-left">
          <p className="text-[11px] uppercase tracking-widest text-[var(--text-secondary)] font-light">
            © {year} {settings?.studioName ?? "Ali Studio"}. All rights reserved.
            {settings?.footerText && ` ${settings.footerText}`}
          </p>
          <p className="text-[11px] uppercase tracking-widest text-[var(--text-secondary)] font-light">
            Engineered by{" "}
            <a
              href="https://techniknest.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--accent)] hover:underline font-semibold"
            >
              TechnikNest Pvt Ltd
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
