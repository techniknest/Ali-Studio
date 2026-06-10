"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { uploadToCloudinary } from "@/actions/upload.actions";
import { createService, updateService, deleteService, reorderServices } from "@/actions/services.actions";
import { compressImage } from "@/lib/image-compress";

type ServiceData = { _id: string; title: string; shortDescription: string; priceRange: string; visible: boolean; images: string[]; order?: number; longDescription?: string; };

export function ServicesManager({ initialServices }: { initialServices: ServiceData[] }) {
  const [services, setServices] = useState(initialServices);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState<Partial<ServiceData>>({});

  const handleEdit = (service: ServiceData) => {
    setEditingId(service._id);
    setFormData(service);
  };

  const handleAddNew = () => {
    setEditingId("new");
    setFormData({ title: "", shortDescription: "", longDescription: "", priceRange: "", images: [], visible: true });
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({});
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);
    
    const newImages = [...(formData.images || [])];
    
    for (const file of Array.from(e.target.files)) {
      try {
        const compressedFile = await compressImage(file);
        const data = new FormData();
        data.append("file", compressedFile);
        const res = await uploadToCloudinary(data, "services");
        if (res.success && res.url) {
          newImages.push(res.url);
        } else {
          toast.error(`Failed to upload ${file.name}: ${res.error}`);
        }
      } catch (err) {
        console.error("Compression error:", err);
        // Fallback to original file
        const data = new FormData();
        data.append("file", file);
        const res = await uploadToCloudinary(data, "services");
        if (res.success && res.url) {
          newImages.push(res.url);
        } else {
          toast.error(`Failed to upload ${file.name}: ${res.error}`);
        }
      }
    }
    
    setFormData({ ...formData, images: newImages });
    setUploading(false);
  };

  const removeImage = (index: number) => {
    const newImages = [...(formData.images || [])];
    newImages.splice(index, 1);
    setFormData({ ...formData, images: newImages });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);
    
    let result;
    if (editingId === "new") {
      result = await createService(formData);
      if (result.success) {
        setServices([...services, { ...formData, _id: result.id, order: services.length } as ServiceData]);
      }
    } else {
      result = await updateService(editingId!, formData);
      if (result.success) {
        setServices(services.map(s => s._id === editingId ? { ...s, ...formData } as ServiceData : s));
      }
    }
    
    setPending(false);
    if (result?.success) {
      toast.success("Service saved");
      setEditingId(null);
    } else {
      toast.error(result?.error || "Failed to save service");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    setPending(true);
    const result = await deleteService(id);
    setPending(false);
    if (result.success) {
      setServices(services.filter(s => s._id !== id));
      toast.success("Service deleted");
    } else {
      toast.error("Failed to delete");
    }
  };

  const moveUp = async (index: number) => {
    if (index === 0) return;
    const newServices = [...services];
    const temp = newServices[index];
    newServices[index] = newServices[index - 1];
    newServices[index - 1] = temp;
    setServices(newServices);
    await reorderServices(newServices.map(s => s._id));
  };

  const moveDown = async (index: number) => {
    if (index === services.length - 1) return;
    const newServices = [...services];
    const temp = newServices[index];
    newServices[index] = newServices[index + 1];
    newServices[index + 1] = temp;
    setServices(newServices);
    await reorderServices(newServices.map(s => s._id));
  };

  if (editingId) {
    return (
      <form onSubmit={handleSave} className="space-y-6 bg-[var(--surface)] p-6 rounded-lg border border-[var(--border)]">
        <h2 className="text-xl font-medium">{editingId === "new" ? "Add Service" : "Edit Service"}</h2>
        
        <div className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="mt-1" />
          </div>
          <div>
            <Label>Short Description</Label>
            <Textarea value={formData.shortDescription} onChange={e => setFormData({...formData, shortDescription: e.target.value})} className="mt-1" />
          </div>
          <div>
            <Label>Price Range</Label>
            <Input value={formData.priceRange || ""} onChange={e => setFormData({...formData, priceRange: e.target.value})} className="mt-1" />
          </div>
          <div className="flex items-center gap-2 mt-4">
            <input type="checkbox" id="visible" checked={formData.visible} onChange={e => setFormData({...formData, visible: e.target.checked})} className="rounded bg-transparent" />
            <Label htmlFor="visible">Visible</Label>
          </div>
          
          <div className="pt-4 border-t border-[var(--border)]">
            <Label>Images</Label>
            <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4">
              {(formData.images || []).map((img: string, idx: number) => (
                <div key={idx} className="relative aspect-square rounded-md overflow-hidden bg-neutral-900 group">
                  <Image src={img} alt="" fill className="object-cover" />
                  <button type="button" onClick={() => removeImage(idx)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                </div>
              ))}
              <div className="aspect-square rounded-md border-2 border-dashed border-[var(--border)] flex items-center justify-center relative hover:bg-white/5 transition-colors">
                <input type="file" multiple accept="image/*" onChange={handleUpload} disabled={uploading} className="absolute inset-0 opacity-0 cursor-pointer" />
                <span className="text-sm text-[var(--text-secondary)]">{uploading ? "Uploading..." : "+ Add Images"}</span>
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
        <h1 className="text-2xl font-semibold">Services</h1>
        <Button onClick={handleAddNew}>Add Service</Button>
      </div>

      <div className="space-y-4">
        {services.map((service, index) => (
          <div key={service._id} className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium">{service.title}</h3>
                <p className="mt-1 text-sm text-[var(--text-secondary)]">{service.shortDescription}</p>
                {service.images && service.images.length > 0 && (
                  <p className="mt-2 text-xs text-[var(--accent)]">{service.images.length} image(s)</p>
                )}
              </div>
              <div className="flex flex-col items-end gap-2">
                <Badge variant={service.visible ? "success" : "default"}>{service.visible ? "Visible" : "Hidden"}</Badge>
                <div className="flex gap-2 mt-2">
                  <Button size="sm" variant="outline" onClick={() => moveUp(index)} disabled={index === 0}>↑</Button>
                  <Button size="sm" variant="outline" onClick={() => moveDown(index)} disabled={index === services.length - 1}>↓</Button>
                  <Button size="sm" variant="outline" onClick={() => handleEdit(service)}>Edit</Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(service._id)}>Delete</Button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {services.length === 0 && <p className="text-[var(--text-secondary)]">No services yet.</p>}
      </div>
    </div>
  );
}
