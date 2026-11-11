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
    console.error("registration save failed", error instanceof Error ? error.name : "unknown");
    return NextResponse.json(
      { error: unknown ? "Choose a course we are running." : "The registration could not be saved. Try again in a moment." },
      { status: unknown ? 400 : 503 },
    );
  }
}
