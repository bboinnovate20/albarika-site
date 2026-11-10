import { readFileSync } from "fs";
import { join } from "path";
import { institute } from "@/lib/landing";
import { messageTopics, type MessageInput } from "@/lib/message-schema";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function topicLabel(topic: MessageInput["topic"]) {
  return messageTopics.find((item) => item.id === topic)?.label ?? topic;
}

function dot(color: string, size = 9) {
  return `<td width="${size}" height="${size}" style="width:${size}px;height:${size}px;background:${color};border-radius:${size}px;font-size:0;line-height:0;">&nbsp;</td>`;
}

function spark() {
  const gold = "#FFC845";
  const coral = "#F4A49A";
  const ice = "#D6E4FF";
  const white = "#FFFFFF";
  return `<table role="presentation" cellpadding="3" cellspacing="0" border="0">
    <tr><td></td>${dot(gold, 8)}<td></td><td></td></tr>
    <tr>${dot(coral, 7)}<td></td>${dot(white, 6)}<td></td></tr>
    <tr><td></td>${dot(ice, 11)}<td></td>${dot(gold, 8)}</tr>
    <tr>${dot(white, 6)}<td></td>${dot(coral, 8)}<td></td></tr>
    <tr><td></td><td></td>${dot(gold, 7)}<td></td></tr>
  </table>`;
}

function headerBanner() {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#5865f2;border-radius:22px;">
    <tr>
      <td width="78" valign="middle" align="center" style="padding:18px 0 18px 8px;">${spark()}</td>
      <td align="center" valign="middle" style="padding:28px 8px 32px;font-family:Arial,Helvetica,sans-serif;">
        <table role="presentation" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:999px;">
          <tr>
            <td style="padding:5px 14px 5px 5px;">
              <img src="cid:logo" width="34" height="34" alt="" style="display:inline-block;width:34px;height:34px;border-radius:17px;vertical-align:middle;border:0;">
              <span style="display:inline-block;padding-left:8px;font-size:15px;font-weight:700;color:#14215b;vertical-align:middle;">Albarika</span>
            </td>
          </tr>
        </table>
        <p style="margin:18px 0 0;font-size:32px;line-height:38px;font-weight:800;color:#ffffff;">New enquiry</p>
      </td>
      <td width="78" valign="middle" align="center" style="padding:18px 8px 18px 0;">${spark()}</td>
    </tr>
  </table>`;
}

function enquiryHtml(details: { name: string; phone: string; email: string; topic: string; body: string }) {
  const name = escapeHtml(details.name);
  const phone = escapeHtml(details.phone);
  const email = escapeHtml(details.email || "Not given");
  const topic = escapeHtml(details.topic);
  const body = escapeHtml(details.body).replaceAll("\n", "<br>");
  const tel = `tel:${details.phone.replace(/[^\d+]/g, "")}`;
  const reply = details.email
    ? `<a href="mailto:${escapeHtml(details.email)}?subject=${encodeURIComponent(`Re: ${details.topic}`)}" style="display:inline-block;margin-left:8px;padding:12px 18px;border-radius:999px;background:#ffffff;border:1px solid #d7deee;color:#14215b;font-size:14px;font-weight:700;text-decoration:none;">Reply</a>`
    : "";

  return `<!doctype html>
<html lang="en">
  <body style="margin:0;padding:0;background:#f3f6fb;">
    <div style="display:none;max-height:0;overflow:hidden;">${name} asked about ${topic}. Phone ${phone}.</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3f6fb;padding:24px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:28px;overflow:hidden;">
            <tr>
              <td style="padding:12px 12px 0;">${headerBanner()}</td>
            </tr>
            <tr>
              <td style="padding:28px 28px 8px;font-family:Arial,Helvetica,sans-serif;">
                <h1 style="margin:0;font-size:28px;line-height:34px;font-weight:800;color:#14215b;">${name}</h1>
                <p style="margin:14px 0 0;"><span style="display:inline-block;padding:6px 12px;border-radius:999px;background:#fff6dc;color:#14215b;font-size:13px;font-weight:700;">${topic}</span></p>
              </td>
            </tr>
            <tr>
              <td style="padding:18px 28px 8px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3f6fb;border-radius:18px;">
                  <tr>
                    <td style="padding:18px 18px;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:26px;color:#14215b;">${body}</td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:8px 28px 4px;font-family:Arial,Helvetica,sans-serif;">
                <p style="margin:14px 0 4px;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#4a5578;">Phone</p>
                <p style="margin:0;font-size:16px;font-weight:700;color:#14215b;">${phone}</p>
                <p style="margin:14px 0 4px;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#4a5578;">Email</p>
                <p style="margin:0;font-size:16px;font-weight:700;color:#14215b;">${email}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:22px 28px 28px;font-family:Arial,Helvetica,sans-serif;">
                <a href="${tel}" style="display:inline-block;padding:12px 18px;border-radius:999px;background:#14215b;color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;">Call ${phone}</a>
                ${reply}
              </td>
            </tr>
            <tr>
              <td style="padding:16px 28px 22px;background:#f3f6fb;font-family:Arial,Helvetica,sans-serif;">
                <p style="margin:0;font-size:13px;line-height:20px;color:#4a5578;">${escapeHtml(institute.name)}<br>${escapeHtml(institute.address.join(", "))}</p>
                <p style="margin:8px 0 0;font-size:12px;line-height:18px;color:#4a5578;">Sent from the website contact form.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export async function sendEnquiry(input: MessageInput, id: string) {
  const key = process.env.SENDBYTE_API_KEY;
  if (!key) throw new Error("Missing SENDBYTE_API_KEY");

  const topic = topicLabel(input.topic);
  const from = process.env.SENDBYTE_FROM ?? `Albarika Computer Institute <enquiries@albarikacomputer.com.ng>`;
  const replyTo = input.email?.trim();
  const lines = [
    `Name: ${input.fullName}`,
    `Phone: ${input.phone}`,
    replyTo ? `Email: ${replyTo}` : "Email: not given",
    `Topic: ${topic}`,
    "",
    input.body,
  ];
  const text = lines.join("\n");
  const html = enquiryHtml({
    name: input.fullName,
    phone: input.phone,
    email: replyTo || "",
    topic,
    body: input.body,
  });

  const response = await fetch("https://api.sendbyte.africa/v1/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: institute.email,
      reply_to: replyTo || undefined,
      subject: `Website enquiry: ${topic}`.replace(/[\r\n]/g, " "),
      text,
      html,
      tags: ["enquiry"],
      idempotency_key: id,
      attachments: [
        {
          filename: "logo.jpeg",
          content: readFileSync(join(process.cwd(), "public/image/logo.jpeg")).toString("base64"),
          content_type: "image/jpeg",
          content_id: "logo",
          disposition: "inline",
        },
      ],
    }),
  });

  if (!response.ok) {
    const detail = (await response.json().catch(() => null)) as { code?: string } | null;
    const error = new Error("Enquiry email was not accepted");
    error.name = detail?.code ?? "SendByteError";
    throw error;
  }
}
