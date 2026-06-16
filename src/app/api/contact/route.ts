import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";

const OWNER_EMAIL = "krishnaruparelia0207@gmail.com";

async function sendEmailNotification(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  // Only attempt if SMTP credentials are configured
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!user || !pass) return;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });

  // Notification to owner
  await transporter.sendMail({
    from: `"Portfolio Contact" <${user}>`,
    to: OWNER_EMAIL,
    replyTo: data.email,
    subject: `[Portfolio] ${data.subject}`,
    html: `
      <div style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;background:#0a0a0a;color:#fafafa;padding:32px;border-radius:12px;border:1px solid rgba(255,255,255,0.08)">
        <div style="margin-bottom:24px;padding-bottom:16px;border-bottom:1px solid rgba(255,255,255,0.08)">
          <span style="font-family:monospace;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:#737373">New portfolio message</span>
        </div>
        <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
          <tr><td style="padding:8px 0;font-family:monospace;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#737373;width:80px">From</td><td style="padding:8px 0;font-size:14px;color:#fafafa">${data.name}</td></tr>
          <tr><td style="padding:8px 0;font-family:monospace;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#737373">Email</td><td style="padding:8px 0;font-size:14px;color:#c5fd6c"><a href="mailto:${data.email}" style="color:#c5fd6c;text-decoration:none">${data.email}</a></td></tr>
          <tr><td style="padding:8px 0;font-family:monospace;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#737373">Subject</td><td style="padding:8px 0;font-size:14px;color:#fafafa">${data.subject}</td></tr>
        </table>
        <div style="background:#111111;border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:20px;margin-bottom:24px">
          <p style="margin:0;font-size:14px;line-height:1.7;color:#a1a1a1;white-space:pre-wrap">${data.message}</p>
        </div>
        <a href="mailto:${data.email}?subject=Re: ${encodeURIComponent(data.subject)}" style="display:inline-block;background:#c5fd6c;color:#0a0a0a;font-weight:600;font-size:13px;padding:10px 20px;border-radius:999px;text-decoration:none">Reply to ${data.name} ↗</a>
        <p style="margin-top:24px;font-family:monospace;font-size:11px;color:#525252">Sent from krishnaruparelia.dev portfolio</p>
      </div>
    `,
  });

  // Auto-reply to sender
  await transporter.sendMail({
    from: `"Krishna Ruparelia" <${user}>`,
    to: data.email,
    subject: `Got your message — Krishna Ruparelia`,
    html: `
      <div style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;background:#0a0a0a;color:#fafafa;padding:32px;border-radius:12px;border:1px solid rgba(255,255,255,0.08)">
        <div style="margin-bottom:24px;padding-bottom:16px;border-bottom:1px solid rgba(255,255,255,0.08)">
          <span style="font-family:monospace;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:#737373">Auto-reply</span>
        </div>
        <p style="font-size:16px;color:#fafafa;margin-bottom:16px">Hi ${data.name},</p>
        <p style="font-size:14px;line-height:1.7;color:#a1a1a1;margin-bottom:16px">Thanks for reaching out. I've received your message and will get back to you within 24 hours.</p>
        <p style="font-size:14px;line-height:1.7;color:#a1a1a1;margin-bottom:24px">In the meantime, feel free to check out my work on <a href="https://github.com/krishna2700" style="color:#c5fd6c;text-decoration:none">GitHub</a> or connect on <a href="https://www.linkedin.com/in/krishna-ruparelia-559229233/" style="color:#c5fd6c;text-decoration:none">LinkedIn</a>.</p>
        <div style="border-top:1px solid rgba(255,255,255,0.08);padding-top:20px;margin-top:8px">
          <p style="margin:0;font-size:13px;color:#fafafa;font-weight:600">Krishna Ruparelia</p>
          <p style="margin:4px 0 0;font-family:monospace;font-size:11px;color:#737373">Senior Full-Stack &amp; AI Engineer · Mumbai</p>
        </div>
      </div>
    `,
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Save to DB (best-effort)
    try {
      await prisma.message.create({
        data: { name, email, subject, message },
      });
    } catch {
      // DB not connected — continue
    }

    // Send email notification (best-effort)
    try {
      await sendEmailNotification({ name, email, subject, message });
    } catch (emailErr) {
      console.error("Email send failed:", emailErr);
      // Don't fail the request — DB save is the source of truth
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const messages = await prisma.message.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(messages);
  } catch {
    return NextResponse.json([]);
  }
}
