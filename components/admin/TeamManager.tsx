"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { uploadToCloudinary } from "@/actions/upload.actions";
import { compressImage } from "@/lib/image-compress";
import { createTeamMember, updateTeamMember, deleteTeamMember, reorderTeam } from "@/actions/team.actions";

type TeamData = { _id: string; name: string; designation: string; imageUrl: string; position: string; visible: boolean; showOnHome?: boolean; order?: number; };

export function TeamManager({ initialTeam }: { initialTeam: TeamData[] }) {
  const [team, setTeam] = useState(initialTeam);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState<Partial<TeamData>>({});

  const handleEdit = (member: TeamData) => {
    setEditingId(member._id);
    setFormData(member);
  };

  const handleAddNew = () => {
    setEditingId("new");
    setFormData({ name: "", designation: "", imageUrl: "", position: "left", visible: true, showOnHome: true });
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({});
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);
    
    const file = e.target.files[0];
    try {
      const compressedFile = await compressImage(file);
      const data = new FormData();
      data.append("file", compressedFile);
      
      const res = await uploadToCloudinary(data, "team");
      if (res.success && res.url) {
        setFormData({ ...formData, imageUrl: res.url });
      } else {
        toast.error(`Failed to upload: ${res.error}`);
      }
    } catch (err) {
      console.error("Compression error:", err);
      // Fallback to original file
      const data = new FormData();
      data.append("file", file);
      const res = await uploadToCloudinary(data, "team");
      if (res.success && res.url) {
        setFormData({ ...formData, imageUrl: res.url });
      } else {
        toast.error(`Failed to upload: ${res.error}`);
      }
    }
    
    setUploading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);
    
    let result;
    if (editingId === "new") {
      result = await createTeamMember(formData);
      if (result.success) {
        setTeam([...team, { ...formData, _id: result.id, order: team.length } as TeamData]);
      }
    } else {
      result = await updateTeamMember(editingId!, formData);
      if (result.success) {
        setTeam(team.map(t => t._id === editingId ? { ...t, ...formData } as TeamData : t));
      }
    }
    
    setPending(false);
    if (result?.success) {
      toast.success("Team member saved");
      setEditingId(null);
    } else {
      toast.error("Failed to save team member");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this team member?")) return;
    setPending(true);
    const result = await deleteTeamMember(id);
    setPending(false);
    if (result.success) {
      setTeam(team.filter(t => t._id !== id));
      toast.success("Team member deleted");
    } else {
      toast.error("Failed to delete");
    }
  };

  const moveUp = async (index: number) => {
    if (index === 0) return;
    const newTeam = [...team];
    const temp = newTeam[index];
    newTeam[index] = newTeam[index - 1];
    newTeam[index - 1] = temp;
    setTeam(newTeam);
    await reorderTeam(newTeam.map(t => t._id));
  };

  const moveDown = async (index: number) => {
    if (index === team.length - 1) return;
    const newTeam = [...team];
    const temp = newTeam[index];
    newTeam[index] = newTeam[index + 1];
    newTeam[index + 1] = temp;
    setTeam(newTeam);
    await reorderTeam(newTeam.map(t => t._id));
  };

  if (editingId) {
    return (
      <form onSubmit={handleSave} className="space-y-6 bg-[var(--surface)] p-6 rounded-lg border border-[var(--border)]">
        <h2 className="text-xl font-medium">{editingId === "new" ? "Add Team Member" : "Edit Team Member"}</h2>
        
        <div className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="mt-1" />
          </div>
          <div>
            <Label>Designation / Role</Label>
            <Input required value={formData.designation} onChange={e => setFormData({...formData, designation: e.target.value})} className="mt-1" />
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Position (Left/Right)</Label>
              <select 
                value={formData.position || "left"} 
                onChange={e => setFormData({...formData, position: e.target.value})}
                className="mt-1 block w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm focus:border-[var(--accent)] focus:outline-none"
              >
                <option value="left">Left</option>
                <option value="right">Right</option>
              </select>
            </div>
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={formData.visible} onChange={e => setFormData({...formData, visible: e.target.checked})} className="rounded bg-transparent" />
                <span className="text-sm font-medium">Visible</span>
              </label>
            </div>
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={formData.showOnHome !== false} onChange={e => setFormData({...formData, showOnHome: e.target.checked})} className="rounded bg-transparent" />
                <span className="text-sm font-medium">Show on Homepage</span>
              </label>
            </div>
          </div>
          
          <div className="pt-4 border-t border-[var(--border)]">
            <Label>Profile Photo</Label>
            <div className="mt-2 flex items-start gap-4">
              {formData.imageUrl ? (
                <div className="relative w-32 h-32 rounded-md overflow-hidden bg-neutral-900">
                  <Image src={formData.imageUrl} alt="" fill className="object-cover" />
                </div>
              ) : (
                <div className="w-32 h-32 rounded-md border-2 border-dashed border-[var(--border)] flex items-center justify-center">
                  <span className="text-xs text-[var(--text-secondary)]">No Image</span>
                </div>
              )}
              <div className="flex-1">
                <Input type="file" accept="image/*" onChange={handleUpload} disabled={uploading} />
                <p className="mt-2 text-xs text-[var(--text-secondary)]">
                  {uploading ? "Uploading..." : "Select a new image to upload to Cloudinary."}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <Button type="submit" disabled={pending || uploading}>{pending ? "Saving..." : "Save"}</Button>
          <Button type="button" variant="outline" onClick={handleCancel}>Cancel</Button>
        </div>
      </form>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold">Team Members</h1>
        <Button onClick={handleAddNew}>Add Member</Button>
      </div>

      <div className="space-y-4">
        {team.map((member, index) => (
          <div key={member._id} className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                {member.imageUrl && (
                  <div className="w-12 h-12 relative rounded-full overflow-hidden">
                    <Image src={member.imageUrl} alt="" fill className="object-cover" />
                  </div>
                )}
                <div>
                  <h3 className="font-medium">{member.name}</h3>
                  <p className="mt-1 text-sm text-[var(--text-secondary)]">{member.designation}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="flex gap-2">
                  <Badge variant="default">{member.position || 'left'}</Badge>
                  <Badge variant={member.visible ? "success" : "default"}>{member.visible ? "Visible" : "Hidden"}</Badge>
                  <Badge variant={member.showOnHome !== false ? "success" : "default"}>
                    {member.showOnHome !== false ? "Home + About" : "About Only"}
                  </Badge>
                </div>
                <div className="flex gap-2 mt-2">
                  <Button size="sm" variant="outline" onClick={() => moveUp(index)} disabled={index === 0}>↑</Button>
                  <Button size="sm" variant="outline" onClick={() => moveDown(index)} disabled={index === team.length - 1}>↓</Button>
                  <Button size="sm" variant="outline" onClick={() => handleEdit(member)}>Edit</Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(member._id)}>Delete</Button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {team.length === 0 && <p className="text-[var(--text-secondary)]">No team members yet.</p>}
      </div>
    </div>
  );
}
