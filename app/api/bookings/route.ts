import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Message from "@/models/Message";
import { sendEmail } from "@/lib/email";
import Settings from "@/models/Settings";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, services, date, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Name, email, and message are required" }, { status: 400 });
    }

    await connectDB();

    await Message.create({
      name,
      email,
      phone,
      services,
      date: date ? new Date(date) : null,
      message,
    });

    const settings = await Settings.findOne();
    const adminEmail = settings?.email || "najmalistudio@gmail.com";

    const emailHtml = `
      <h2>New Booking Request from ${name}</h2>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone || "N/A"}</p>
      <p><strong>Services:</strong> ${services && services.length > 0 ? services.join(", ") : "N/A"}</p>
      <p><strong>Date:</strong> ${date ? new Date(date).toDateString() : "N/A"}</p>
      <br/>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `;

    try {
      await sendEmail({
        to: adminEmail,
        subject: `New Booking Request from ${name}`,
        html: emailHtml,
      });
    } catch (emailError) {
      console.error("Failed to send notification email:", emailError);
      // We still return success because the DB save worked
    }

    return NextResponse.json({ success: true, message: "Booking submitted successfully" });
  } catch (error) {
    console.error("Booking submission error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
