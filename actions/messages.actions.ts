"use server";

import { requireAuth } from "@/lib/auth-helpers";
import { connectDB } from "@/lib/mongodb";
import Message from "@/models/Message";
import { contactSchema } from "@/lib/validators/content";
import { getConfig } from "@/lib/config";
import { sendEmail } from "@/lib/email";
import { revalidatePath } from "next/cache";
import { getSettings } from "@/actions/settings.actions";

export async function getMessages(filter?: "all" | "read" | "unread") {
  await requireAuth();
  await connectDB();
  const query: Record<string, boolean> = {};
  if (filter === "read") query.read = true;
  if (filter === "unread") query.read = false;
  const messages = await Message.find(query)
    .sort({ createdAt: -1 })
    .lean();
  return JSON.parse(JSON.stringify(messages));
}

export async function getUnreadCount() {
  try {
    await connectDB();
    return await Message.countDocuments({ read: false });
  } catch {
    return 0;
  }
}

export async function markMessageRead(id: string) {
  await requireAuth();
  await connectDB();
  await Message.findByIdAndUpdate(id, { read: true });
  revalidatePath("/admin/messages");
  return { success: true };
}

export async function deleteMessage(id: string) {
  await requireAuth();
  await connectDB();
  await Message.findByIdAndDelete(id);
  revalidatePath("/admin/messages");
  return { success: true };
}

export async function submitContactForm(data: {
  name: string;
  email: string;
  phone?: string;
  services?: string[];
  date?: string;
  message: string;
}) {
  const parsed = contactSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message };
  }

  try {
    await connectDB();
    await Message.create({
      ...parsed.data,
      date: parsed.data.date
        ? new Date(parsed.data.date)
        : null,
      read: false,
    });
  } catch {
    return { success: false, error: "Unable to save message. Please try again." };
  }

  const smtpUser = await getConfig("SMTP_USER");
  const smtpPass = await getConfig("SMTP_PASS");
  const settings = await getSettings();

  if (smtpUser && smtpPass && settings?.email) {
    try {
      // Email to Admin
      await sendEmail({
        to: settings.email,
        subject: `New inquiry from ${parsed.data.name}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${parsed.data.name}</p>
          <p><strong>Email:</strong> ${parsed.data.email}</p>
          <p><strong>Phone:</strong> ${parsed.data.phone || "N/A"}</p>
          <p><strong>Services:</strong> ${parsed.data.services?.join(", ") || "N/A"}</p>
          <p><strong>Date:</strong> ${parsed.data.date || "N/A"}</p>
          <p><strong>Message:</strong></p>
          <p>${parsed.data.message}</p>
        `,
      });

      // Auto-reply Email to Sender
      await sendEmail({
        to: parsed.data.email,
        subject: `Thank you for contacting ${settings?.studioName || "Ali Studio"}`,
        html: `
          <h2>Hello ${parsed.data.name},</h2>
          <p>Thank you for reaching out to us! We have received your message regarding your inquiry.</p>
          <p>Our team will review your message and get back to you as soon as possible.</p>
          <br/>
          <p><strong>Your Message:</strong></p>
          <p><em>${parsed.data.message}</em></p>
          <br/>
          <p>Best Regards,</p>
          <p><strong>${settings?.studioName || "Ali Studio"}</strong></p>
        `,
      });
    } catch {
      // Message saved even if email fails
    }
  }

  return { success: true };
}
