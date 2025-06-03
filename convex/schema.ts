import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,

  studentReceipts: defineTable({
    // Student information
    studentId: v.string(), 
    studentName: v.string(),
    studentEmail: v.optional(v.string()),
    studentPhone: v.optional(v.string()),
    // Receipt details
    receiptNumber: v.string(), 
    receiptDate: v.number(), 
    dueDate: v.optional(v.number()), 

    // Payment information
    amount: v.number(), // Total amount
    amountPaid: v.optional(v.number()), // Amount already paid
    currency: v.string(), // e.g., "USD", "NGN", etc.
   
    paymentMethod: v.optional(v.string()), // "cash", "bank_transfer", "card", etc.

    // Service/Program details
    serviceType: v.string(), // "computer_training", "certification", "workshop", etc.
    programName: v.string(), // Name of the specific program

    // Academic/Session information
    session: v.optional(v.string()), // e.g., "2024/2025"
   
    // Administrative
    issuedBy: v.optional(v.id("users")), // Admin who issued the receipt
    notes: v.optional(v.string()),
    isActive: v.boolean(), // For soft delete functionality
    // Timestamps
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("studentId", ["studentId"])
    .index("receiptNumber", ["receiptNumber"])
    .index("studentEmail", ["studentEmail"])
    .index("studentName", ["studentName"])
    .index("serviceType", ["serviceType"])
    .index("session", ["session"])
    .index("createdAt", ["createdAt"])
    .index("serviceTypeAndSession", ["serviceType", "session"]),
});