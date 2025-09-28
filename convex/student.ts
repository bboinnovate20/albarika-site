import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { type QueryCtx, type MutationCtx } from "./_generated/server";

// Create a new student
export const createStudent = mutation({
  args: {
    imageId: v.optional(v.string()),
    name: v.string(),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    program: v.string(),
    programDuration: v.optional(v.string()),
    enrollmentDate: v.optional(v.number()), // If not provided, use current date
    endDate: v.optional(v.number()),
    status: v.optional(v.string()), // Default to "Active"
    guardianName: v.optional(v.string()),
    guardianPhoneNumber: v.optional(v.string()),
    guardianEmail: v.optional(v.string()),
    guardianRelationship: v.optional(v.string()),
    dateOfBirth: v.optional(v.number()),
    gender: v.optional(v.string()),
    address: v.optional(v.string()),
    emergencyContact: v.optional(v.string()),
    emergencyPhone: v.optional(v.string()),
    previousEducation: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    // Generate student ID
    const studentId = await generateStudentId(ctx);
    
    const studentData = {
      studentId,
      name: args.name,
      email: args.email,
      phone: args.phone,
      program: args.program,
      programDuration: args.programDuration,
      enrollmentDate: args.enrollmentDate || now,
      endDate: args.endDate,
      status: args.status || "Active",
      guardianName: args.guardianName,
      guardianPhoneNumber: args.guardianPhoneNumber,
      guardianEmail: args.guardianEmail,
      guardianRelationship: args.guardianRelationship,
      dateOfBirth: args.dateOfBirth,
      gender: args.gender,
      address: args.address,
      emergencyContact: args.emergencyContact,
      emergencyPhone: args.emergencyPhone,
      previousEducation: args.previousEducation,
      notes: args.notes,
      imageId: args.imageId ? [args.imageId as any] : [], // Convert string to array of storage IDs
      isActive: true,
      createdAt: now,
      updatedAt: now,
    };

    const studentDbId = await ctx.db.insert("students", studentData);
    
    // Return both the database ID and the generated studentId
    return {
      _id: studentDbId,
      generatedStudentId: studentId,
      studentData: studentData
    };
  },
});

// Get all students
export const getAllStudents = query({
  handler: async (ctx) => {
    const students = await ctx.db
      .query("students")
      .filter((q) => q.eq(q.field("isActive"), true))
      .order("desc")
      .collect();

    // Map students with image URLs
    const studentsWithImages = await Promise.all(
      students.map(async (student) => {
        let image_url = null;
        
        // Get image URL if imageId exists and has at least one image
        if (student.imageId && student.imageId.length > 0) {
          try {
            image_url = await ctx.storage.getUrl(student.imageId[0]);
          } catch (error) {
            console.error("Error getting image URL:", error);
            image_url = null;
          }
        }
        
        return {
          ...student,
          image_url
        };
      })
    );

    return studentsWithImages;
  },
});

// Get students by status
export const getStudentsByStatus = query({
  args: {
    status: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("students")
      .filter((q) =>
        q.and(
          q.eq(q.field("isActive"), true),
          q.eq(q.field("status"), args.status)
        )
      )
      .order("desc")
      .collect();
  },
});

// Get students by program
export const getStudentsByProgram = query({
  args: {
    program: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("students")
      .filter((q) =>
        q.and(
          q.eq(q.field("isActive"), true),
          q.eq(q.field("program"), args.program)
        )
      )
      .order("desc")
      .collect();
  },
});

// Get students by session
// export const getStudentsBySession = query({
//   args: {
//     session: v.string(),
//   },
//   handler: async (ctx, args) => {
//     return await ctx.db
//       .query("students")
//       .filter((q) =>
//         q.and(
//           q.eq(q.field("isActive"), true),
//           q.eq(q.field("session"), args.session)
//         )
//       )
//       .order("desc")
//       .collect();
//   },
// });

// Get student by ID (database ID)
export const getStudentById = query({
  args: {
    studentId: v.id("students"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.studentId);
  },
});

