import { signInStaff } from "@/lib/cognito";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();
    if (!username || !password) {
      return NextResponse.json({ success: false, message: "Email and password are required" }, { status: 400 });
    }

    const session = await signInStaff(String(username).trim(), String(password));
    const response = NextResponse.json({ success: true });
    response.cookies.set("auth_token", session.accessToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: session.expiresIn,
      path: "/",
    });
    return response;
  } catch (error) {
    const name = error instanceof Error ? error.name : "";
    if (name === "NotAuthorizedException" || name === "UserNotFoundException") {
      return NextResponse.json({ success: false, message: "That email or password is not right." }, { status: 401 });
    }
    return NextResponse.json({ success: false, message: "Sign-in is unavailable right now." }, { status: 503 });
  }
}
