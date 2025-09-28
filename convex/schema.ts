import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,
  
  students: defineTable({
    // Student identification
    studentId: v.string(), // e.g., "STD-005"
    name: v.string(),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    // imageId: 
    imageId: v.array(v.id("_storage")),
    image_url: v.optional(v.string()),
    // Program information
    program: v.string(), // e.g., "Desktop Publishing (6 months)"
    programDuration: v.optional(v.string()),
    programMonth: v.optional(v.number()), 
    
    // Enrollment details
    enrollmentDate: v.number(), // Unix timestamp
    endDate: v.optional(v.number()), // Unix timestamp
    status: v.string(), // "Active", "Completed", "Suspended", "Dropped"
    
    // Guardian information (for minors or emergency contacts)
    guardianName: v.optional(v.string()),
    guardianPhoneNumber: v.optional(v.string()),
    guardianEmail: v.optional(v.string()),
    guardianRelationship: v.optional(v.string()), // "Parent", "Guardian", "Spouse", etc.
    
    // Additional student information
    dateOfBirth: v.optional(v.number()),
    gender: v.optional(v.string()),
    address: v.optional(v.string()),
    emergencyContact: v.optional(v.string()),
    emergencyPhone: v.optional(v.string()),
    
    // Academic information
    previousEducation: v.optional(v.string()),
    
    // Administrative
    registeredBy: v.optional(v.id("users")), // Admin who registered the student
    notes: v.optional(v.string()),
    isActive: v.boolean(), // For soft delete functionality
    
    // Timestamps
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("studentId", ["studentId"])
    .index("name", ["name"])
    .index("email", ["email"])
    .index("phone", ["phone"])
    .index("program", ["program"])
    .index("status", ["status"])
    .index("enrollmentDate", ["enrollmentDate"])
    .index("createdAt", ["createdAt"])
    .index("statusAndProgram", ["status", "program"])
    .index("guardianPhone", ["guardianPhoneNumber"]),

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