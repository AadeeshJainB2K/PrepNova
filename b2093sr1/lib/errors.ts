/**
 * Custom Error Classes
 * 
 * Provides typed error classes for better error handling throughout the application
 */

/**
 * Base application error class
 */
export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Validation error for invalid input data
 */
export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400, "VALIDATION_ERROR");
  }
}

/**
 * Database operation error
 */
export class DatabaseError extends AppError {
  constructor(message: string, originalError?: unknown) {
    super(message, 500, "DATABASE_ERROR");
    if (originalError instanceof Error) {
      this.stack = originalError.stack;
    }
  }
}

/**
 * Rate limit exceeded error
 */
export class RateLimitError extends AppError {
  constructor(
    message: string = "Too many requests",
    public resetTime?: number
  ) {
    super(message, 429, "RATE_LIMIT_ERROR");
  }
}

/**
 * Authentication error
 */
export class AuthenticationError extends AppError {
  constructor(message: string = "Authentication required") {
    super(message, 401, "AUTHENTICATION_ERROR");
  }
}

/**
 * Authorization error
 */
export class AuthorizationError extends AppError {
  constructor(message: string = "Insufficient permissions") {
    super(message, 403, "AUTHORIZATION_ERROR");
  }
}

/**
 * Resource not found error
 */
export class NotFoundError extends AppError {
  constructor(resource: string = "Resource") {
    super(`${resource} not found`, 404, "NOT_FOUND_ERROR");
  }
}

/**
 * Error handler utility
 * 
 * Converts errors to consistent API responses
 * 
 * @param error - Error to handle
 * @returns Object with error message and status code
 * 
 * @example
 * ```ts
 * try {
 *   // ... operation
 * } catch (error) {
 *   const { message, statusCode } = handleError(error);
 *   return NextResponse.json({ error: message }, { status: statusCode });
 * }
 * ```
 */
export function handleError(error: unknown): {
  message: string;
  statusCode: number;
  code?: string;
} {
  if (error instanceof AppError) {
    return {
      message: error.message,
      statusCode: error.statusCode,
      code: error.code,
    };
  }

  if (error instanceof Error) {
    console.error("Unhandled error:", error);
    return {
      message: process.env.NODE_ENV === "development" 
        ? error.message 
        : "An unexpected error occurred",
      statusCode: 500,
      code: "INTERNAL_ERROR",
    };
  }

  return {
    message: "An unexpected error occurred",
    statusCode: 500,
    code: "UNKNOWN_ERROR",
  };
}
