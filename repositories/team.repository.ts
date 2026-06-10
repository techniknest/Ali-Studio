import { connectDB } from "@/lib/mongodb";
import Team, { ITeam } from "@/models/Team";

export class TeamRepository {
  async findAll(visibleOnly = false, homeOnly = false): Promise<ITeam[]> {
    await connectDB();
    const query: any = {};
    if (visibleOnly) {
      query.visible = true;
    }
    if (homeOnly) {
      query.showOnHome = true;
    }
    const team = await Team.find(query).sort({ order: 1 }).lean();
    return JSON.parse(JSON.stringify(team));
  }

  async count(): Promise<number> {
    await connectDB();
    return Team.countDocuments();
  }

  async create(data: Partial<ITeam>): Promise<ITeam> {
    await connectDB();
    const item = await Team.create(data);
    return JSON.parse(JSON.stringify(item));
  }

  async update(id: string, data: Partial<ITeam>): Promise<ITeam | null> {
    await connectDB();
    const item = await Team.findByIdAndUpdate(id, data, { new: true }).lean();
    return item ? JSON.parse(JSON.stringify(item)) : null;
  }

  async delete(id: string): Promise<boolean> {
    await connectDB();
    const result = await Team.findByIdAndDelete(id);
    return result !== null;
  }
}

// Export a singleton instance for convenience
export const teamRepository = new TeamRepository();
