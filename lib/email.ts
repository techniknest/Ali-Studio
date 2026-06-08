import nodemailer from 'nodemailer';
import { getConfig } from './config';

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  const user = await getConfig("SMTP_USER");
  const pass = await getConfig("SMTP_PASS");

  if (!user || !pass) {
    throw new Error("SMTP configuration is incomplete");
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user,
      pass,
    },
  });

  const mailOptions = {
    from: user,
    to,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
}
