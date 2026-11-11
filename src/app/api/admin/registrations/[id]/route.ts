import { registrationUpdateSchema } from "@/lib/registration-schema";
import { updateRegistration } from "@/lib/repo/registrations";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

function unauthorized(request: NextRequest) {
  return !request.cookies.get("auth_token")?.value;
}

type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, context: Context) {
  if (unauthorized(request)) return NextResponse.json({ error: "Sign in again." }, { status: 401 });
  const { id } = await context.params;
  const parsed = registrationUpdateSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    const badCode = parsed.error.issues.some((issue) => issue.path.includes("studentCode"));
    return NextResponse.json({ error: badCode ? "Student IDs look like ALB-0001A26." : "Check the form and try again." }, { status: 400 });
  }
  try {
    const saved = await updateRegistration(id, parsed.data);
    if (saved === null) return NextResponse.json({ error: "That registration was not found." }, { status: 404 });
    revalidatePath("/admin");
    revalidatePath("/admin/students");
    revalidatePath(`/admin/students/${id}`);
    revalidatePath(`/card/${encodeURIComponent(saved.studentCode)}`);
    return NextResponse.json({ id, ...saved });
  } catch (error) {
    const unknown = error instanceof Error && error.message === "Unknown course";
    const duplicate = error instanceof Error && error.message === "duplicate";
    const partial = error instanceof Error && error.message === "partial";
    console.error("registration update failed", error instanceof Error ? error.name : "unknown");
    return NextResponse.json(
      {
        error: duplicate
          ? "That student ID is already in use."
          : unknown
            ? "Choose a course we are running."
            : partial
              ? "Enter an amount paid that is less than the expected amount."
              : "The registration could not be saved.",
      },
      { status: duplicate || unknown || partial ? 400 : 503 },
    );
  }
}
