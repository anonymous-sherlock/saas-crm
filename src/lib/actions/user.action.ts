"use server";

import { db } from "@/db";
import { NewUserSchemaType, UserProfileFormSchema, UserProfileFormSchemaType, newUserSchema } from "@/schema/user.schema";
import { getCurrentUser } from "../auth";
import { getUserByUserId } from "../data/user.data";
import { allowedAdminRoles } from "../auth.permission";
import { nanoid } from "nanoid";
import { randomUUID } from "crypto";
import { hash } from "bcrypt";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function addNewUser(rawData: NewUserSchemaType) {
  try {
    const authUser = await getCurrentUser();
    if (!authUser) return { error: "Unauthorized: Please log in to your account" };
    const isAdmin = allowedAdminRoles.some((role) => role === authUser.role);
    if (!isAdmin) return { error: "Unauthorized: You don't have permission to add a new user" };
    const parsedData = newUserSchema.safeParse(rawData);
    if (!parsedData.success) return { error: parsedData.error.message ?? "Invalid data passed. Please check the provided information." };
    let { email, active, emailVerified, password, ...rest } = parsedData.data;
    const existingUser = await db.user.findUnique({ where: { email: email } });
    if (existingUser) return { error: "User with this email already exist" };
    const hashPassword = await hash(password, 16);

    const newUser = await db.user.create({
      data: {
        ...rest,
        email: email,
        active: active,
        emailVerified: emailVerified ? new Date() : undefined,
        password: hashPassword,
        wallet: { create: { balance: 0 } },
      },
    });
    revalidatePath("/admin/users");
    return { success: "User created successfully" };
  } catch (error) {
    console.error("Error occurred during addNewUser:", error);
    return { error: "Uh oh! Something went wrong." };
  }
}

const deleteUsersSchema = z.object({
  userIds: z.string({ required_error: "User Id is required to delete a user" }).array(),
});
export async function deleteUsers(rawData: z.infer<typeof deleteUsersSchema>) {
  try {
    const authUser = await getCurrentUser();
    if (!authUser) return { error: "Unauthorized: Please log in to your account" };
    const isAdmin = allowedAdminRoles.some((role) => role === authUser.role);
    if (!isAdmin) return { error: "Unauthorized: You don't have permission to add a delete user" };
    const parsedData = deleteUsersSchema.safeParse(rawData);
    if (!parsedData.success) return { error: parsedData.error.message ?? "Invalid data passed. Please check the provided information." };
    const { userIds } = parsedData.data;
    const users = await db.user.findMany({ where: { id: { in: userIds } } });
    if (!users) return { error: "User not found." };
    const deletedUsers = await db.user.deleteMany({ where: { id: { in: users.map((u) => u.id) } } });
    return { success: `Users have been deleted successfully` };
  } catch (error) {
    console.error("Error occurred during deleteUsers:", error);
    return { error: "Uh oh! Something went wrong." };
  }
}

export async function getUserProfile(userId: string) {
  try {
    const user = db.user.findFirst({
      where: { id: userId },
      include: {
        apiKeys: true,
        bearerTokens: true,
      },
    });

    return user;
  } catch (error) {
    console.error("Error occurred during getUserProfile:", error);
  }
}

interface updateUserProfileProps {
  data: UserProfileFormSchemaType;
  userId: string;
}
export async function updateUserProfile({ data, userId }: updateUserProfileProps) {
  const authUser = await getCurrentUser();
  if (!authUser) return { error: "Unauthorized: Please log in to your account" };
  const parsedData = UserProfileFormSchema.safeParse(data);
  if (!parsedData.success) return { error: parsedData.error.message ?? "Invalid data passed. Please check the provided information." };
  const user = await getUserByUserId(userId);
  if (!user) return { error: "User not found" };
  let { role, email, active, emailVerified, ...restData } = parsedData.data;
  const isAdmin = allowedAdminRoles.some((role) => role === authUser?.role);
  if (!isAdmin) {
    role = user.role;
    active = user.active;
    email = user.email;
  }
  try {
    const updateUserProfile = await db.user.update({
      where: { id: user.id },
      data: {
        ...restData,
        emailVerified: !user.emailVerified ? new Date() : undefined,
        email,
        role,
        active,
        notification: {
          create: {
            companyId: user.companyId,
            message: `Congratulations, ${user.name}! Your profile has been successfully updated.`,
          },
        },
      },
    });
    if (!updateUserProfile) return { error: "Failed to update User Profile details" };
    return { success: `Congratulations, ${user.name}! Your profile has been successfully updated` };
  } catch (error) {
    console.error("Error occurred during updateUserProfile:", error);
    return { error: "Uh oh! Something went wrong." };
  }
}

export async function getUserSecretKeys(userId: string) {
  const keys = await db.user.findUnique({
    where: { id: userId },
    select: {
      apiKeys: {
        where: {
          active: true,
        },
      },
      bearerTokens: {
        where: {
          active: true,
        },
      },
    },
  });
  return keys;
}

export async function generateNewApiKey(userId: string) {
  try {
    const user = await db.user.findFirst({ where: { id: userId } });
    if (!user) return { error: "User not found" };
    const existingApiKey = await db.apiKey.findFirst({ where: { userId: userId, active: true } });
    if (existingApiKey) {
      await db.apiKey.delete({ where: { id: existingApiKey.id } });
    }
    const newApiKey = await db.apiKey.create({
      data: {
        key: nanoid(32),
        active: true,
        userId: userId,
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });
    return { success: `Congratulations, ${newApiKey.user.name}! new api key succefully generated`, data: newApiKey };
  } catch (error) {
    console.error("Error occurred during generateNewApiKey:", error);
    return { error: "Uh oh! Something went wrong." };
  }
}

export async function generateNewBearerToken(userId: string) {
  try {
    const user = await db.user.findFirst({ where: { id: userId } });
    if (!user) return { error: "User not found" };
    const existingBearerToken = await db.bearerToken.findFirst({ where: { userId: userId, active: true } });
    if (existingBearerToken) {
      await db.bearerToken.delete({ where: { id: existingBearerToken.id } });
    }
    const newBearerToken = await db.bearerToken.create({
      data: {
        key: `${nanoid(32)}${randomUUID()}${randomUUID()}`.replace(/-/g, ""),
        active: true,
        userId: userId,
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });
    return { success: `Congratulations, ${newBearerToken.user.name}! new bearer token succefully generated`, data: newBearerToken };
  } catch (error) {
    console.error("Error occurred during generateNewBearerToken:", error);
    return { error: "Uh oh! Something went wrong.", data: null };
  }
}
