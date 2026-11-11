export const studentIdPattern = /^ALB-\d{4}[A-Z]\d{2}$/;

export function studentInitial(fullName: string) {
  const words = fullName.trim().split(/\s+/).filter(Boolean);
  const word = words.at(-1) ?? "";
  const letter = word
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .match(/[A-Za-z]/)?.[0];
  return (letter ?? "A").toUpperCase();
}

export function formatStudentId(serial: number, letter: string, year: number) {
  const safeLetter = (letter.match(/[A-Za-z]/)?.[0] ?? "A").toUpperCase();
  return `ALB-${String(serial).padStart(4, "0")}${safeLetter}${String(year % 100).padStart(2, "0")}`;
}
