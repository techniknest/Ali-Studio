import { getTeam } from "@/actions/team.actions";
import { TeamManager } from "@/components/admin/TeamManager";

export const dynamic = "force-dynamic";

export default async function AdminTeamPage() {
  const team = await getTeam();

  return (
    <div className="max-w-4xl">
      <TeamManager initialTeam={team} />
    </div>
  );
}
