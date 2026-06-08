import { Sidebar } from "@/components/admin/Sidebar";
import { getUnreadCount } from "@/actions/messages.actions";
import { checkSetupRequired } from "@/actions/config.actions";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const setup = await checkSetupRequired();
  if (setup.required) {
    redirect("/admin/setup");
  }

  let unreadCount = 0;
  try {
    unreadCount = await getUnreadCount();
  } catch {
    // not connected yet
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[var(--background)] overflow-hidden">
      <Sidebar unreadCount={unreadCount} />
      <div className="flex-1 overflow-auto w-full md:w-auto h-screen">
        <div className="p-4 md:p-8 pb-20 md:pb-8">{children}</div>
      </div>
    </div>
  );
}
