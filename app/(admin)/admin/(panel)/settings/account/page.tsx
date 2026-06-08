import { auth } from "@/lib/auth";
import { AccountSettings } from "@/components/admin/AccountSettings";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const session = await auth();

  return (
    <div>
      <h1 className="text-2xl font-semibold">Account Settings</h1>
      <p className="mt-1 text-sm text-[var(--text-secondary)]">
        Update your admin email and password
      </p>
      <div className="mt-8">
        <AccountSettings currentEmail={session?.user?.email ?? ""} />
      </div>
    </div>
  );
}
