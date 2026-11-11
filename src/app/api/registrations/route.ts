import { registrationSchema } from "@/lib/registration-schema";
import { createRegistration } from "@/lib/repo/registrations";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const parsed = registrationSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Check the form and try again.", issues: parsed.error.flatten().fieldErrors }, { status: 400 });
  }
  try {
    const id = await createRegistration(parsed.data);
    revalidatePath("/admin");
    revalidatePath("/admin/students");
    return NextResponse.json({ id }, { status: 201 });
  } catch (error) {
    const unknown = error instanceof Error && error.message === "Unknown course";
    const name = error instanceof Error ? error.name : "unknown";
    const message = error instanceof Error ? error.message.replace(/[\r\n]/g, " ").slice(0, 180) : "";
    const safe = /AKIA|secret|token|password/i.test(message) ? "redacted" : message;
    const code = typeof error === "object" && error && "code" in error ? String((error as { code?: unknown }).code).slice(0, 40) : "";
    console.error("registration save failed", name, code, safe);
    return NextResponse.json(
      { error: unknown ? "Choose a course we are running." : "The registration could not be saved. Try again in a moment." },
      { status: unknown ? 400 : 503 },
    );
  }
}
