import { getSettings } from "@/actions/settings.actions";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { defaultSettings } from "@/models/Settings";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await getSettings();

  return (
    <div>
      <h1 className="text-2xl font-semibold">General Settings</h1>
      <p className="mt-1 text-sm text-[var(--text-secondary)]">
        Manage your studio identity and website content
      </p>
      <div className="mt-8">
        <SettingsForm settings={settings ?? (defaultSettings as never)} />
      </div>
    </div>
  );
}
