import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create a new receipt
export const createReceipt = mutation({
  args: {
    studentName: v.string(),
    studentEmail: v.optional(v.string()),
    studentPhone: v.optional(v.string()),
    receiptNumber: v.string(),
    amount: v.number(),
    currency: v.string(),
    paymentMethod: v.string(),
    serviceType: v.string(),
    programName: v.string(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    // Generate student ID if not provided
    const studentId = args.studentEmail || `STD-${Date.now()}`;
    
    const receiptId = await ctx.db.insert("studentReceipts", {
      studentId,
      studentName: args.studentName,
      studentEmail: args.studentEmail,
      studentPhone: args.studentPhone,
      receiptNumber: args.receiptNumber,
      receiptDate: now,
      amount: args.amount,
      amountPaid: args.amount, // Assuming full payment for now
      currency: args.currency,
      paymentMethod: args.paymentMethod,
      serviceType: args.serviceType,
      programName: args.programName,
      notes: args.notes,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });
    
    return receiptId;
  },
});

// Get all receipts
export const getAllReceipts = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("studentReceipts")
      .filter((q) => q.eq(q.field("isActive"), true))
      .order("desc")
      .collect();
  },
});

// Get receipts by type (student vs customer services)
export const getReceiptsByType = query({
  args: {
    serviceType: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("studentReceipts")
      .filter((q) => 
        q.and(
          q.eq(q.field("isActive"), true),
          q.eq(q.field("serviceType"), args.serviceType)
        )
      )
      .order("desc")
      .collect();
  },
});

// Get receipt by ID
export const getReceiptById = query({
  args: {
    receiptId: v.id("studentReceipts"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.receiptId);
  },
});

// Update receipt
export const updateReceipt = mutation({
  args: {
    receiptId: v.id("studentReceipts"),
    studentName: v.optional(v.string()),
    studentEmail: v.optional(v.string()),
    studentPhone: v.optional(v.string()),
    amount: v.optional(v.number()),
    paymentMethod: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { receiptId, ...updates } = args;
    
    await ctx.db.patch(receiptId, {
      ...updates,
      updatedAt: Date.now(),
    });
    
    return receiptId;
  },
});

// Delete receipt (soft delete)
export const deleteReceipt = mutation({
  args: {
    receiptId: v.id("studentReceipts"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.receiptId, {
      isActive: false,
      updatedAt: Date.now(),
    });
    
    return args.receiptId;
  },
});

// Generate receipt number
export const generateReceiptNumber = query({
  handler: async (ctx) => {
    const count = await ctx.db
      .query("studentReceipts")
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();
    
    const nextNumber = count.length + 1;
    return `ALB-${String(nextNumber).padStart(4, '0')}`;
  },
}); 