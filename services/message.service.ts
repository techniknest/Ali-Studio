import { messageRepository } from "@/repositories/message.repository";
import { NotFoundError } from "@/lib/errors/app-error";
import { getConfig } from "@/lib/config";
import { sendEmail } from "@/lib/email";
import { getSettings } from "@/actions/settings.actions";

export class MessageService {
  async getMessages(filter?: "all" | "read" | "unread") {
    const query: Record<string, boolean> = {};
    if (filter === "read") query.read = true;
    if (filter === "unread") query.read = false;
    return messageRepository.find(query);
  }

  async getUnreadCount() {
    return messageRepository.count({ read: false });
  }

  async markMessageRead(id: string) {
    const item = await messageRepository.update(id, { read: true });
    if (!item) {
      throw new NotFoundError("Message");
    }
    return item;
  }

  async deleteMessage(id: string) {
    const success = await messageRepository.delete(id);
    if (!success) {
      throw new NotFoundError("Message");
    }
    return true;
  }

  async submitContactForm(data: any) {
    try {
      await messageRepository.create({
        ...data,
        date: data.date ? new Date(data.date) : null,
        read: false,
      });
    } catch {
      throw new Error("Unable to save message. Please try again.");
    }

    // Try to dispatch email, but do not fail the request if it fails
    this.dispatchEmails(data).catch(() => {});

    return true;
  }

  private async dispatchEmails(data: any) {
    const smtpUser = await getConfig("SMTP_USER");
    const smtpPass = await getConfig("SMTP_PASS");
    const settings = await getSettings();

    if (!smtpUser || !smtpPass || !settings?.email) return;

    // Email to Admin
    await sendEmail({
      to: settings.email,
      subject: `New inquiry from ${data.name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Phone:</strong> ${data.phone || "N/A"}</p>
        <p><strong>Services:</strong> ${data.services?.join(", ") || "N/A"}</p>
        <p><strong>Date:</strong> ${data.date || "N/A"}</p>
        <p><strong>Message:</strong></p>
        <p>${data.message}</p>
      `,
    });

    // Auto-reply Email to Sender
    await sendEmail({
      to: data.email,
      subject: `Thank you for contacting ${settings?.studioName || "Ali Studio"}`,
      html: `
        <h2>Hello ${data.name},</h2>
        <p>Thank you for reaching out to us! We have received your message regarding your inquiry.</p>
        <p>Our team will review your message and get back to you as soon as possible.</p>
        <br/>
        <p><strong>Your Message:</strong></p>
        <p><em>${data.message}</em></p>
        <br/>
        <p>Best Regards,</p>
        <p><strong>${settings?.studioName || "Ali Studio"}</strong></p>
      `,
    });
  }
}

export const messageService = new MessageService();
