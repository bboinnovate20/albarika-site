import { saveRegistrationPhoto, getRegistration } from "@/lib/repo/registrations";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

function unauthorized(request: NextRequest) {
  return !request.cookies.get("auth_token")?.value;
}

type Context = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, context: Context) {
  if (unauthorized(request)) return NextResponse.json({ error: "Sign in again." }, { status: 401 });
  const { id } = await context.params;
  const body = (await request.json().catch(() => null)) as { photo?: unknown } | null;
  const photo = typeof body?.photo === "string" ? body.photo : "";
  if (!photo) return NextResponse.json({ error: "Choose a JPEG or PNG photograph." }, { status: 400 });
  try {
    const existing = await getRegistration(id);
    if (!existing) return NextResponse.json({ error: "That registration was not found." }, { status: 404 });
    const photoKey = await saveRegistrationPhoto(id, photo);
    if (!photoKey) return NextResponse.json({ error: "That registration was not found." }, { status: 404 });
    revalidatePath("/admin/students");
    revalidatePath(`/admin/students/${id}`);
    if (existing.studentCode) revalidatePath(`/card/${encodeURIComponent(existing.studentCode)}`);
    return NextResponse.json({ photoKey });
  } catch (error) {
    const rejected = error instanceof Error && error.message === "photograph";
    console.error("student photo failed", error instanceof Error ? error.name : "unknown");
    return NextResponse.json(
      { error: rejected ? "Use a JPEG or PNG photograph." : "The photograph could not be saved." },
      { status: rejected ? 400 : 503 },
    );
  }
}
