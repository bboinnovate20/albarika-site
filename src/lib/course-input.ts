import type { CourseInput } from "@/lib/repo/courses";

export function parseCourseInput(body: unknown): { data: CourseInput } | { error: string } {
  if (!body || typeof body !== "object") return { error: "Send the course as JSON." };
  const record = body as Record<string, unknown>;
  const title = String(record.title ?? "").trim();
  const summary = String(record.summary ?? "").trim();
  const position = Number(record.position);
  if (title.length < 2) return { error: "Enter the course name." };
  if (summary.length < 10) return { error: "Describe the course in a sentence." };
  if (!Number.isInteger(position) || position < 1 || position > 99) return { error: "Position should be a number from 1 to 99." };
  if (!Array.isArray(record.options) || record.options.length === 0) return { error: "Add at least one length and price." };

  const options = [];
  for (const item of record.options) {
    if (!item || typeof item !== "object") return { error: "Check the lengths and prices." };
    const row = item as Record<string, unknown>;
    const months = Number(row.months);
    const feeNaira = Number(row.feeNaira);
    if (!Number.isInteger(months) || months < 1 || months > 36) return { error: "Each length should be between 1 and 36 months." };
    if (!Number.isInteger(feeNaira) || feeNaira < 0 || feeNaira > 5_000_000) return { error: "Enter a price in naira, with no kobo." };
    options.push({ months, feeNaira });
  }
  const months = new Set(options.map((option) => option.months));
  if (months.size !== options.length) return { error: "Each length can only have one price." };
  return { data: { title, summary, position, options } };
}
