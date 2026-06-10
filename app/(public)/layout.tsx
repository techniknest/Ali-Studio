import { getSettings } from "@/actions/settings.actions";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { WhatsAppButton } from "@/components/public/WhatsAppButton";
import { HeroBackground } from "@/components/public/HeroBackground";

export const dynamic = "force-dynamic";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings();

  return (
    <div className="relative min-h-screen bg-[#080808]">
      <HeroBackground />
      <Navbar settings={settings} />
      <main className="min-h-screen relative z-10">{children}</main>
      <Footer settings={settings} />
      <WhatsAppButton whatsappNumber={settings?.whatsappNumber ?? ""} />
    </div>
  );
}
