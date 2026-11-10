import { signInStudent } from "@/lib/cognito";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  let json: { code?: unknown; password?: unknown };
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Send the form as JSON." }, { status: 400 });
  }

  const code = String(json.code ?? "").trim();
  const password = String(json.password ?? "");
  if (code.length < 3 || password.length < 8) {
    return NextResponse.json({ error: "Enter your student code and password." }, { status: 400 });
  }

  try {
    const session = await signInStudent(code, password);
    const jar = await cookies();
    jar.set("albarika_session", session.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: session.expiresIn,
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    const name = error instanceof Error ? error.name : "";
    if (name === "NotAuthorizedException" || name === "UserNotFoundException") {
      return NextResponse.json({ error: "That code or password is not right." }, { status: 401 });
    }
    return NextResponse.json({ error: "Sign-in is unavailable right now." }, { status: 503 });
  }
}
