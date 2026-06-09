import { getPortfolioItems } from "@/actions/portfolio.actions";
import { PortfolioManager } from "@/components/admin/PortfolioManager";

export const dynamic = "force-dynamic";

export default async function AdminPortfolioPage() {
  const { items } = await getPortfolioItems({ limit: 100 });

  return <PortfolioManager initialItems={items} />;
}
