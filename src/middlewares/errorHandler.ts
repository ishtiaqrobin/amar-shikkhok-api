import { NextFunction, Request, Response } from "express";
import { Prisma } from "../../generated/prisma/client";

interface ErrorResponse {
  success: false;
  message: string;
  statusCode: number;
  error?: any;
  stack?: string;
}

function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal server error";
  let error: any = {};

  // Log error for debugging
  console.error("Error:", {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString(),
  });

  // Prisma Client Known Request Error
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    statusCode = 400;

    switch (err.code) {
      case "P2002":
        // Unique constraint violation
        const target = err.meta?.target as string[];
        message = `Duplicate value for ${target?.join(", ") || "field"}. This value already exists.`;
        error = {
          code: err.code,
          field: target,
        };
        break;

      case "P2025":
        // Record not found
        statusCode = 404;
        message = "Record not found";
        error = {
          code: err.code,
        };
        break;

      case "P2003":
        // Foreign key constraint failed
        message = "Related record not found";
        error = {
          code: err.code,
          field: err.meta?.field_name,
        };
        break;

      case "P2014":
        // Required relation violation
        message = "Invalid relation. Related record is required.";
        error = {
          code: err.code,
        };
        break;

      default:
        message = "Database operation failed";
        error = {
          code: err.code,
          meta: err.meta,
        };
    }
  }

  // Prisma Validation Error
  else if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    message = "Invalid data provided";
    error = {
      type: "ValidationError",
      details: err.message,
    };
  }

  // Prisma Initialization Error
  else if (err instanceof Prisma.PrismaClientInitializationError) {
    statusCode = 503;
    message = "Database connection failed";
    error = {
      type: "DatabaseError",
    };
  }

  // Zod Validation Error
  else if (err.name === "ZodError") {
    statusCode = 400;
    message = "Validation failed";
    error = {
      type: "ValidationError",
      errors: err.errors?.map((e: any) => ({
        field: e.path.join("."),
        message: e.message,
      })),
    };
  }

  // JWT Errors
  else if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
    error = {
      type: "AuthenticationError",
    };
  } else if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired";
    error = {
      type: "AuthenticationError",
    };
  }

  // Multer Errors (file upload)
  else if (err.name === "MulterError") {
    statusCode = 400;
    message = `File upload error: ${err.message}`;
    error = {
      type: "FileUploadError",
      code: err.code,
    };
  }

  // Custom Application Errors
  else if (err.isOperational) {
    statusCode = err.statusCode || 400;
    message = err.message;
    error = err.error || {};
  }

  // Syntax Errors
  else if (err instanceof SyntaxError && "body" in err) {
    statusCode = 400;
    message = "Invalid JSON format";
    error = {
      type: "SyntaxError",
    };
  }

  // Build error response
  const errorResponse: ErrorResponse = {
    success: false,
    message,
    statusCode,
  };

  // Add error details in development mode
  if (process.env.NODE_ENV === "development") {
    errorResponse.error = error;
    errorResponse.stack = err.stack;
  } else {
    // In production, only include safe error details
    if (Object.keys(error).length > 0) {
      errorResponse.error = error;
    }
  }

  // Send response
  res.status(statusCode).json(errorResponse);
}

export default errorHandler;
