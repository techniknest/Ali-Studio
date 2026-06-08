import { getReviews } from "@/actions/reviews.actions";
import { approveReviewAction, deleteReviewAction } from "./actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function AdminReviewsPage() {
  const pending = await getReviews({ pendingOnly: true });
  const approved = await getReviews({ approvedOnly: true, limit: 20 });

  return (
    <div>
      <h1 className="text-2xl font-semibold">Reviews</h1>

      <section className="mt-8">
        <h2 className="text-lg font-medium mb-4">Pending Approval ({pending.items.length})</h2>
        <div className="space-y-4">
          {pending.items.map((review: {
            _id: string;
            clientName: string;
            rating: number;
            comment: string;
            projectType: string;
          }) => (
            <div
              key={review._id}
              className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{review.clientName}</p>
                  <p className="text-[var(--accent)]">{"★".repeat(review.rating)}</p>
                  <p className="mt-2 text-sm text-[var(--text-secondary)]">{review.comment}</p>
                </div>
                <div className="flex gap-2">
                  <form action={approveReviewAction.bind(null, review._id)}>
                    <Button type="submit" size="sm">Approve</Button>
                  </form>
                  <form action={deleteReviewAction.bind(null, review._id)}>
                    <Button type="submit" size="sm" variant="destructive">Delete</Button>
                  </form>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-lg font-medium mb-4">Approved</h2>
        <div className="space-y-4">
          {approved.items.map((review: {
            _id: string;
            clientName: string;
            rating: number;
            comment: string;
          }) => (
            <div
              key={review._id}
              className="rounded-lg border border-[var(--border)] p-4 flex justify-between items-start"
            >
              <div>
                <div className="flex items-center gap-3">
                  <p className="font-medium">{review.clientName}</p>
                  <Badge variant="success">Approved</Badge>
                </div>
                <p className="mt-2 text-sm text-[var(--text-secondary)]">{review.comment}</p>
              </div>
              <div>
                <form action={deleteReviewAction.bind(null, review._id)}>
                  <Button type="submit" size="sm" variant="destructive">Delete</Button>
                </form>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
