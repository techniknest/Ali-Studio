import { getPortfolioItems } from "@/actions/portfolio.actions";
import { PortfolioGrid } from "@/components/public/PortfolioGrid";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfolio | Ali Studio",
  description: "Explore our wedding films, events, and creative productions.",
};

export default async function PortfolioPage() {
  const { items } = await getPortfolioItems({ visibleOnly: true, limit: 100 });

  return (
    <div className="pt-24 section-padding">
      <div className="container-main">
        <h1 className="font-display text-5xl font-light md:text-6xl">
          Our <span className="text-[var(--accent)]">Portfolio</span>
        </h1>
        <p className="mt-4 max-w-xl text-[var(--text-secondary)]">
          A curated collection of cinematic stories we have brought to life.
        </p>

        <div className="mt-16">
          <PortfolioGrid items={items} />
        </div>

        {items.length === 0 && (
          <p className="mt-12 text-center text-[var(--text-secondary)]">
            Portfolio coming soon.
          </p>
        )}
      </div>
    </div>
  );
}
