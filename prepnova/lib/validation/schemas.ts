import { z } from "zod";

/**
 * Validation schemas for API routes using Zod
 * Provides type-safe input validation for all API endpoints
 */

// Chat API validation
export const chatMessageSchema = z.object({
  message: z.string().min(1, "Message cannot be empty").max(10000, "Message too long"),
  conversationId: z.string().uuid("Invalid conversation ID").optional(),
  attachments: z.array(z.object({
    fileName: z.string(),
    fileType: z.enum(["image", "document"]),
    mimeType: z.string(),
    fileSize: z.number().max(10 * 1024 * 1024, "File too large (max 10MB)"),
    fileUrl: z.string().url(),
  })).optional(),
});

// Mock test session creation
export const mockTestSessionSchema = z.object({
  examId: z.string().min(1, "Exam ID is required"),
  difficulty: z.enum(["Easy", "Medium", "Hard"]),
  model: z.string().min(1, "Model is required"),
});

// Mock test question generation
export const generateQuestionSchema = z.object({
  examId: z.string().min(1, "Exam ID is required"),
  examName: z.string().min(1, "Exam name is required"),
  difficulty: z.enum(["Easy", "Medium", "Hard"]),
  sessionId: z.string().uuid("Invalid session ID"),
});

// Mock test answer submission
export const submitAnswerSchema = z.object({
  sessionId: z.string().uuid("Invalid session ID"),
  questionId: z.string().uuid("Invalid question ID"),
  userAnswer: z.string().length(1, "Answer must be a single letter"),
  timeSpent: z.number().min(0, "Time spent cannot be negative"),
});

// Predictor analysis
export const predictorAnalysisSchema = z.object({
  examId: z.string().min(1, "Exam ID is required"),
  targetRank: z.number().min(1, "Target rank must be positive").max(1000000, "Target rank too high"),
});

// Marketplace order creation
export const createOrderSchema = z.object({
  items: z.array(z.object({
    productId: z.string().uuid("Invalid product ID"),
    quantity: z.number().min(1, "Quantity must be at least 1"),
  })).min(1, "Order must have at least one item"),
  shippingAddress: z.string().min(10, "Shipping address is required"),
});

// Product review
export const productReviewSchema = z.object({
  productId: z.string().uuid("Invalid product ID"),
  rating: z.number().min(1, "Rating must be at least 1").max(5, "Rating cannot exceed 5"),
  comment: z.string().min(10, "Review must be at least 10 characters").max(1000, "Review too long"),
});

/**
 * Validation helper function
 * 
 * @param schema - Zod schema to validate against
 * @param data - Data to validate
 * @returns Validation result with parsed data or error
 * 
 * @example
 * ```ts
 * const result = validateInput(chatMessageSchema, requestBody);
 * if (!result.success) {
 *   return NextResponse.json({ error: result.error }, { status: 400 });
 * }
 * const { message } = result.data;
 * ```
 */
export function validateInput<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: string } {
  try {
    const parsed = schema.parse(data);
    return { success: true, data: parsed };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessage = error.issues.map((e) => `${e.path.join(".")}: ${e.message}`).join(", ");
      return { success: false, error: errorMessage };
    }
    return { success: false, error: "Invalid input" };
  }
}
