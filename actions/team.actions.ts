"use server";

import { connectDB } from "@/lib/mongodb";
import Team from "@/models/Team";

export async function getTeam(visibleOnly = false) {
  try {
    await connectDB();
    const query = visibleOnly ? { visible: true } : {};
    const team = await Team.find(query).sort({ order: 1 }).lean();
    return JSON.parse(JSON.stringify(team));
  } catch {
    return [];
  }
}

export async function createTeamMember(data: any) {
  await connectDB();
  const count = await Team.countDocuments();
  const item = await Team.create({ ...data, order: count });
  return { success: true, id: item._id.toString() };
}

export async function updateTeamMember(id: string, data: any) {
  await connectDB();
  await Team.findByIdAndUpdate(id, data);
  return { success: true };
}

export async function deleteTeamMember(id: string) {
  await connectDB();
  await Team.findByIdAndDelete(id);
  return { success: true };
}

export async function reorderTeam(ids: string[]) {
  await connectDB();
  await Promise.all(
    ids.map((id, index) => Team.findByIdAndUpdate(id, { order: index }))
  );
  return { success: true };
}