// Get student by student ID (custom ID like STD-005)
export const getStudentByStudentId = query({
  args: {
    studentId: v.string(),
  },
  handler: async (ctx, args) => {
    const student = await ctx.db
      .query("students")
      .filter((q) =>
        q.and(
          q.eq(q.field("isActive"), true),
          q.eq(q.field("studentId"), args.studentId)
        )
      )
      .first();

    if (!student) {
      return null;
    }

    // Get image URL if imageId exists
    let image_url = null;
    if (student.imageId && student.imageId.length > 0) {
      try {
        image_url = await ctx.storage.getUrl(student.imageId[0]);
      } catch (error) {
        console.error("Error getting image URL:", error);
        image_url = null;
      }
    }

    return {
      ...student,
      image_url
    };
  },
});

// Search students by name or email
export const searchStudents = query({
  args: {
    searchTerm: v.string(),
  },
  handler: async (ctx, args) => {
    const searchTerm = args.searchTerm.toLowerCase();
    
    const allStudents = await ctx.db
      .query("students")
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();
    
    return allStudents.filter(
      (student) =>
        student.name.toLowerCase().includes(searchTerm) ||
        (student.email && student.email.toLowerCase().includes(searchTerm)) ||
        student.studentId.toLowerCase().includes(searchTerm)
    );
  },
});

// Update student
export const updateStudent = mutation({
  args: {
    studentId: v.id("students"),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    program: v.optional(v.string()),
    programDuration: v.optional(v.string()),
    endDate: v.optional(v.number()),
    status: v.optional(v.string()),
    guardianName: v.optional(v.string()),
    guardianPhoneNumber: v.optional(v.string()),
    guardianEmail: v.optional(v.string()),
    guardianRelationship: v.optional(v.string()),
    dateOfBirth: v.optional(v.number()),
    gender: v.optional(v.string()),
    address: v.optional(v.string()),
    emergencyContact: v.optional(v.string()),
    emergencyPhone: v.optional(v.string()),
    session: v.optional(v.string()),
    batch: v.optional(v.string()),
    previousEducation: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { studentId, ...updates } = args;
    
    // Remove undefined values
    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, value]) => value !== undefined)
    );
    
    await ctx.db.patch(studentId, {
      ...cleanUpdates,
      updatedAt: Date.now(),
    });
    
    return studentId;
  },
});

// Delete student (soft delete)
export const deleteStudent = mutation({
  args: {
    studentId: v.id("students"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.studentId, {
      isActive: false,
      updatedAt: Date.now(),
    });
    return args.studentId;
  },
});

// Update student status
export const updateStudentStatus = mutation({
  args: {
    studentId: v.id("students"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.studentId, {
      status: args.status,
      updatedAt: Date.now(),
    });
    return args.studentId;
  },
});

// Generate student ID
export const generateStudentNumber = query({
  handler: async (ctx) => {
    return await generateStudentId(ctx);
  },
});

// Get student statistics
export const getStudentStatistics = query({
  handler: async (ctx) => {
    const allStudents = await ctx.db
      .query("students")
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();

    const stats = {
      total: allStudents.length,
      active: allStudents.filter(s => s.status === "Active").length,
      completed: allStudents.filter(s => s.status === "Completed").length,
      suspended: allStudents.filter(s => s.status === "Suspended").length,
      dropped: allStudents.filter(s => s.status === "Dropped").length,
    };

    // Program breakdown
    const programStats: Record<string, number> = {};
    allStudents.forEach(student => {
      if (programStats[student.program]) {
        programStats[student.program]++;
      } else {
        programStats[student.program] = 1;
      }
    });

    return {
      ...stats,
      programBreakdown: programStats,
    };
  },
});

// Get students enrolled in a specific time period
export const getStudentsEnrolledInPeriod = query({
  args: {
    startDate: v.number(),
    endDate: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("students")
      .filter((q) =>
        q.and(
          q.eq(q.field("isActive"), true),
          q.gte(q.field("enrollmentDate"), args.startDate),
          q.lte(q.field("enrollmentDate"), args.endDate)
        )
      )
      .order("desc")
      .collect();
  },
});

// Helper function to generate student ID
async function generateStudentId(ctx: QueryCtx | MutationCtx): Promise<string> {
  const count = await ctx.db
    .query("students")
    .filter((q) => q.eq(q.field("isActive"), true))
    .collect();
  
  const nextNumber = count.length + 1;
  return `ALB-STD-${String(nextNumber).padStart(3, '0')}`;
}

export const generateUploadUrl = mutation({
    handler: async (ctx) => {
      return await ctx.storage.generateUploadUrl();
    },
});
