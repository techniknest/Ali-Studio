import { getReviews, submitPublicReview } from "@/actions/reviews.actions";
import { ReviewForm } from "@/components/public/ReviewForm";
import { Star } from "lucide-react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Reviews | Ali Studio",
  description: "What our clients say about working with Ali Studio.",
};

export default async function ReviewsPage() {
  const { items } = await getReviews({ approvedOnly: true, limit: 12 });

  return (
    <div className="min-h-screen pt-24 bg-[#080808] relative overflow-hidden">
      {/* Decorative Blur Background */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-[var(--accent)]/5 rounded-full filter blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-[var(--accent)]/5 rounded-full filter blur-[150px] pointer-events-none" />

      <div className="container-main section-padding relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-[10px] uppercase tracking-widest text-[var(--accent)] font-semibold px-3 py-1 border border-[var(--accent)]/20 rounded-full bg-[var(--accent)]/5 mb-6 inline-block">
            Testimonials
          </span>
          <h1 className="font-display text-5xl font-light md:text-7xl text-white">
            Client <span className="text-[var(--accent)]">Reviews</span>
          </h1>
          <p className="mt-6 text-lg font-light text-[var(--text-secondary)] leading-relaxed">
            We measure our success by the joy of our clients. Here is what they have to say about their cinematic experiences with Ali Studio.
          </p>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20 border border-white/5 rounded-[2rem] bg-[#111111]/50 backdrop-blur-xl">
            <h3 className="text-2xl font-display text-white mb-2">No Reviews Yet</h3>
            <p className="text-[var(--text-secondary)] font-light">Be the first to share your experience with us.</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {items.map((review: {
              _id: string;
              clientName: string;
              rating: number;
              comment: string;
              projectType: string;
              createdAt: string;
            }) => (
              <article
                key={review._id}
                className="rounded-[2rem] border border-white/5 bg-[#111111]/80 backdrop-blur-xl p-10 hover:border-[var(--accent)]/20 transition-all duration-500 group relative overflow-hidden flex flex-col h-full"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent)]/5 rounded-full filter blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                
                <div className="flex gap-1 mb-6">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-5 h-5 ${i < review.rating ? "text-[var(--accent)] fill-[var(--accent)]" : "text-white/10 fill-white/10"}`} 
                    />
                  ))}
                </div>
                
                <p className="text-lg font-light text-white leading-relaxed flex-grow mb-8 relative z-10">
                  <span className="text-4xl text-[var(--accent)] opacity-20 absolute -top-4 -left-2 font-serif">&ldquo;</span>
                  {review.comment}
                  <span className="text-4xl text-[var(--accent)] opacity-20 absolute -bottom-4 right-0 font-serif leading-none">&rdquo;</span>
                </p>
                
                <footer className="mt-auto border-t border-white/10 pt-6 relative z-10">
                  <p className="font-semibold text-white tracking-wide uppercase text-sm">{review.clientName}</p>
                  {review.projectType && (
                    <p className="text-xs text-[var(--accent)] mt-1 uppercase tracking-widest font-semibold">{review.projectType}</p>
                  )}
                </footer>
              </article>
            ))}
          </div>
        )}

        <ReviewForm submitAction={submitPublicReview} />
      </div>
    </div>
  );
}
