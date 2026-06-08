"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateSettings } from "@/actions/settings.actions";
import type { ISettings } from "@/models/Settings";
import { toast } from "sonner";

export function SettingsForm({ settings }: { settings: ISettings }) {
  const [pending, setPending] = useState(false);
  const { register, handleSubmit } = useForm<Partial<ISettings>>({
    defaultValues: settings,
  });

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
          <Input {...register("logoUrl")} className="mt-1" />
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
          <Input {...register("heroVideoUrl")} className="mt-1" />
        </div>
        <div>
          <Label>Hero Image URL (fallback)</Label>
          <Input {...register("heroImageUrl")} className="mt-1" />
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
        <h2 className="text-lg font-medium text-[var(--accent)]">Contact</h2>
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
        <div>
          <Label>Maps Embed URL</Label>
          <Input {...register("mapsEmbedUrl")} className="mt-1" />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-medium text-[var(--accent)]">About & SEO</h2>
        <div>
          <Label>About Text</Label>
          <Textarea {...register("aboutText")} className="mt-1" rows={5} />
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
