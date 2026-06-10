import Image from "next/image";
import { getSettings } from "@/actions/settings.actions";
import { getTeam } from "@/actions/team.actions";
import { FadeUp, StaggerContainer, StaggerItem } from "@/components/public/Animations";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About | Ali Studio",
  description: "Learn about Ali Studio and our cinematic philosophy.",
};


export default async function AboutPage() {
  const settings = await getSettings();
  const teamMembers = await getTeam(true); // Fetch visible team members

  const aboutText = settings?.aboutText || "";

  const aboutImageUrl = settings?.philosophyImageUrl;

  return (
    <div className="pt-24 min-h-screen bg-[#080808]">
      {/* Hero Header */}
      <section className="section-padding bg-[#111111]/30 backdrop-blur-md border-b border-white/5 relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[var(--accent)]/5 rounded-full filter blur-[100px] pointer-events-none" />
        
        <StaggerContainer className="container-main text-center relative z-10">
          <StaggerItem>
            <h1 className="font-display text-5xl font-light md:text-6xl">
              About <span className="text-[var(--accent)]">Us</span>
            </h1>
          </StaggerItem>
          <StaggerItem>
            <p className="mx-auto mt-4 max-w-xl text-[var(--text-secondary)]">
              Discover the creative vision and team behind our cinematic stories.
            </p>
          </StaggerItem>
        </StaggerContainer>
      </section>

      {/* Main Philosophy Section */}
      <section className="section-padding relative">
        <div className="container-main grid gap-16 lg:grid-cols-12 items-center">
          {/* Image Side */}
          {aboutImageUrl ? (
            <FadeUp delay={0.2} className="lg:col-span-5 relative w-full max-w-[420px] mx-auto lg:max-w-none aspect-[4/5] rounded-[2rem] overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] border border-[var(--accent)]/10 group z-10">
              {/* Decorative Offset Gold Frame */}
              <div className="absolute -inset-4 rounded-[2rem] border border-[var(--accent)]/15 -rotate-2 scale-105 pointer-events-none z-0" />
              
              <div className="relative w-full h-full rounded-[2rem] overflow-hidden bg-neutral-900 z-10">
                <Image
                  src={aboutImageUrl!}
                  alt="About Ali Studio"
                  fill
                  unoptimized={true}
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              </div>
            </FadeUp>
          ) : (
            <FadeUp delay={0.2} className="lg:col-span-5 aspect-[4/5] w-full rounded-[2rem] bg-gradient-to-tr from-[#111] to-[#222]">
              <div />
            </FadeUp>
          )}

          {/* Text Side */}
          <FadeUp delay={0.3} className="lg:col-span-7 space-y-8 lg:pl-8 text-center lg:text-left">
            <div className="space-y-4">
              <span className="text-[10px] uppercase tracking-widest text-[var(--accent)] font-semibold px-3 py-1 border border-[var(--accent)]/20 rounded-full bg-[var(--accent)]/5">
                Our Story
              </span>
              <h2 className="font-display text-4xl font-light md:text-5xl text-white">
                The Art of <span className="text-[var(--accent)]">Cinematography</span>
              </h2>
            </div>

            <div className="space-y-6 text-lg leading-relaxed text-[var(--text-secondary)] font-light">
              {aboutText.split('\n').map((para, i) => para.trim() && (
                <p key={i}>{para}</p>
              ))}
            </div>

            {/* Custom Highlights */}
            <div className="grid grid-cols-2 gap-6 pt-6 border-t border-white/5 text-left">
              <div className="space-y-2">
                <h4 className="text-white font-medium text-sm uppercase tracking-wider flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" /> Established 2015
                </h4>
                <p className="text-xs text-[var(--text-secondary)]/80 leading-relaxed font-light">
                  A decade of capturing timeless emotions and elegant frames.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="text-white font-medium text-sm uppercase tracking-wider flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" /> Premium Quality
                </h4>
                <p className="text-xs text-[var(--text-secondary)]/80 leading-relaxed font-light">
                  Equipped with cinema-grade tech and bespoke light setups.
                </p>
              </div>
            </div>

            <div className="pt-4 flex justify-center lg:justify-start">
              
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Team Section */}
      <section className="section-padding border-t border-white/5 bg-[#111111]/20">
        <div className="container-main">
          <FadeUp className="text-center mb-20 space-y-4">
            <span className="text-[10px] uppercase tracking-widest text-[var(--accent)] font-semibold px-3 py-1 border border-[var(--accent)]/20 rounded-full bg-[var(--accent)]/5">
              The Visionaries
            </span>
            <h2 className="font-display text-4xl font-light md:text-5xl text-white">
              Meet Our <span className="text-[var(--accent)]">Creative Team</span>
            </h2>
            <p className="mx-auto max-w-lg text-[var(--text-secondary)] font-light">
              The skilled professionals capturing your timeless memories frame by frame.
            </p>
          </FadeUp>

          {teamMembers.length > 0 ? (
            <div className="flex flex-wrap justify-center gap-16 max-w-6xl mx-auto">
              {teamMembers.map((member: { _id: string; name: string; designation: string; imageUrl: string }, index: number) => (
                <FadeUp 
                  key={member._id} 
                  delay={0.1 * index}
                  className="w-full max-w-[310px] flex flex-col items-center group relative z-10"
                >
                  {/* Decorative Gold Border Frame */}
                  <div className="absolute -inset-3.5 rounded-[2.2rem] border border-[var(--accent)]/10 group-hover:border-[var(--accent)]/30 transition-all duration-700 -rotate-3 group-hover:rotate-2 scale-102 pointer-events-none z-0" />
                  
                  {/* Card Container */}
                  <div className="relative w-full aspect-[3/4] rounded-[2rem] overflow-hidden bg-neutral-900 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] z-10 transition-transform duration-700 group-hover:-translate-y-2">
                    {member.imageUrl ? (
                      <Image
                        src={member.imageUrl}
                        alt={member.name}
                        fill
                        unoptimized={true}
                        className="object-cover object-top transition-transform duration-1000 group-hover:scale-110"
                        sizes="310px"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-t from-[#111] to-[#222]" />
                    )}
                    
                    {/* Premium Glassmorphic Text Card Overlay */}
                    <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black via-black/85 to-transparent pt-16 translate-y-2 group-hover:translate-y-0 transition-transform duration-500 flex flex-col justify-end">
                      <span className="text-[9px] uppercase tracking-[0.25em] text-[var(--accent)] font-semibold mb-1">
                        {member.designation}
                      </span>
                      <h3 className="font-display text-3xl text-white font-light tracking-wide leading-tight">
                        {member.name}
                      </h3>
                      
                      {/* Decorative Gold Accent Line */}
                      <div className="w-0 group-hover:w-12 h-px bg-[var(--accent)] mt-3 transition-all duration-500 ease-out" />
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>
          ) : (
            <p className="text-center text-[var(--text-secondary)] italic">
              Our team members are being curated. Coming soon.
            </p>
          )}
        </div>
      </section>

      {/* Engineering Footer Section */}
      <section className="py-12 border-t border-white/5 bg-black/40">
        <div className="container-main text-center text-xs text-[var(--text-secondary)]">
          <p>
            This digital platform was engineered by{" "}
            <a
              href="https://techniknest.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--accent)] hover:underline font-semibold"
            >
              TechnikNest Pvt Ltd
            </a>
            , a software development company dedicated to building modern digital experiences.
          </p>
        </div>
      </section>
    </div>
  );
}
