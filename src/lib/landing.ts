import type { MessageInput } from "@/lib/message-schema";

export const institute = {
  name: "Albarika Computer Institute",
  short: "Albarika",
  tagline: "Computer Institute",
  address: ["56 Freeman Street", "Lagos Island, Lagos"],
  phones: ["08092183810", "08028638778"],
  email: "albarikacomputercentre@gmail.com",
  whatsapp: "2348028638778",
  whatsappMessage: "Hello, I would like to know more about your services.",
  maps: "https://www.google.com/maps/search/?api=1&query=56+Freeman+Street+Lagos+Island",
};

export type CourseOption = { id: string; months: number; feeNaira: number };

export type Course = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  position?: number;
  options: CourseOption[];
};

export const courses: Course[] = [
  {
    id: "desktop-publishing",
    slug: "desktop-publishing",
    title: "Desktop Publishing",
    summary: "Design flyers, reports and layouts, then print them cleanly.",
    options: [
      { id: "desktop-publishing-3", months: 3, feeNaira: 25000 },
      { id: "desktop-publishing-6", months: 6, feeNaira: 45000 },
    ],
  },
  {
    id: "programming",
    slug: "programming",
    title: "Programming Class",
    summary: "Write real programs, from the first page of code to a finished project.",
    options: [{ id: "programming-6", months: 6, feeNaira: 60000 }],
  },
  {
    id: "computer-maintenance",
    slug: "computer-maintenance",
    title: "Computer Maintenance",
    summary: "Diagnose, repair and set up computers and small networks.",
    options: [{ id: "computer-maintenance-3", months: 3, feeNaira: 35000 }],
  },
  {
    id: "data-entry",
    slug: "data-entry",
    title: "Data Entry",
    summary: "Build accurate spreadsheets and keep records that stay useful.",
    options: [{ id: "data-entry-2", months: 2, feeNaira: 20000 }],
  },
];

export const services: {
  title: string;
  summary: string;
  timing: string;
  topic: MessageInput["topic"];
}[] = [
  {
    title: "Document services & typesetting",
    summary: "Typing, scanning, photocopying, laminating, and book or project typesetting.",
    timing: "On demand",
    topic: "document-services",
  },
  {
    title: "JAMB, WAEC & online registration",
    summary: "JAMB and WAEC forms, university and job applications, and government portals.",
    timing: "Same visit",
    topic: "exam-prep",
  },
  {
    title: "CBT exam preparation",
    summary: "JAMB CBT practice, WAEC prep, mock exams and result checking.",
    timing: "Flexible",
    topic: "exam-prep",
  },
  {
    title: "Data entry & databases",
    summary: "Spreadsheets, record keeping and straightforward data analysis.",
    timing: "24–48 hours",
    topic: "general",
  },
  {
    title: "Academic & business projects",
    summary: "Student projects, proposals, research papers and presentations.",
    timing: "1–7 days",
    topic: "general",
  },
];

export const testimonials = [
  {
    name: "Musa Ibrahim",
    role: "Staff",
    content:
      "Albarika's mobile development course gave me the skills to build apps that users love. The mentorship and practical projects made all the difference.",
  },
  {
    name: "Habeeb",
    role: "Staff",
    content:
      "The design thinking approach taught at Albarika revolutionized how I approach user experience. Now I create designs that truly solve user problems.",
  },
];

export const whatsappHref = `https://wa.me/${institute.whatsapp}?text=${encodeURIComponent(institute.whatsappMessage)}`;

export function courseBySlug(slug: string | undefined) {
  return courses.find((course) => course.slug === slug);
}
