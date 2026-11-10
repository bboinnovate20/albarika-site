"use client";

import type { Course, CourseOption } from "@/lib/landing";
import { useRouter } from "next/navigation";
import { useState } from "react";

const field = "w-full rounded-2xl border border-line bg-white px-4 py-3 text-base font-medium text-ink outline-none focus:border-blurple";

export function CourseForm({ course, nextPosition }: { course?: Course; nextPosition: number }) {
  const router = useRouter();
  const [title, setTitle] = useState(course?.title ?? "");
  const [summary, setSummary] = useState(course?.summary ?? "");
  const [position, setPosition] = useState(String(course?.position ?? nextPosition));
  const [options, setOptions] = useState<CourseOption[]>(course?.options.length ? course.options : [{ months: 3, feeNaira: 0 }]);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const updateOption = (index: number, patch: Partial<CourseOption>) => {
    setOptions((current) => current.map((option, item) => (item === index ? { ...option, ...patch } : option)));
  };

  const save = async () => {
    setError("");
    setPending(true);
    const response = await fetch(course ? `/api/admin/courses/${course.id}` : "/api/admin/courses", {
      method: course ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        summary,
        position: Number(position),
        options,
      }),
    });
    const body = (await response.json().catch(() => null)) as { error?: string } | null;
    if (!response.ok) {
      setError(body?.error ?? "The course could not be saved.");
      setPending(false);
      return;
    }
    router.push("/admin/courses");
    router.refresh();
  };

  const remove = async () => {
    if (!course || !window.confirm(`Remove ${course.title}? The landing page will stop showing it.`)) return;
    setPending(true);
    const response = await fetch(`/api/admin/courses/${course.id}`, { method: "DELETE" });
    if (!response.ok) {
      setError("The course could not be removed.");
      setPending(false);
      return;
    }
    router.push("/admin/courses");
    router.refresh();
  };

  return (
    <form
      className="mt-8 space-y-5"
      onSubmit={(event) => {
        event.preventDefault();
        void save();
      }}
    >
      <label className="block">
        <span className="text-sm font-semibold text-ink">Course name</span>
        <input className={`${field} mt-2`} value={title} onChange={(event) => setTitle(event.target.value)} required />
      </label>
      <label className="block">
        <span className="text-sm font-semibold text-ink">Description</span>
        <textarea className={`${field} mt-2 min-h-28`} value={summary} onChange={(event) => setSummary(event.target.value)} required />
      </label>
      <label className="block max-w-40">
        <span className="text-sm font-semibold text-ink">Position</span>
        <input
          className={`${field} mt-2`}
          type="number"
          min={1}
          max={99}
          value={position}
          onChange={(event) => setPosition(event.target.value)}
          required
        />
      </label>
      <fieldset className="space-y-3">
        <legend className="text-sm font-semibold text-ink">Lengths and prices</legend>
        {options.map((option, index) => (
          <div key={index} className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
            <label>
              <span className="text-xs font-semibold text-copy">Months</span>
              <input
                className={`${field} mt-1`}
                type="number"
                min={1}
                max={36}
                value={option.months}
                onChange={(event) => updateOption(index, { months: Number(event.target.value) })}
                required
              />
            </label>
            <label>
              <span className="text-xs font-semibold text-copy">Price (₦)</span>
              <input
                className={`${field} mt-1`}
                type="number"
                min={0}
                step={1}
                value={option.feeNaira}
                onChange={(event) => updateOption(index, { feeNaira: Number(event.target.value) })}
                required
              />
            </label>
            <button
              type="button"
              className="self-end rounded-full px-4 py-3 text-sm font-semibold text-copy hover:text-ink disabled:opacity-40"
              disabled={options.length === 1}
              onClick={() => setOptions((current) => current.filter((_, item) => item !== index))}
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          className="text-sm font-bold text-blurple"
          onClick={() => setOptions((current) => [...current, { months: 6, feeNaira: 0 }])}
        >
          Add another length
        </button>
      </fieldset>
      {error && <p className="text-sm font-semibold text-[#E5231B]">{error}</p>}
      <div className="flex flex-wrap gap-3">
        <button type="submit" className="rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white disabled:opacity-60" disabled={pending}>
          {pending ? "Saving…" : "Save course"}
        </button>
        {course && (
          <button type="button" className="rounded-full px-5 py-3 text-sm font-semibold text-[#E5231B]" disabled={pending} onClick={() => void remove()}>
            Remove course
          </button>
        )}
      </div>
    </form>
  );
}
