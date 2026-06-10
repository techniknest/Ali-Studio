"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateSettings } from "@/actions/settings.actions";
import { uploadToCloudinary } from "@/actions/upload.actions";
import type { ISettings } from "@/models/Settings";
import { toast } from "sonner";

export function SettingsForm({ settings }: { settings: ISettings }) {
  const [pending, setPending] = useState(false);
  const [uploadingState, setUploadingState] = useState<Record<string, boolean>>({});
  const { register, handleSubmit, setValue } = useForm<Partial<ISettings>>({
    defaultValues: settings,
  });

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: keyof ISettings) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingState((prev) => ({ ...prev, [fieldName]: true }));
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await uploadToCloudinary(formData, "settings");
      if (res.success && res.url) {
        setValue(fieldName, res.url);
        toast.success("File uploaded successfully");
      } else {
        toast.error(`Upload failed: ${res.error}`);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      toast.error(`Upload failed: ${errorMessage}`);
    } finally {
      setUploadingState((prev) => ({ ...prev, [fieldName]: false }));
    }
  };

  const onSubmit = async (data: Partial<ISettings>) => {
    setPending(true);
    const result = await updateSettings(data);
    setPending(false);
    if (result.success) toast.success("Settings saved");
    else toast.error(result.error ?? "Failed to save");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-8">
      <section className="space-y-4">
        <h2 className="text-lg font-medium text-[var(--accent)]">Studio Identity</h2>
        <div>
          <Label>Studio Name</Label>
          <Input {...register("studioName")} className="mt-1" />
        </div>
        <div>
          <Label>Tagline</Label>
          <Input {...register("tagline")} className="mt-1" />
        </div>
        <div>
          <Label>Logo URL</Label>
          <div className="flex gap-2 items-center mt-1">
            <Input {...register("logoUrl")} className="flex-1" />
            <div className="relative">
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => handleUpload(e, "logoUrl")}
                disabled={uploadingState["logoUrl"]}
                className="absolute inset-0 opacity-0 cursor-pointer w-full"
              />
              <Button type="button" variant="outline" disabled={uploadingState["logoUrl"]}>
                {uploadingState["logoUrl"] ? "Uploading..." : "Upload Logo"}
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-medium text-[var(--accent)]">Hero Section</h2>
        <div>
          <Label>Headline</Label>
          <Input {...register("heroHeadline")} className="mt-1" />
        </div>
        <div>
          <Label>Subheadline</Label>
          <Input {...register("heroSubheadline")} className="mt-1" />
        </div>
        <div>
          <Label>Hero Video URL</Label>
          <div className="flex gap-2 items-center mt-1">
            <Input {...register("heroVideoUrl")} className="flex-1" />
            <div className="relative">
              <Input
                type="file"
                accept="video/*"
                onChange={(e) => handleUpload(e, "heroVideoUrl")}
                disabled={uploadingState["heroVideoUrl"]}
                className="absolute inset-0 opacity-0 cursor-pointer w-full"
              />
              <Button type="button" variant="outline" disabled={uploadingState["heroVideoUrl"]}>
                {uploadingState["heroVideoUrl"] ? "Uploading..." : "Upload Video"}
              </Button>
            </div>
          </div>
        </div>
        <div>
          <Label>Hero Background Image</Label>
          <div className="flex gap-2 items-center mt-1">
            <Input {...register("heroImageUrl")} className="flex-1" placeholder="Upload or enter image URL..." />
            <div className="relative">
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => handleUpload(e, "heroImageUrl")}
                disabled={uploadingState["heroImageUrl"]}
                className="absolute inset-0 opacity-0 cursor-pointer w-full"
              />
              <Button type="button" variant="outline" disabled={uploadingState["heroImageUrl"]}>
                {uploadingState["heroImageUrl"] ? "Uploading..." : "Upload Image"}
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-medium text-[var(--accent)]">Stats</h2>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label>Years Experience</Label>
            <Input type="number" {...register("statsYearsExp")} className="mt-1" />
          </div>
          <div>
            <Label>Projects Done</Label>
            <Input type="number" {...register("statsProjectsDone")} className="mt-1" />
          </div>
          <div>
            <Label>Happy Clients</Label>
            <Input type="number" {...register("statsHappyClients")} className="mt-1" />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-medium text-[var(--accent)]">Contact & Social</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Phone</Label>
            <Input {...register("phone")} className="mt-1" />
          </div>
          <div>
            <Label>WhatsApp</Label>
            <Input {...register("whatsappNumber")} className="mt-1" />
          </div>
          <div>
            <Label>Email</Label>
            <Input {...register("email")} className="mt-1" />
          </div>
          <div>
            <Label>Address</Label>
            <Input {...register("address")} className="mt-1" />
          </div>
        </div>
        <div>
          <Label>Maps Embed URL</Label>
          <Input {...register("mapsEmbedUrl")} className="mt-1" />
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <Label>Instagram URL</Label>
            <Input {...register("instagram")} className="mt-1" />
          </div>
          <div>
            <Label>Facebook URL</Label>
            <Input {...register("facebook")} className="mt-1" />
          </div>
          <div>
            <Label>TikTok URL</Label>
            <Input {...register("tiktok")} className="mt-1" />
          </div>
          <div>
            <Label>YouTube URL</Label>
            <Input {...register("youtube")} className="mt-1" />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-medium text-[var(--accent)]">About & SEO</h2>
        <div>
          <Label>About Text</Label>
          <Textarea {...register("aboutText")} className="mt-1" rows={5} />
        </div>
        <div>
          <Label>About Image (Art of Storytelling)</Label>
          <div className="flex gap-2 items-center mt-1">
            <Input {...register("aboutImageUrl")} className="flex-1" placeholder="Upload or enter image URL..." />
            <div className="relative">
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => handleUpload(e, "aboutImageUrl")}
                disabled={uploadingState["aboutImageUrl"]}
                className="absolute inset-0 opacity-0 cursor-pointer w-full"
              />
              <Button type="button" variant="outline" disabled={uploadingState["aboutImageUrl"]}>
                {uploadingState["aboutImageUrl"] ? "Uploading..." : "Upload Image"}
              </Button>
            </div>
          </div>
        </div>
        <div>
          <Label>Philosophy Image (Art of Cinematography)</Label>
          <div className="flex gap-2 items-center mt-1">
            <Input {...register("philosophyImageUrl")} className="flex-1" placeholder="Upload or enter image URL..." />
            <div className="relative">
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => handleUpload(e, "philosophyImageUrl")}
                disabled={uploadingState["philosophyImageUrl"]}
                className="absolute inset-0 opacity-0 cursor-pointer w-full"
              />
              <Button type="button" variant="outline" disabled={uploadingState["philosophyImageUrl"]}>
                {uploadingState["philosophyImageUrl"] ? "Uploading..." : "Upload Image"}
              </Button>
            </div>
          </div>
        </div>
        <div>
          <Label>Meta Title</Label>
          <Input {...register("metaTitle")} className="mt-1" />
        </div>
        <div>
          <Label>Meta Description</Label>
          <Textarea {...register("metaDescription")} className="mt-1" rows={2} />
        </div>
        <div>
          <Label>Accent Color</Label>
          <Input type="color" {...register("accentColor")} className="mt-1 h-10 w-20" />
        </div>
      </section>

      <Button type="submit" disabled={pending}>
        {pending ? "Saving..." : "Save Settings"}
      </Button>
    </form>
  );
}
