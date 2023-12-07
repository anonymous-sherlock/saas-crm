"use server";
import { db } from "@/db";
import { AuthorizationError } from "@/types/api-type";

type HandleAutorizationType = {
  apiKey: string | null;
  bearerToken: string | null;
};

export async function handleAuthorization({ apiKey = "", bearerToken = "" }: HandleAutorizationType) {
  if (!apiKey) {
    throw new AuthorizationError("Unauthorized access", { success: false, error: "unauthorized", message: "Api key missing" });
  }
  const validApiKey = await db.apiKey.findFirst({
    where: {
      key: apiKey,
      enabled: true,
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
}
