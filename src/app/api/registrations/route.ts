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
    const name = error instanceof Error ? error.name : "Error";
    const code = typeof error === "object" && error && "code" in error ? String((error as { code?: unknown }).code) : "";
    const message = (error instanceof Error ? error.message : "Unknown error")
      .replace(/[\r\n]/g, " ")
      .replace(/AKIA[A-Z0-9]+/g, "[access-key]")
      .replace(/ASIA[A-Z0-9]+/g, "[access-key]")
      .slice(0, 400);
    console.error("registration save failed", name, code, message);
    return NextResponse.json(
      {
        error: unknown ? "Choose a course we are running." : "The registration could not be saved.",
        detail: unknown ? undefined : [name, code, message].filter(Boolean).join(": "),
      },
      { status: unknown ? 400 : 503 },
    );
  }
}
