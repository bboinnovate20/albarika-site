"use client";

import Link from "next/link";
import { useState } from "react";

export default function StudentLoginPage() {
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [notice, setNotice] = useState("");
  const [pending, setPending] = useState(false);

  return (
    <main className="flex min-h-screen items-center justify-center bg-canvas px-4 py-16 text-ink">
      <form
        className="w-full max-w-md rounded-[28px] bg-white p-8"
        onSubmit={async (event) => {
          event.preventDefault();
          setPending(true);
          setNotice("");
          const response = await fetch("/api/portal/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code, password }),
          });
          const body = (await response.json().catch(() => ({}))) as { error?: string };
          setPending(false);
          setNotice(response.ok ? "Signed in." : (body.error ?? "Sign-in is unavailable right now."));
        }}
      >
        <p className="text-sm font-bold uppercase tracking-[0.14em] text-blurple">Student portal</p>
        <h1 className="mt-3 font-display text-3xl font-extrabold">Sign in</h1>
        <p className="mt-3 text-sm font-medium leading-6 text-copy">
          Your student code and password are given to you at the institute once your enrolment is approved.
        </p>
        <label className="mt-6 block text-sm font-bold" htmlFor="student-code">
          Student code
        </label>
        <input
          id="student-code"
          value={code}
          onChange={(event) => setCode(event.target.value.toUpperCase())}
          placeholder="ALB-2026-0042"
          autoCapitalize="characters"
          className="mt-2 w-full rounded-[14px] border border-line px-4 py-3 font-mono uppercase outline-none focus:border-blurple"
        />
        <label className="mt-4 block text-sm font-bold" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mt-2 w-full rounded-[14px] border border-line px-4 py-3 outline-none focus:border-blurple"
        />
        {notice && <p className="mt-4 text-sm font-semibold text-copy">{notice}</p>}
        <button type="submit" disabled={pending} className="mt-6 w-full rounded-full bg-ink py-3 font-semibold text-white disabled:opacity-60">
          {pending ? "Signing in…" : "Sign in"}
        </button>
        <Link href="/" className="mt-4 block text-center text-sm font-bold text-blurple">
          Back to the institute
        </Link>
      </form>
    </main>
  );
}
