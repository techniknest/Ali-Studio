"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { publicReviewSchema } from "@/lib/validators/content";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Star, X } from "lucide-react";

type FormData = z.infer<typeof publicReviewSchema>;

export function ReviewForm({
  submitAction,
}: {
  submitAction: (data: FormData) => Promise<{ success: boolean; error?: string }>;
}) {
  const [pending, setPending] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(publicReviewSchema),
    defaultValues: { rating: 5 },
  });

  const rating = watch("rating");

  const onSubmit = async (data: FormData) => {
    setPending(true);
    const result = await submitAction(data);
    setPending(false);
    if (result.success) {
      toast.success("Thank you! Your review has been published.");
      reset();
      setIsOpen(false);
    } else {
      toast.error(result.error ?? "Failed to submit review");
    }
  };

  if (!isOpen) {
    return (
      <div className="flex justify-center mt-16">
        <Button 
          onClick={() => setIsOpen(true)} 
          className="h-14 px-10 bg-[var(--accent)] text-black hover:bg-white uppercase tracking-widest font-semibold transition-all duration-300"
        >
          Add Your Review
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto mt-16 animate-in fade-in slide-in-from-bottom-8 duration-500">
      <div className="relative bg-[#0a0a0a] border border-white/10 rounded-[2rem] p-8 md:p-12 shadow-2xl">
        <button 
          onClick={() => setIsOpen(false)}
          className="absolute top-6 right-6 text-[var(--text-secondary)] hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
        
        <h2 className="font-display text-4xl text-white font-light mb-2">
          Share Your <span className="text-[var(--accent)]">Experience</span>
        </h2>
        <p className="text-[var(--text-secondary)] mb-8 font-light">
          We value your feedback. Let us know how we did!
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="clientName" className="text-[var(--text-secondary)] tracking-wide font-light">Your Name</Label>
              <Input id="clientName" {...register("clientName")} className="bg-black/30 border-white/10 h-12 text-white focus:border-[var(--accent)]/50 focus:ring-[var(--accent)]/20" placeholder="Ali" />
              {errors.clientName && (
                <p className="text-xs text-[var(--danger)]">{errors.clientName.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="projectType" className="text-[var(--text-secondary)] tracking-wide font-light">Project Type (optional)</Label>
              <Input id="projectType" {...register("projectType")} className="bg-black/30 border-white/10 h-12 text-white focus:border-[var(--accent)]/50 focus:ring-[var(--accent)]/20" placeholder="e.g. Wedding Shoot" />
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-[var(--text-secondary)] tracking-wide font-light">Rating</Label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setValue("rating", star)}
                  className={`transition-all duration-300 hover:scale-110 ${star <= rating ? "text-[var(--accent)]" : "text-white/20 hover:text-[var(--accent)]/50"}`}
                >
                  <Star className="w-10 h-10" fill={star <= rating ? "currentColor" : "none"} strokeWidth={1.5} />
                </button>
              ))}
            </div>
            {errors.rating && (
              <p className="text-xs text-[var(--danger)]">{errors.rating.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment" className="text-[var(--text-secondary)] tracking-wide font-light">Your Review</Label>
            <Textarea id="comment" {...register("comment")} className="bg-black/30 border-white/10 min-h-[120px] text-white focus:border-[var(--accent)]/50 focus:ring-[var(--accent)]/20 p-4 resize-y" placeholder="Tell us about your cinematic experience..." />
            {errors.comment && (
              <p className="text-xs text-[var(--danger)]">{errors.comment.message}</p>
            )}
          </div>

          <Button 
            type="submit" 
            disabled={pending} 
            className="w-full h-14 bg-[var(--accent)] text-black hover:bg-white uppercase tracking-widest font-semibold transition-all duration-300 mt-4"
          >
            {pending ? "Submitting..." : "Submit Review"}
          </Button>
        </form>
      </div>
    </div>
  );
}
