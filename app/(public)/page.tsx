import Link from "next/link";
import Image from "next/image";
import { getSettings } from "@/actions/settings.actions";
import { getPortfolioItems } from "@/actions/portfolio.actions";
import { getServices } from "@/actions/services.actions";
import { getReviews } from "@/actions/reviews.actions";
import { getTeam } from "@/actions/team.actions";
import { AnimatedCounter } from "@/components/public/AnimatedCounter";
import { formatWhatsAppUrl, getDisplayCategory } from "@/lib/utils";
import { FadeUp, RevealText, StaggerContainer, StaggerItem, MouseTilt } from "@/components/public/Animations";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    title: settings?.metaTitle ?? "Ali Studio | Cinematic Videography",
    description: settings?.metaDescription,
  };
}


export default async function HomePage() {
  const settings = await getSettings();
  const portfolio = await getPortfolioItems({ visibleOnly: true, featuredOnly: true, limit: 6 });
  const allServices = await getServices(true);
  const reviewsData = await getReviews({ approvedOnly: true, limit: 6 });
  const reviews = reviewsData.items;
  const teamMembers = await getTeam(true);

  const headline = settings?.heroHeadline ?? "We Capture Your Story";

  return (
    <>
      {/* Hero Section */}
      <section id="hero-section" className="relative flex min-h-screen items-center justify-center overflow-hidden">
        {/* Background Media */}
        {settings?.heroVideoUrl ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 h-full w-full object-cover scale-105"
            poster={settings.heroImageUrl || undefined}
          >
            <source src={settings.heroVideoUrl} type="video/mp4" />
          </video>
        ) : settings?.heroImageUrl ? (
          <Image
            src={settings.heroImageUrl}
            alt="Hero"
            fill
            unoptimized={true}
            className="object-cover scale-105 animate-[slowZoom_20s_infinite_alternate]"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#0d0d0d] via-[#080808] to-[#050505]" />
        )}

        {/* Multi-layer Cinematic Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/60 to-[#080808]/90 z-[1]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,168,76,0.08)_0%,transparent_65%)] pointer-events-none z-[2]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_80%,rgba(201,168,76,0.04)_0%,transparent_50%)] pointer-events-none z-[2]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(201,168,76,0.04)_0%,transparent_50%)] pointer-events-none z-[2]" />

        {/* Decorative Corner Accents */}
        <div className="absolute top-8 left-8 w-16 h-16 border-t border-l border-[var(--accent)]/20 z-[3] hidden md:block" />
        <div className="absolute top-8 right-8 w-16 h-16 border-t border-r border-[var(--accent)]/20 z-[3] hidden md:block" />
        <div className="absolute bottom-24 left-8 w-16 h-16 border-b border-l border-[var(--accent)]/20 z-[3] hidden md:block" />
        <div className="absolute bottom-24 right-8 w-16 h-16 border-b border-r border-[var(--accent)]/20 z-[3] hidden md:block" />

        {/* Thin Decorative Lines */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-20 bg-gradient-to-b from-transparent via-[var(--accent)]/30 to-transparent z-[3]" />

        {/* Hero Content */}
        <div className="container-main relative z-10 pt-20 pb-24 text-center flex flex-col items-center">
          {/* Logo */}
          {settings?.logoUrl && (
            <FadeUp delay={0.15} className="mb-6 flex justify-center">
              <MouseTilt offset={15}>
                <div className="relative">
                  <Image
                    src={settings.logoUrl}
                    alt="Ali Studio Logo"
                    width={160}
                    height={160}
                    unoptimized={true}
                    className="object-contain drop-shadow-[0_0_40px_rgba(201,168,76,0.3)]"
                  />
                  {/* Subtle glow ring behind logo */}
                  <div className="absolute inset-0 -m-4 rounded-full bg-[radial-gradient(circle,rgba(201,168,76,0.08)_0%,transparent_70%)] pointer-events-none" />
                </div>
              </MouseTilt>
            </FadeUp>
          )}

          {/* Tagline Chip */}
          <FadeUp delay={0.3} className="mb-10">
            <span className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full border border-[var(--accent)]/15 bg-[var(--accent)]/[0.04] backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] hero-pulse-dot" />
              <span className="text-[10px] uppercase tracking-[0.35em] font-medium text-[var(--accent)]/80">
                Cinematic Videography & Photography
              </span>
            </span>
          </FadeUp>

          {/* Gold Separator Line */}
          <FadeUp delay={0.4} className="mb-10">
            <div className="flex items-center gap-4 justify-center">
              <div className="w-12 h-px bg-gradient-to-r from-transparent to-[var(--accent)]/40" />
              <div className="w-1.5 h-1.5 rotate-45 border border-[var(--accent)]/40" />
              <div className="w-12 h-px bg-gradient-to-l from-transparent to-[var(--accent)]/40" />
            </div>
          </FadeUp>

          {/* Main Headline */}
          <RevealText
            text={headline}
            className="font-display text-4xl sm:text-5xl font-light leading-[1.1] tracking-wide md:text-7xl lg:text-[5.5rem] text-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.5)] px-4"
          />

          {/* Subheadline */}
          <FadeUp delay={0.65}>
            <p className="mx-auto mt-8 max-w-lg text-base md:text-lg text-[var(--text-secondary)] font-light tracking-[0.02em] leading-relaxed">
              {settings?.heroSubheadline}
            </p>
          </FadeUp>

          {/* CTA Buttons */}
          <FadeUp delay={0.85} className="mt-10 sm:mt-14 w-full px-6 sm:px-0">
            <MouseTilt offset={10} className="flex flex-col sm:flex-row w-full sm:w-auto justify-center gap-6 sm:gap-5">
              <Link
                href="/portfolio"
                className="hero-btn-outline group relative inline-flex w-full sm:w-auto h-[52px] items-center justify-center overflow-hidden rounded-full border border-[var(--accent)]/40 bg-white/[0.02] px-10 backdrop-blur-md transition-all duration-500 hover:border-[var(--accent)] hover:bg-[var(--accent)]/10 hover:shadow-[0_0_30px_rgba(201,168,76,0.15)]"
              >
                <span className="relative z-10 text-[11px] font-semibold tracking-[0.25em] uppercase text-[var(--accent)]">
                  View Our Work
                </span>
                {/* Shimmer sweep effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-[var(--accent)]/10 to-transparent" />
              </Link>

              {settings?.whatsappNumber && (
                <a
                  href={formatWhatsAppUrl(settings.whatsappNumber)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hero-btn-solid group relative inline-flex w-full sm:w-auto h-[52px] items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-[var(--accent)] via-[#d4b65e] to-[var(--accent)] bg-[length:200%_100%] px-10 transition-all duration-500 hover:bg-[position:100%_0] hover:shadow-[0_8px_40px_rgba(201,168,76,0.35)] hover:scale-[1.03]"
                >
                  <span className="relative z-10 text-[11px] font-bold tracking-[0.25em] uppercase text-[#080808]">
                    Book Now
                  </span>
                  {/* Shimmer sweep effect */}
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
                </a>
              )}
            </MouseTilt>
          </FadeUp>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-20">
          <FadeUp delay={1.2}>
            <div className="flex flex-col items-center gap-3">
              <span className="text-[9px] uppercase tracking-[0.4em] font-medium text-[var(--accent)]/60">
                Scroll
              </span>
              <div className="relative w-5 h-8 rounded-full border border-[var(--accent)]/20 flex justify-center">
                <div className="w-0.5 h-2 mt-1.5 rounded-full bg-[var(--accent)]/60 scroll-bounce" />
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* About Section */}
      {settings?.aboutText && (
        <section className="section-padding bg-[#1a1a1a]/50 backdrop-blur-md relative overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-[var(--accent)] rounded-full mix-blend-multiply filter blur-[128px] opacity-10 animate-pulse" />
          <div className="container-main grid gap-16 lg:grid-cols-2 items-center">
            <FadeUp className="space-y-8">
              <h2 className="font-display text-4xl font-light md:text-5xl">
                The <span className="text-[var(--accent)]">Art</span> of Storytelling
              </h2>
              <div className="space-y-6 text-lg leading-relaxed text-[var(--text-secondary)] font-light">
                {settings.aboutText.split('\n').map((para: string, i: number) => para.trim() && (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </FadeUp>
            <FadeUp delay={0.2} className="relative w-full aspect-[5/4] rounded-3xl overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] border border-[var(--accent)]/10 group">
              {settings?.aboutImageUrl ? (
                <Image src={settings.aboutImageUrl} alt="About Studio" fill unoptimized={true} className="object-cover transition-transform duration-1000 group-hover:scale-105" sizes="(max-width: 1024px) 100vw, 50vw" />
              ) : (
                <div className="w-full h-full bg-gradient-to-tr from-[#111] to-[#222]" />
              )}
              <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-transparent opacity-80 group-hover:opacity-40 transition-opacity duration-700 pointer-events-none" />
            </FadeUp>
          </div>
        </section>
      )}

      {/* Featured Work */}
      {portfolio.items.length > 0 && (
        <section className="section-padding">
          <div className="container-main">
            <FadeUp>
              <h2 className="font-display text-4xl font-light md:text-5xl text-center mb-16">
                Featured <span className="text-[var(--accent)]">Work</span>
              </h2>
            </FadeUp>
            <StaggerContainer className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {portfolio.items.map((item: { _id: string; title: string; images: string[]; category: string }) => (
                <StaggerItem key={item._id}>
                  <Link
                    href="/portfolio"
                    className="group relative block aspect-[4/3] overflow-hidden rounded-2xl bg-[#111] shadow-2xl perspective-1000 w-full"
                  >
                    <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105 group-hover:rotate-1">
                      {item.images[0] && (
                        <Image
                          src={item.images[0]}
                          alt={item.title}
                          fill
                          unoptimized={true}
                          className="object-cover object-top"
                          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                        />
                      )}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent opacity-85 transition-opacity duration-500 group-hover:opacity-100 z-10" />
                    <div className="absolute bottom-0 left-0 right-0 p-8 translate-y-6 transition-transform duration-500 group-hover:translate-y-0 z-20">
                      <span className="text-xs uppercase tracking-widest text-[var(--accent)] font-medium">
                        {getDisplayCategory(item.category, item.title, item.images[0])}
                      </span>
                      <h3 className="font-display text-2xl mt-3 text-white">
                        {item.title.toLowerCase().includes("portfolio") ? "Ali Studio" : item.title}
                      </h3>
                    </div>
                    {/* Glowing border effect */}
                    <div className="absolute inset-0 rounded-2xl border-2 border-transparent transition-colors duration-500 group-hover:border-[var(--accent)]/30 z-30" />
                  </Link>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>
      )}

      {/* Services */}
      {allServices.length > 0 && (
        <section className="section-padding bg-[#1a1a1a]/50 backdrop-blur-md relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-20" />
          <div className="container-main">
            <FadeUp>
              <h2 className="font-display text-4xl font-light md:text-5xl text-center mb-6">
                Our Premium <span className="text-[var(--accent)]">Services</span>
              </h2>
              <p className="mx-auto max-w-xl text-center text-[var(--text-secondary)] mb-20">
                Discover our range of professional cinematography and photography packages designed to capture your key moments.
              </p>
            </FadeUp>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {allServices.slice(0, 9).map((service: { _id: string; title: string; shortDescription: string; priceRange: string; imageUrl?: string; images?: string[] }) => {
                const serviceImg = (service.images && service.images.length > 0) ? service.images[0] : service.imageUrl;
                return (
                  <FadeUp key={service._id}>
                    <Link
                      href={`/services#${service._id}`}
                      className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/[0.04] bg-[#161616]/60 backdrop-blur-md p-5 transition-all duration-500 hover:-translate-y-2 hover:border-[var(--accent)]/30 hover:shadow-[0_20px_50px_rgba(0,0,0,0.7)] h-full"
                    >
                      {/* Image frame */}
                      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-black shadow-inner">
                        {serviceImg ? (
                          <Image
                            src={serviceImg}
                            alt={service.title}
                            fill
                            unoptimized={true}
                            className="object-contain bg-black transition-transform duration-700 group-hover:scale-102"
                            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-tr from-neutral-800 to-neutral-900" />
                        )}
                        <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500" />
                      </div>

                      {/* Text content area */}
                      <div className="flex flex-col flex-grow pt-6 space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] uppercase tracking-widest text-[var(--accent)] font-semibold px-2.5 py-1 border border-[var(--accent)]/20 rounded-full bg-[var(--accent)]/5">
                            Premium Package
                          </span>
                          {service.priceRange && (
                            <span className="text-xs text-[var(--text-secondary)] font-medium">
                              From {service.priceRange}
                            </span>
                          )}
                        </div>

                        <h3 className="font-display text-2xl text-white group-hover:text-[var(--accent)] transition-colors duration-300">
                          {service.title}
                        </h3>

                        <p className="text-sm text-[var(--text-secondary)] font-light leading-relaxed line-clamp-3">
                          {service.shortDescription}
                        </p>

                        <div className="pt-2 mt-auto">
                          <span className="inline-flex items-center text-xs uppercase tracking-widest text-[var(--accent)] font-semibold transition-all duration-300 group-hover:translate-x-1.5 gap-2">
                            Explore Details <span className="text-base leading-none">→</span>
                          </span>
                        </div>
                      </div>
                    </Link>
                  </FadeUp>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Team */}
      {teamMembers.length > 0 && (
        <section className="section-padding relative overflow-hidden">
          {/* Subtle ambient light */}
          <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-[var(--accent)]/5 rounded-full filter blur-[120px] pointer-events-none" />
          <div className="container-main">
            <FadeUp>
              <h2 className="font-display text-4xl font-light text-center md:text-5xl mb-28">
                Meet The <span className="text-[var(--accent)]">Visionaries</span>
              </h2>
            </FadeUp>
            <div className="space-y-36">
              {teamMembers.map((member: { _id: string; name: string; designation: string; imageUrl: string }, index: number) => {
                const isEven = index % 2 === 0;
                
                return (
                  <div key={member._id} className={`flex flex-col lg:flex-row gap-16 lg:gap-24 items-center ${isEven ? 'lg:flex-row-reverse' : ''}`}>
                    {/* Text Column */}
                    <FadeUp delay={0.1} className="flex-1 space-y-8 text-center lg:text-left">
                      <div className="space-y-3">
                        <span className="text-xs uppercase tracking-[0.3em] text-[var(--accent)] font-semibold px-3.5 py-1.5 border border-[var(--accent)]/20 rounded-full bg-[var(--accent)]/5">
                          {member.designation}
                        </span>
                        <h3 className="font-display text-5xl md:text-6xl text-white tracking-wide">
                          {member.name}
                          <span className="text-[var(--accent)]">.</span>
                        </h3>
                      </div>
                      
                      <p className="text-lg leading-relaxed text-[var(--text-secondary)] font-light">
                        Bringing cinematic dreams to reality through an obsessive attention to detail and a passion for storytelling.
                      </p>
                    </FadeUp>

                    {/* Image Column */}
                    <FadeUp delay={0.3} className="w-full max-w-[340px] lg:max-w-[370px] perspective-1000 relative">
                      {/* Decorative Gold Frame Background */}
                      <div className="absolute -inset-4 rounded-[2rem] border border-[var(--accent)]/15 -rotate-2 scale-105 pointer-events-none z-0" />
                      
                      {/* Main Image Container */}
                      <div className="relative rounded-[2rem] overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.9)] border border-white/10 bg-neutral-900 w-full aspect-[3/4] z-10">
                        {member.imageUrl ? (
                          <Image
                            src={member.imageUrl}
                            alt={member.name}
                            fill
                            unoptimized={true}
                            className="object-cover object-top transition-transform duration-1000 hover:scale-105"
                            sizes="(max-width: 768px) 340px, 370px"
                            priority
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-t from-[#111] to-[#222]" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                      </div>
                    </FadeUp>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Reviews */}
      {reviews.length > 0 && (
        <section className="section-padding bg-[#1a1a1a]/50 backdrop-blur-md relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-20" />
          <div className="container-main">
            <FadeUp>
              <h2 className="font-display text-4xl font-light text-center md:text-5xl mb-20">
                Client <span className="text-[var(--accent)]">Love</span>
              </h2>
            </FadeUp>
            <StaggerContainer className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {reviews.map((review: { _id: string; clientName: string; rating: number; comment: string }) => (
                <StaggerItem key={review._id}>
                  <blockquote className="group h-full rounded-3xl border border-white/5 bg-gradient-to-b from-white/[0.03] to-transparent p-10 shadow-2xl backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-[var(--accent)]/30">
                    <p className="text-[var(--accent)] tracking-widest text-lg drop-shadow-[0_0_8px_rgba(201,168,76,0.5)]">
                      {"★".repeat(review.rating)}
                    </p>
                    <p className="mt-8 text-[var(--text-primary)] leading-relaxed italic text-lg opacity-90">
                      &ldquo;{review.comment}&rdquo;
                    </p>
                    <footer className="mt-10 flex items-center gap-5">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[var(--accent)]/20 to-transparent flex items-center justify-center text-[var(--accent)] font-display text-2xl border border-[var(--accent)]/20">
                        {review.clientName.charAt(0)}
                      </div>
                      <span className="text-sm font-medium tracking-wide uppercase">{review.clientName}</span>
                    </footer>
                  </blockquote>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>
      )}

      {/* Stats Section */}
      <section className="py-24 relative overflow-hidden bg-gradient-to-b from-transparent to-black/80 border-t border-white/5">
        <div className="absolute inset-0 opacity-5 mix-blend-overlay pointer-events-none" />
        <FadeUp className="container-main grid gap-12 md:grid-cols-3">
          <AnimatedCounter value={settings?.statsYearsExp ?? 10} label="Years Experience" suffix="+" />
          <AnimatedCounter value={settings?.statsProjectsDone ?? 250} label="Projects Done" suffix="+" />
          <AnimatedCounter value={settings?.statsHappyClients ?? 200} label="Happy Clients" suffix="+" />
        </FadeUp>
      </section>
    </>
  );
}
