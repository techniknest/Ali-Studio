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
import {
  createPortfolioItem,
  updatePortfolioItem,
  deletePortfolioItem,
  reorderPortfolioItems,
} from "@/actions/portfolio.actions";

type PortfolioData = {
  _id: string;
  title: string;
  category: string;
  description?: string;
  images: string[];
  videoUrl?: string;
  featured: boolean;
  visible: boolean;
  order?: number;
};

const CATEGORIES = [
  "Wedding",
  "Event",
  "Commercial",
  "Portrait",
  "Drone",
  "Other",
];

export function PortfolioManager({ initialItems }: { initialItems: PortfolioData[] }) {
  const [items, setItems] = useState<PortfolioData[]>(initialItems);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState<Partial<PortfolioData>>({});

  const handleEdit = (item: PortfolioData) => {
    setEditingId(item._id);
    setFormData(item);
  };

  const handleAddNew = () => {
    setEditingId("new");
    setFormData({
      title: "",
      category: "Wedding",
      images: [],
      featured: false,
      visible: true,
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({});
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);

    const file = e.target.files[0];
    try {
      const compressedFile = await compressImage(file);
      const data = new FormData();
      data.append("file", compressedFile);

      const res = await uploadToCloudinary(data, "portfolio");
      if (res.success && res.url) {
        setFormData((prev) => ({
          ...prev,
          images: [...(prev.images || []), res.url!],
        }));
      } else {
        toast.error(`Failed to upload: ${res.error}`);
      }
    } catch (err) {
      console.error("Compression error:", err);
      // Fallback to original file
      const data = new FormData();
      data.append("file", file);
      const res = await uploadToCloudinary(data, "portfolio");
      if (res.success && res.url) {
        setFormData((prev) => ({
          ...prev,
          images: [...(prev.images || []), res.url!],
        }));
      } else {
        toast.error(`Failed to upload: ${res.error}`);
      }
    }

    setUploading(false);
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      images: (prev.images || []).filter((_, i) => i !== indexToRemove),
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);

    let result;
    if (editingId === "new") {
      result = await createPortfolioItem(formData);
      if (result.success) {
        setItems([...items, { ...formData, _id: result.id!, order: items.length } as PortfolioData]);
      }
    } else {
      result = await updatePortfolioItem(editingId!, formData);
      if (result.success) {
        setItems(items.map((t) => (t._id === editingId ? ({ ...t, ...formData } as PortfolioData) : t)));
      }
    }

    setPending(false);
    if (result?.success) {
      toast.success("Portfolio item saved");
      setEditingId(null);
    } else {
      toast.error(`Failed to save: ${result?.error}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    setPending(true);
    const result = await deletePortfolioItem(id);
    setPending(false);
    if (result.success) {
      setItems(items.filter((t) => t._id !== id));
      toast.success("Portfolio item deleted");
    } else {
      toast.error("Failed to delete");
    }
  };

  const moveUp = async (index: number) => {
    if (index === 0) return;
    const newItems = [...items];
    const temp = newItems[index];
    newItems[index] = newItems[index - 1];
    newItems[index - 1] = temp;
    setItems(newItems);
    await reorderPortfolioItems(newItems.map((t) => t._id));
  };

  const moveDown = async (index: number) => {
    if (index === items.length - 1) return;
    const newItems = [...items];
    const temp = newItems[index];
    newItems[index] = newItems[index + 1];
    newItems[index + 1] = temp;
    setItems(newItems);
    await reorderPortfolioItems(newItems.map((t) => t._id));
  };

  if (editingId) {
    return (
      <form onSubmit={handleSave} className="space-y-6 bg-[var(--surface)] p-6 rounded-lg border border-[var(--border)]">
        <h2 className="text-xl font-medium">{editingId === "new" ? "Add Portfolio Item" : "Edit Portfolio Item"}</h2>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Title</Label>
              <Input
                required
                value={formData.title || ""}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Category</Label>
              <select
                value={formData.category || "Wedding"}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="mt-1 block w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm focus:border-[var(--accent)] focus:outline-none"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <Label>Description (Optional)</Label>
            <textarea
              value={formData.description || ""}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="mt-1 block w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm focus:border-[var(--accent)] focus:outline-none min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured || false}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="rounded bg-transparent"
              />
              <Label htmlFor="featured" className="cursor-pointer">Featured (Show on Homepage)</Label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="visible"
                checked={formData.visible !== false}
                onChange={(e) => setFormData({ ...formData, visible: e.target.checked })}
                className="rounded bg-transparent"
              />
              <Label htmlFor="visible" className="cursor-pointer">Visible</Label>
            </div>
          </div>

          <div className="pt-4 border-t border-[var(--border)]">
            <Label>Images</Label>
            <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {formData.images?.map((url, i) => (
                <div key={i} className="relative aspect-[4/3] rounded-md overflow-hidden bg-neutral-900 group">
                  <Image src={url} alt="" fill className="object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button type="button" variant="destructive" size="sm" onClick={() => handleRemoveImage(i)}>
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
              <div className="relative aspect-[4/3] rounded-md border-2 border-dashed border-[var(--border)] flex flex-col items-center justify-center text-[var(--text-secondary)] hover:border-[var(--accent)] transition-colors cursor-pointer">
                <span className="text-2xl mb-1">+</span>
                <span className="text-xs">Upload</span>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </div>
            {uploading && <p className="mt-2 text-xs text-[var(--accent)]">Uploading image...</p>}
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <Button type="submit" disabled={pending || uploading}>
            {pending ? "Saving..." : "Save"}
          </Button>
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      </form>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold">Portfolio Items</h1>
        <Button onClick={handleAddNew}>Add Item</Button>
      </div>

      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={item._id} className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                {item.images && item.images.length > 0 ? (
                  <div className="w-16 h-12 relative rounded overflow-hidden">
                    <Image src={item.images[0]} alt="" fill className="object-cover" />
                  </div>
                ) : (
                  <div className="w-16 h-12 rounded bg-neutral-800 flex items-center justify-center text-xs text-[var(--text-secondary)]">
                    No Img
                  </div>
                )}
                <div>
                  <h3 className="font-medium">{item.title}</h3>
                  <p className="mt-1 text-sm text-[var(--text-secondary)]">{item.category}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="flex gap-2">
                  <Badge variant={item.featured ? "success" : "default"}>
                    {item.featured ? "Featured" : "Standard"}
                  </Badge>
                  <Badge variant={item.visible ? "success" : "default"}>
                    {item.visible ? "Visible" : "Hidden"}
                  </Badge>
                </div>
                <div className="flex gap-2 mt-2">
                  <Button size="sm" variant="outline" onClick={() => moveUp(index)} disabled={index === 0}>
                    ↑
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => moveDown(index)}
                    disabled={index === items.length - 1}
                  >
                    ↓
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleEdit(item)}>
                    Edit
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(item._id)}>
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-[var(--text-secondary)]">No portfolio items yet.</p>}
      </div>
    </div>
  );
}
