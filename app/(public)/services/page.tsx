import Link from "next/link";
import { getServices } from "@/actions/services.actions";
import { getSettings } from "@/actions/settings.actions";
import { ServiceCard } from "@/components/public/ServiceCard";
import { FadeUp, StaggerContainer, StaggerItem } from "@/components/public/Animations";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Services | Ali Studio",
  description: "Wedding films, event coverage, and creative videography services.",
};

export default async function ServicesPage() {
  const services = await getServices(true);
  const settings = await getSettings();

  return (
    <div className="pt-24">
      <section className="section-padding bg-[#111111]/50 backdrop-blur-md">
        <StaggerContainer className="container-main text-center">
          <StaggerItem>
            <h1 className="font-display text-5xl font-light md:text-6xl">
              Our <span className="text-[var(--accent)]">Services</span>
            </h1>
          </StaggerItem>
          <StaggerItem>
            <p className="mx-auto mt-4 max-w-xl text-[var(--text-secondary)]">
              Premium cinematography and photography packages tailored to your vision.
            </p>
          </StaggerItem>
        </StaggerContainer>
      </section>

      <section className="section-padding">
        <div className="container-main space-y-32">
          {services.map((service: {
            _id: string;
            title: string;
            shortDescription: string;
            longDescription: string;
            imageUrl: string;
            priceRange: string;
          }, index: number) => {
            const isEven = index % 2 === 0;
            // prefilled whatsapp message
            const whatsappText = `Hello Ali Studio, I would like to inquire about booking the "${service.title}" service.`;
            const whatsappUrl = settings?.whatsappNumber 
              ? `https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(whatsappText)}`
              : "";

            return (
              <div
                key={service._id}
                id={service._id}
                className={`flex flex-col md:flex-row gap-16 items-center scroll-mt-28 ${isEven ? '' : 'md:flex-row-reverse'}`}
              >
                <FadeUp delay={0.1} className="flex-1 space-y-6 relative z-10">
                  <div className="inline-block px-4 py-1.5 border border-[var(--accent)]/20 rounded-full text-[var(--accent)] text-xs uppercase tracking-widest bg-[var(--accent)]/5 backdrop-blur-sm">
                    Service {String(index + 1).padStart(2, '0')}
                  </div>
                  <h2 className="font-display text-4xl text-white font-light">{service.title}</h2>
                  <p className="text-[var(--text-secondary)] leading-relaxed text-lg">
                    {service.shortDescription}
                  </p>
                  {service.longDescription && (
                    <div
                      className="prose prose-invert text-[var(--text-secondary)] text-sm leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: service.longDescription }}
                    />
                  )}
                  {service.priceRange && (
                    <p className="text-[var(--accent)] font-medium text-lg">
                      Starting at {service.priceRange}
                    </p>
                  )}
                  <div className="pt-4 flex flex-wrap gap-4">
                    <Link
                      href={`/contact?service=${encodeURIComponent(service.title)}`}
                      className="inline-flex h-12 items-center justify-center rounded-full bg-[var(--accent)] px-8 text-xs font-semibold uppercase tracking-widest text-[#080808] transition-transform hover:scale-105 shadow-[0_0_20px_rgba(201,168,76,0.3)]"
                    >
                      Book Service
                    </Link>
                    {whatsappUrl && (
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-12 items-center justify-center rounded-full border border-white/20 bg-white/5 px-8 text-xs font-semibold uppercase tracking-widest text-white backdrop-blur-sm transition-transform hover:scale-105 hover:bg-white/10"
                      >
                        Contact on WhatsApp
                      </a>
                    )}
                  </div>
                </FadeUp>
                <FadeUp delay={0.25} className="w-full max-w-[450px] md:max-w-none md:w-[380px] lg:w-[420px] md:flex-shrink-0 mx-auto relative z-20">
                  <ServiceCard service={service} />
                </FadeUp>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
