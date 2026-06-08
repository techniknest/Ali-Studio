"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema } from "@/lib/validators/content";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

type FormData = z.infer<typeof contactSchema>;

export function ContactForm({
  submitAction,
  services = [],
  defaultService = "",
}: {
  submitAction?: (data: FormData) => Promise<{ success: boolean; error?: string }>;
  services?: { _id: string; title: string }[];
  defaultService?: string;
}) {
  const [pending, setPending] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      services: defaultService ? [defaultService] : [],
    },
  });

  const selectedServices = watch("services");
  const currentService = selectedServices && selectedServices.length > 0 ? selectedServices[0] : "";

  const onSubmit = async (data: FormData) => {
    setPending(true);
    if (!submitAction) {
       const res = await fetch("/api/bookings", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify(data),
       });
       const result = await res.json();
       setPending(false);
       if (result.success) {
         toast.success("Message sent! We'll get back to you soon.");
         reset();
       } else {
         toast.error(result.error ?? "Failed to send message");
       }
       return;
    }
    const result = await submitAction(data);
    setPending(false);
    if (result.success) {
      toast.success("Message sent! We'll get back to you soon.");
      reset();
    } else {
      toast.error(result.error ?? "Failed to send message");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative z-10">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-[var(--text-secondary)] font-light tracking-wide">Name</Label>
          <Input id="name" {...register("name")} className="bg-black/30 border-white/10 text-white h-12 focus:border-[var(--accent)]/50 focus:ring-[var(--accent)]/20" placeholder="Ali" />
          {errors.name && <p className="text-xs text-[var(--danger)]">{errors.name.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-[var(--text-secondary)] font-light tracking-wide">Email</Label>
          <Input id="email" type="email" {...register("email")} className="bg-black/30 border-white/10 text-white h-12 focus:border-[var(--accent)]/50 focus:ring-[var(--accent)]/20" placeholder="abc@example.com" />
          {errors.email && <p className="text-xs text-[var(--danger)]">{errors.email.message}</p>}
        </div>
      </div>
      
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-[var(--text-secondary)] font-light tracking-wide">Phone</Label>
          <Input id="phone" {...register("phone")} className="bg-black/30 border-white/10 text-white h-12 focus:border-[var(--accent)]/50 focus:ring-[var(--accent)]/20" placeholder="+92 300 1234567" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="date" className="text-[var(--text-secondary)] font-light tracking-wide">Event Date</Label>
          <Input id="date" type="date" {...register("date")} className="bg-black/30 border-white/10 text-white h-12 focus:border-[var(--accent)]/50 focus:ring-[var(--accent)]/20 [color-scheme:dark]" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="services" className="text-[var(--text-secondary)] font-light tracking-wide">Service Required</Label>
        <div className="relative">
          <select
            id="services"
            value={currentService}
            onChange={(e) => setValue("services", e.target.value ? [e.target.value] : [])}
            className="flex h-12 w-full rounded-md border border-white/10 bg-black/30 px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)]/50 appearance-none"
          >
            <option value="" className="bg-[#111]">Select a service...</option>
            {services.map((service) => (
              <option key={service._id} value={service.title} className="bg-[#111]">
                {service.title}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
            <svg className="h-4 w-4 text-[var(--text-secondary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message" className="text-[var(--text-secondary)] font-light tracking-wide">Message</Label>
        <Textarea id="message" {...register("message")} className="bg-black/30 border-white/10 text-white min-h-[150px] focus:border-[var(--accent)]/50 focus:ring-[var(--accent)]/20 resize-y p-4" placeholder="Tell us about your cinematic vision..." />
        {errors.message && <p className="text-xs text-[var(--danger)]">{errors.message.message}</p>}
      </div>
      
      <Button 
        type="submit" 
        disabled={pending} 
        className="w-full h-14 bg-[var(--accent)] text-black hover:bg-white uppercase tracking-widest font-semibold transition-all duration-300"
      >
        {pending ? "Sending Message..." : "Send Message"}
      </Button>
    </form>
  );
}
