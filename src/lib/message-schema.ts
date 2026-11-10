import { z } from "zod";

export const messageTopicIds = [
  "training",
  "document-services",
  "exam-prep",
  "maintenance",
  "general",
] as const;

export const messageTopics = [
  { id: "training", label: "Training course" },
  { id: "document-services", label: "Documents & typesetting" },
  { id: "exam-prep", label: "Exams & registration" },
  { id: "maintenance", label: "Computer repair" },
  { id: "general", label: "Something else" },
] as const;

export const messageSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name"),
  phone: z
    .string()
    .trim()
    .min(10, "Enter a phone number we can call")
    .max(20, "That phone number is too long"),
  email: z
    .string()
    .trim()
    .email("Enter a valid email")
    .optional()
    .or(z.literal("")),
  topic: z.enum(messageTopicIds, { message: "Choose a topic" }),
  body: z.string().trim().min(10, "Tell us a little more, at least a sentence"),
});

export type MessageInput = z.infer<typeof messageSchema>;
