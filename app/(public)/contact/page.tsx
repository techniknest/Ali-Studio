import { getSettings } from "@/actions/settings.actions";
import { getServices } from "@/actions/services.actions";
import { submitContactForm } from "@/actions/messages.actions";
import { ContactForm } from "@/components/public/ContactForm";
import { formatWhatsAppUrl } from "@/lib/utils";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | Ali Studio",
  description: "Get in touch to book your cinematic experience.",
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const settings = await getSettings();
  const services = await getServices(true);
  const resolvedParams = await searchParams;
  const defaultService = resolvedParams.service || "";

  return (
    <div className="min-h-screen pt-24 bg-[#080808] relative overflow-hidden">
      {/* Decorative Blur Background */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-[var(--accent)]/5 rounded-full filter blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[var(--accent)]/5 rounded-full filter blur-[150px] pointer-events-none" />

      <div className="container-main section-padding relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span className="text-[10px] uppercase tracking-widest text-[var(--accent)] font-semibold px-3 py-1 border border-[var(--accent)]/20 rounded-full bg-[var(--accent)]/5 mb-6 inline-block">
            Let&apos;s Connect
          </span>
          <h1 className="font-display text-5xl font-light md:text-7xl text-white">
            Get in <span className="text-[var(--accent)]">Touch</span>
          </h1>
          <p className="mt-6 text-lg font-light text-[var(--text-secondary)] leading-relaxed">
            Whether you are inquiring about a cinematic wedding film, a commercial project, or an editorial shoot, we would love to hear from you.
          </p>
        </div>

        <div className="grid gap-16 lg:grid-cols-12 items-start">
          {/* Contact Details Side */}
          <div className="lg:col-span-5 space-y-12">
            
            <div className="space-y-8">
              <h3 className="font-display text-3xl text-white font-light">
                Contact <span className="text-[var(--accent)]">Information</span>
              </h3>
              
              <div className="space-y-6">
                {settings?.email && (
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full border border-[var(--accent)]/20 flex items-center justify-center bg-[var(--accent)]/5 text-[var(--accent)] shrink-0">
                      <Mail size={20} />
                    </div>
                    <div>
                      <p className="text-sm text-[var(--text-secondary)] uppercase tracking-wider font-semibold mb-1">Email</p>
                      <a href={`mailto:${settings.email}`} className="text-white hover:text-[var(--accent)] transition-colors text-lg font-light break-all">
                        {settings.email}
                      </a>
                    </div>
                  </div>
                )}
                
                {settings?.phone && (
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full border border-[var(--accent)]/20 flex items-center justify-center bg-[var(--accent)]/5 text-[var(--accent)] shrink-0">
                      <Phone size={20} />
                    </div>
                    <div>
                      <p className="text-sm text-[var(--text-secondary)] uppercase tracking-wider font-semibold mb-1">Phone</p>
                      <a href={`tel:${settings.phone}`} className="text-white hover:text-[var(--accent)] transition-colors text-lg font-light">
                        {settings.phone}
                      </a>
                    </div>
                  </div>
                )}

                {settings?.whatsappNumber && (
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full border border-[var(--accent)]/20 flex items-center justify-center bg-[var(--accent)]/5 text-[var(--accent)] shrink-0">
                      <MessageCircle size={20} />
                    </div>
                    <div>
                      <p className="text-sm text-[var(--text-secondary)] uppercase tracking-wider font-semibold mb-1">WhatsApp</p>
                      <a href={formatWhatsAppUrl(settings.whatsappNumber)} target="_blank" rel="noopener noreferrer" className="text-white hover:text-[var(--accent)] transition-colors text-lg font-light">
                        Chat with us
                      </a>
                    </div>
                  </div>
                )}
                
                {settings?.address && (
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full border border-[var(--accent)]/20 flex items-center justify-center bg-[var(--accent)]/5 text-[var(--accent)] shrink-0">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <p className="text-sm text-[var(--text-secondary)] uppercase tracking-wider font-semibold mb-1">Studio</p>
                      <p className="text-white text-lg font-light leading-relaxed max-w-xs">
                        {settings.address}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="aspect-video w-full overflow-hidden rounded-[2rem] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative group">
              <div className="absolute inset-0 border border-[var(--accent)]/20 rounded-[2rem] pointer-events-none z-10" />
              <iframe
                src={(settings?.mapsEmbedUrl && settings.mapsEmbedUrl.includes("embed")) ? settings.mapsEmbedUrl : `https://maps.google.com/maps?q=${encodeURIComponent(settings?.address || "Pakistan")}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                className="h-full w-full border-0 grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Studio location"
              />
            </div>
          </div>

          {/* Form Side */}
          <div className="lg:col-span-7">
            <div className="relative rounded-[2rem] border border-white/10 bg-[#111111]/80 backdrop-blur-xl p-8 md:p-12 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.9)] overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent)]/5 rounded-full filter blur-[100px] pointer-events-none" />
              
              <h3 className="font-display text-3xl text-white font-light mb-8">
                Send a <span className="text-[var(--accent)]">Message</span>
              </h3>
              
              <ContactForm 
                submitAction={submitContactForm} 
                services={services} 
                defaultService={defaultService} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
