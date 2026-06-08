import Link from "next/link";
import { connectDB } from "@/lib/mongodb";
import Portfolio from "@/models/Portfolio";
import Service from "@/models/Service";
import Review from "@/models/Review";
import Message from "@/models/Message";
import { getInfrastructureStatus } from "@/actions/config.actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

type RecentMessage = {
  _id: string;
  name: string;
  email: string;
  eventType?: string;
  read: boolean;
};

export default async function DashboardPage() {
  let portfolioCount = 0;
  let servicesCount = 0;
  let pendingReviews = 0;
  let unreadMessages = 0;
  let recentMessages: RecentMessage[] = [];

  try {
    await connectDB();
    const counts = await Promise.all([
      Portfolio.countDocuments(),
      Service.countDocuments(),
      Review.countDocuments({ approved: false }),
      Message.countDocuments({ read: false }),
    ]);
    portfolioCount = counts[0] ?? 0;
    servicesCount = counts[1] ?? 0;
    pendingReviews = counts[2] ?? 0;
    unreadMessages = counts[3] ?? 0;

    const recent = await Message.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();
    recentMessages = JSON.parse(JSON.stringify(recent)) as RecentMessage[];
  } catch {
    // Allow build/runtime when MongoDB isn't configured yet
  }

  const status = await getInfrastructureStatus();

  const stats = [
    { label: "Portfolio Items", value: portfolioCount, href: "/admin/portfolio" },
    { label: "Services", value: servicesCount, href: "/admin/services" },
    { label: "Pending Reviews", value: pendingReviews, href: "/admin/reviews" },
    { label: "Unread Messages", value: unreadMessages, href: "/admin/messages" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="mt-1 text-sm text-[var(--text-secondary)]">
        Welcome back to Ali Studio admin
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card className="transition hover:border-[var(--accent)]/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-normal text-[var(--text-secondary)]">
                  {stat.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-light text-[var(--accent)]">{stat.value}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-medium mb-4">System Status</h2>
        <div className="flex flex-wrap gap-3">
          <Badge variant={status.mongoStatus ? "success" : "danger"}>
            MongoDB {status.mongoStatus ? "✅" : "❌"}
          </Badge>
          <Badge variant={status.cloudinaryStatus ? "success" : "danger"}>
            Cloudinary {status.cloudinaryStatus ? "✅" : "❌"}
          </Badge>
          <Badge variant={status.emailStatus ? "success" : "warning"}>
            Email {status.emailStatus ? "✅" : "⚠️"}
          </Badge>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-medium mb-4">Recent Messages</h2>
        <div className="rounded-lg border border-[var(--border)] overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[var(--surface-alt)]">
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Event</th>
                <th className="px-4 py-3 text-left">Read</th>
              </tr>
            </thead>
            <tbody>
              {recentMessages.map((msg) => (
                <tr key={String(msg._id)} className="border-t border-[var(--border)]">
                  <td className="px-4 py-3">{msg.name}</td>
                  <td className="px-4 py-3 text-[var(--text-secondary)]">{msg.email}</td>
                  <td className="px-4 py-3">{msg.eventType || "—"}</td>
                  <td className="px-4 py-3">
                    <Badge variant={msg.read ? "default" : "warning"}>
                      {msg.read ? "Read" : "Unread"}
                    </Badge>
                  </td>
                </tr>
              ))}
              {recentMessages.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-[var(--text-secondary)]">
                    No messages yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
