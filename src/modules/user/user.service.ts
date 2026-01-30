import { prisma } from "../../lib/prisma";
import { UpdateUserInput, ChangePasswordInput } from "./user.interface";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

// Get user profile
const getUserProfile = async (userId: string) => {
  const result = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      image: true,
      isActive: true,
      isBanned: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return result;
};

// Update user profile
const updateUserProfile = async (userId: string, data: UpdateUserInput) => {
  const result = await prisma.user.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      image: true,
      isActive: true,
      isBanned: true,
      updatedAt: true,
    },
  });

  return result;
};

// Hash password using scrypt (same as Better Auth)
const hashPassword = async (password: string): Promise<string> => {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${salt}:${derivedKey.toString("hex")}`;
};

// Verify password using scrypt (same as Better Auth)
const verifyPassword = async (
  password: string,
  hash: string,
): Promise<boolean> => {
  const [salt, key] = hash.split(":");

  if (!salt || !key) {
    return false;
  }

  const keyBuffer = Buffer.from(key, "hex");
  const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer;
  return timingSafeEqual(keyBuffer, derivedKey);
};

// Change password
const changePassword = async (userId: string, payload: ChangePasswordInput) => {
  const { oldPassword, newPassword } = payload;

  // Get user with password
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { password: true },
  });

  if (!user || !user.password) {
    throw new Error("User not found or password not set");
  }

  // Verify old password using scrypt (Better Auth uses scrypt)
  const isPasswordValid = await verifyPassword(oldPassword, user.password);

  if (!isPasswordValid) {
    throw new Error("Old password is incorrect");
  }

  // Hash new password using scrypt (same as Better Auth)
  const hashedPassword = await hashPassword(newPassword);

  // Update password
  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });

  return { message: "Password changed successfully" };
};

export const UserService = {
  getUserProfile,
  updateUserProfile,
  changePassword,
};
