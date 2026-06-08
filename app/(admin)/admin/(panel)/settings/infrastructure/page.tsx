import { getMaskedConfigs } from "@/lib/config";
import { getInfrastructureStatus } from "@/actions/config.actions";
import { InfrastructureSettings } from "@/components/admin/InfrastructureSettings";

export const dynamic = "force-dynamic";

export default async function InfrastructurePage() {
  const masked = await getMaskedConfigs();
  const status = await getInfrastructureStatus();

  return (
    <div>
      <h1 className="text-2xl font-semibold">Infrastructure Settings</h1>
      <p className="mt-1 text-sm text-[var(--text-secondary)]">
        Manage API keys and connection strings
      </p>
      <div className="mt-8">
        <InfrastructureSettings masked={masked} status={status} />
      </div>
    </div>
  );
}
