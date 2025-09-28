import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { type QueryCtx, type MutationCtx } from "./_generated/server";

// Helper function to validate student existence
const validateStudent = async (ctx: QueryCtx | MutationCtx, studentId: string, studentName?: string) => {
  const existingStudent = await ctx.db
    .query("students")
    .filter((q) =>
      q.and(
        q.eq(q.field("isActive"), true),
        q.eq(q.field("studentId"), studentId)
      )
    )
    .first();

  if (!existingStudent) {
    // throw new Error(`Student with ID ${studentId} does not exist or is inactive. Please verify the student ID and try again.`);
    throw new ConvexError({
      message: `Student with ID ${studentId} does not exist or is inactive. Please verify the student ID and try again.`,
      code: 123,
      severity: "high",
    });
  }

  // Verify that the student name matches if provided
  if (studentName && existingStudent.name !== studentName) {
    throw new Error(`Student name mismatch. Expected: ${existingStudent.name}, Provided: ${studentName}. Please verify the student details.`);
  }

  return existingStudent;
};

// Get student details by student ID (for receipt creation)
export const getStudentForReceipt = query({
  args: {
    studentId: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const student = await validateStudent(ctx, args.studentId);
      return {
        success: true,
        student: {
          studentId: student.studentId,
          name: student.name,
          email: student.email,
          phone: student.phone,
          program: student.program,
          status: student.status,
        }
      };
    } catch (error) {

      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred"
      };
    }
  },
});

export const createReceipt = mutation({
  args: {
    studentID: v.string(),
    studentName: v.string(),
    studentEmail: v.optional(v.string()),
    studentPhone: v.optional(v.string()),
    receiptNumber: v.string(),
    amount: v.number(),
    paymentMethod: v.string(),
    serviceType: v.string(),
    programName: v.string(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Validate student exists and name matches
    const existingStudent = await validateStudent(ctx, args.studentID, args.studentName);

    const now = Date.now();
    const receiptId = await ctx.db.insert("studentReceipts", {
      studentId: args.studentID,
      studentName: args.studentName,
      studentEmail: args.studentEmail,
      studentPhone: args.studentPhone,
      receiptNumber: args.receiptNumber,
      receiptDate: now,
      amount: args.amount,
      amountPaid: args.amount, // Assuming full payment for now
      paymentMethod: args.paymentMethod,
      serviceType: args.serviceType,
      programName: args.programName,
      notes: args.notes,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });
    
    // Get the created receipt
    const receiptInfo = await ctx.db.get(receiptId);
    
    return {
      receipt: receiptInfo,
      student: existingStudent,
      message: "Receipt created successfully"
    };
  },
});

// Create receipt with automatic student details lookup
export const createReceiptByStudentId = mutation({
  args: {
    studentID: v.string(),
    receiptNumber: v.string(),
    amount: v.number(),
    paymentMethod: v.string(),
    serviceType: v.string(),
    programName: v.string(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Validate student exists and get their details
    const existingStudent = await validateStudent(ctx, args.studentID);

    const now = Date.now();
    const receiptId = await ctx.db.insert("studentReceipts", {
      studentId: args.studentID,
      studentName: existingStudent.name,
      studentEmail: existingStudent.email,
      studentPhone: existingStudent.phone,
      receiptNumber: args.receiptNumber,
      receiptDate: now,
      amount: args.amount,
      amountPaid: args.amount, // Assuming full payment for now
      paymentMethod: args.paymentMethod,
      serviceType: args.serviceType,
      programName: args.programName,
      notes: args.notes,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });
    
    // Get the created receipt
    const receiptInfo = await ctx.db.get(receiptId);
    
    return {
      receiptInfo,
      studentData: existingStudent,
      message: "Receipt created successfully with auto-filled student details"
    };
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
    
    // Remove undefined values
    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, value]) => value !== undefined)
    );
    
    await ctx.db.patch(receiptId, {
      ...cleanUpdates,
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

// Get receipts by student name
export const getReceiptsByStudentName = query({
  args: {
    studentName: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("studentReceipts")
      .filter((q) =>
        q.and(
          q.eq(q.field("isActive"), true),
          q.eq(q.field("studentName"), args.studentName)
        )
      )
      .order("desc")
      .collect();
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

// Validate if student exists (for frontend validation)
export const validateStudentExists = query({
  args: {
    studentId: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const student = await validateStudent(ctx, args.studentId);
      return {
        exists: true,
        student: {
          studentId: student.studentId,
          name: student.name,
          email: student.email,
          phone: student.phone,
          program: student.program,
          status: student.status,
        },
        message: "Student found"
      };
    } catch (error) {
      return {
        exists: false,
        student: null,
        error: error instanceof Error ? error.message : "Student not found"
      };
    }
  },
});

// Get receipt with student information
export const getReceiptWithStudentInfo = query({
  args: {
    receiptId: v.string(),
  },
  handler: async (ctx, args) => {
    // Find receipt by receipt number
    const receipt = await ctx.db
      .query("studentReceipts")
      .filter((q) =>
        q.and(
          q.eq(q.field("isActive"), true),
          q.eq(q.field("receiptNumber"), args.receiptId)
        )
      )
      .first();
    
    if (!receipt) {
      throw new ConvexError({
        message: "Receipt not found or inactive",
        code: 404,
        severity: "high",
      });
    }

    // Get student information
    const student = await ctx.db
      .query("students")
      .filter((q) =>
        q.and(
          q.eq(q.field("isActive"), true),
          q.eq(q.field("studentId"), receipt.studentId)
        )
      )
      .first();

    if (!student) {
      throw new ConvexError({
        message: "Associated student not found or inactive",
        code: 404,
        severity: "high",
      });
    }

    // Get student image URL if available
    let studentImageUrl = null;
    if (student.imageId && student.imageId.length > 0) {
      try {
        studentImageUrl = await ctx.storage.getUrl(student.imageId[0]);
      } catch (error) {
        console.error("Error getting student image URL:", error);
      }
    }

    return {
      receipt,
      student: {
        ...student,
        image_url: studentImageUrl
      }
    };
  },
});

export const getReceiptByIdWithStudentInfo = query({
  args: {
    receiptId: v.id("studentReceipts"),
  },
  handler: async (ctx, args) => {

    if(args.receiptId == "skip") return {};

    // Find receipt by ID
    const receipt = await ctx.db.get(args.receiptId);
    
    if (!receipt || !receipt.isActive) {
      throw new ConvexError({
        message: "Receipt not found or inactive",
        code: 404,
        severity: "high",
      });
    }

    // Get student information
    const student = await ctx.db
      .query("students")
      .filter((q) =>
        q.and(
          q.eq(q.field("isActive"), true),
          q.eq(q.field("studentId"), receipt.studentId)
        )
      )
      .first();

    if (!student) {
      throw new ConvexError({
        message: "Associated student not found or inactive",
        code: 404,
        severity: "high",
      });
    }

    // Get student image URL if available
    let studentImageUrl = null;
    if (student.imageId && student.imageId.length > 0) {
      try {
        studentImageUrl = await ctx.storage.getUrl(student.imageId[0]);
      } catch (error) {
        console.error("Error getting student image URL:", error);
      }
    }

    return {
      receipt,
      student: {
        ...student,
        image_url: studentImageUrl
      }
    };
  },
});