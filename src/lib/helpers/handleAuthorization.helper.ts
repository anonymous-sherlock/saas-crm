"use server";
import { db } from "@/db";
import { AuthorizationError } from "@/types/api-type";

type HandleAutorizationType = {
  apiKey: string | null;
  bearerToken: string | null;
};

type handleAuthorizationPromise = {
  userId: string
}

export async function handleAuthorization({ apiKey = "", bearerToken = "" }: HandleAutorizationType): Promise<handleAuthorizationPromise> {
  if (!apiKey) {
    throw new AuthorizationError("Unauthorized access", { success: false, error: "unauthorized", message: "Api key missing" });
  }
  const validApiKey = await db.apiKey.findFirst({
    where: {
      key: apiKey,
      active: true,
    },
  });
  if (!validApiKey) {
    throw new AuthorizationError("Unauthorized access", { success: false, error: "unauthorized", message: "Invalid Api key" });
  }
  if (!bearerToken) {
    throw new AuthorizationError("Unauthorized access", { success: false, error: "unauthorized", message: "Authorization header missing" });
  }
  const validBearerToken = await db.bearerToken.findFirst({
    where: {
      key: bearerToken,
      active: true,
    },
  });
  if (!validBearerToken) {
    throw new AuthorizationError("Unauthorized access", { success: false, error: "unauthorized", message: "Authorization header invalid" });
  }

  return {
    userId: validApiKey.userId || validBearerToken.userId
  }
}
