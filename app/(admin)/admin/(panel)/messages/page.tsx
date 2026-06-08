import { getMessages } from "@/actions/messages.actions";
import { markReadAction, deleteMessageAction } from "./actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function AdminMessagesPage() {
  const messages = await getMessages();

  return (
    <div>
      <h1 className="text-2xl font-semibold">Messages</h1>
      <div className="mt-8 space-y-4">
        {messages.map((msg: {
          _id: string;
          name: string;
          email: string;
          services: string[];
          date: string;
          message: string;
          read: boolean;
          createdAt: string;
        }) => (
          <details
            key={msg._id}
            className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6 group"
          >
            <summary className="cursor-pointer flex items-center justify-between">
              <div>
                <span className="font-medium">{msg.name}</span>
                <span className="ml-2 text-sm text-[var(--text-secondary)]">{msg.email}</span>
              </div>
              <Badge variant={msg.read ? "default" : "warning"}>
                {msg.read ? "Read" : "Unread"}
              </Badge>
            </summary>
            <div className="mt-4 text-sm text-[var(--text-secondary)]">
              <p>Services: {msg.services && msg.services.length > 0 ? msg.services.join(", ") : "—"}</p>
              <p>Date: {msg.date ? new Date(msg.date).toDateString() : "—"}</p>
              <p className="mt-4">{msg.message}</p>
              <div className="mt-4 flex gap-2">
                {!msg.read && (
                  <form action={markReadAction.bind(null, msg._id)}>
                    <Button type="submit" size="sm" variant="outline">Mark Read</Button>
                  </form>
                )}
                <form action={deleteMessageAction.bind(null, msg._id)}>
                  <Button type="submit" size="sm" variant="destructive">Delete</Button>
                </form>
              </div>
            </div>
          </details>
        ))}
        {messages.length === 0 && (
          <p className="text-[var(--text-secondary)]">No messages yet.</p>
        )}
      </div>
    </div>
  );
}
