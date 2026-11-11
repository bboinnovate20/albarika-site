import { studentIdPattern } from "@/lib/student-id";
import { z } from "zod";

export const registrationStatuses = ["pending", "accepted", "waitlist", "declined"] as const;
export const paymentStatuses = ["unpaid", "partial", "paid"] as const;

export const registrationStatusLabels: Record<(typeof registrationStatuses)[number], string> = {
  pending: "Pending",
  accepted: "Accepted",
  waitlist: "Waitlist",
  declined: "Declined",
};

export const paymentStatusLabels: Record<(typeof paymentStatuses)[number], string> = {
  unpaid: "Unpaid",
  partial: "Partially paid",
  paid: "Fully paid",
};

export function settledPayment(payment: (typeof paymentStatuses)[number], paidNaira: number, feeNaira: number) {
  if (payment === "paid") return { payment, paidNaira: feeNaira };
  if (payment === "unpaid") return { payment, paidNaira: 0 };
  if (!Number.isInteger(paidNaira) || paidNaira < 1 || paidNaira >= feeNaira) return null;
  return { payment, paidNaira };
}

const details = {
  fullName: z.string().trim().min(2, "Enter the student's full name"),
  phone: z.string().trim().min(10, "Enter a phone number we can call").max(20, "That phone number is too long"),
  email: z.string().trim().email("Enter a valid email").optional().or(z.literal("")),
  gender: z.enum(["Female", "Male"]).optional().or(z.literal("")),
  courseId: z.string().trim().min(1, "Choose a course"),
  feeId: z.string().trim().max(80).optional().or(z.literal("")),
  months: z.coerce.number().int().positive("Choose a course length"),
  guardianName: z.string().trim().max(120).optional().or(z.literal("")),
  guardianPhone: z.string().trim().max(20).optional().or(z.literal("")),
  note: z.string().trim().max(1000).optional().or(z.literal("")),
};

export const registrationSchema = z.object(details);

export const registrationUpdateSchema = registrationSchema.extend({
  status: z.enum(registrationStatuses, { message: "Choose a status" }),
  deskNote: z.string().trim().max(1000).optional().or(z.literal("")),
  payment: z.enum(paymentStatuses).optional(),
  paidNaira: z.coerce.number().int().min(0).max(5_000_000).optional(),
  studentCode: z
    .string()
    .trim()
    .toUpperCase()
    .refine((value) => value === "" || studentIdPattern.test(value))
    .optional()
    .or(z.literal("")),
});

export type RegistrationInput = z.infer<typeof registrationSchema>;
export type RegistrationUpdate = z.infer<typeof registrationUpdateSchema>;
export type RegistrationStatus = (typeof registrationStatuses)[number];
export type PaymentStatus = (typeof paymentStatuses)[number];
