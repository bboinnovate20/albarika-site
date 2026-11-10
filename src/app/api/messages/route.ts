import { randomUUID } from "crypto";
import { sendEnquiry } from "@/lib/enquiry-mail";
import { messageSchema } from "@/lib/message-schema";
import { saveMessage } from "@/lib/repo/messages";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Send the form as JSON." }, { status: 400 });
  }

  const parsed = messageSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Check the form and try again.", issues: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const id = randomUUID();
  try {
    await sendEnquiry(parsed.data, id);
  } catch (error) {
    console.error("enquiry email failed", error instanceof Error ? error.name : "unknown");
    return NextResponse.json({ error: "The message could not be sent. Try again in a moment." }, { status: 503 });
  }

  try {
    await saveMessage(parsed.data, id);
  } catch (error) {
    console.error("message save failed", error instanceof Error ? error.name : "unknown");
  }

  return NextResponse.json({ id }, { status: 201 });
}
