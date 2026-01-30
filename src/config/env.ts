import { config } from "dotenv";

// Load environment variables
config();

// Validate required environment variables
const requiredEnvVars = [
  "DATABASE_URL",
  "BETTER_AUTH_SECRET",
  "BETTER_AUTH_URL",
  "APP_URL",
] as const;

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

// Export typed environment variables
export const env = {
  // Database
  DATABASE_URL: process.env.DATABASE_URL!,

  // Server
  PORT: parseInt(process.env.PORT || "5000", 10),
  NODE_ENV: process.env.NODE_ENV || "development",

  // Better Auth
  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET!,
  BETTER_AUTH_URL: process.env.BETTER_AUTH_URL!,
  APP_URL: process.env.APP_URL!,

  // Email (optional)
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,

  // Google OAuth (optional)
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,

  // Admin Seed
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || "admin@amarshikkhok.com",
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || "admin@123456",
  ADMIN_NAME: process.env.ADMIN_NAME || "Amar Shikkhok Admin",
} as const;

export type Env = typeof env;
