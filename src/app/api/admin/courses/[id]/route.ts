import { parseCourseInput } from "@/lib/course-input";
import { deleteCourse, updateCourse } from "@/lib/repo/courses";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

function unauthorized(request: NextRequest) {
  return !request.cookies.get("auth_token")?.value;
}

type Context = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, context: Context) {
  if (unauthorized(request)) return NextResponse.json({ error: "Sign in again." }, { status: 401 });
  const { id } = await context.params;
  const parsed = parseCourseInput(await request.json().catch(() => null));
  if ("error" in parsed) return NextResponse.json({ error: parsed.error }, { status: 400 });
  try {
    const saved = await updateCourse(id, parsed.data);
    if (!saved) return NextResponse.json({ error: "That course was not found." }, { status: 404 });
    revalidatePath("/");
    revalidatePath("/enrol");
    return NextResponse.json({ id });
  } catch (error) {
    console.error("course update failed", error instanceof Error ? error.message : "unknown");
    return NextResponse.json({ error: "The course could not be saved." }, { status: 503 });
  }
}

export async function DELETE(request: NextRequest, context: Context) {
  if (unauthorized(request)) return NextResponse.json({ error: "Sign in again." }, { status: 401 });
  const { id } = await context.params;
  try {
    const removed = await deleteCourse(id);
    if (!removed) return NextResponse.json({ error: "That course was not found." }, { status: 404 });
    revalidatePath("/");
    revalidatePath("/enrol");
    return NextResponse.json({ id });
  } catch (error) {
    console.error("course delete failed", error instanceof Error ? error.message : "unknown");
    return NextResponse.json({ error: "The course could not be removed." }, { status: 503 });
  }
}
