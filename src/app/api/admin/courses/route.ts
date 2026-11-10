import { parseCourseInput } from "@/lib/course-input";
import { createCourse } from "@/lib/repo/courses";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

function unauthorized(request: NextRequest) {
  return !request.cookies.get("auth_token")?.value;
}

export async function POST(request: NextRequest) {
  if (unauthorized(request)) return NextResponse.json({ error: "Sign in again." }, { status: 401 });
  const parsed = parseCourseInput(await request.json().catch(() => null));
  if ("error" in parsed) return NextResponse.json({ error: parsed.error }, { status: 400 });
  try {
    const id = await createCourse(parsed.data);
    revalidatePath("/");
    revalidatePath("/enrol");
    return NextResponse.json({ id }, { status: 201 });
  } catch (error) {
    console.error("course create failed", error instanceof Error ? error.name : "unknown");
    return NextResponse.json({ error: "The course could not be saved." }, { status: 503 });
  }
}
