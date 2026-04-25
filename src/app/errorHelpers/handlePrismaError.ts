import { Prisma } from "../../generated/prisma";
import { TErrorResponse, TErrorSources } from "../interfaces/error.interface";
import status from "http-status";

export const handlePrismaKnownRequestError = (
  err: Prisma.PrismaClientKnownRequestError,
): TErrorResponse => {
  let statusCode: number = status.BAD_REQUEST;
  let message = "Prisma Known Request Error";
  let errorSources: TErrorSources[] = [];

  if (err.code === "P2002") {
    statusCode = status.CONFLICT;
    const target = err.meta?.target as string[];
    // message = "Duplicate Key Error";
    message = `Duplicate value for ${target?.join(", ") || "field"}. This value already exists.`;
    errorSources = [
      {
        path: target?.join(", ") || "",
        message: `${target?.join(", ") || "Field"} already exists`,
      },
    ];
  } else if (err.code === "P2025") {
    statusCode = status.NOT_FOUND;
    message = "Record Not Found";
    errorSources = [
      {
        path: "",
        message: (err.meta?.cause as string) || "Record not found",
      },
    ];
  } else if (err.code === "P2003") {
    statusCode = status.BAD_REQUEST;
    message = "Foreign Key Constraint Error";
    errorSources = [
      {
        path: "",
        message: "A related record was not found or is still connected",
      },
    ];
  } else {
    message = err.message;
    errorSources = [
      {
        path: "",
        message: err.message,
      },
    ];
  }

  return {
    statusCode,
    success: false,
    message,
    errorSources,
    error: err,
  };
};

export const handlePrismaValidationError = (
  err: Prisma.PrismaClientValidationError,
): TErrorResponse => {
  const statusCode: number = status.BAD_REQUEST;
  const message = "Prisma Validation Error";
  const errorSources: TErrorSources[] = [
    {
      path: "",
      message: err.message,
    },
  ];

  return {
    statusCode,
    success: false,
    message,
    errorSources,
    error: err,
  };
};
