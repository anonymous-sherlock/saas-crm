"use server";
import { revalidatePath } from "next/cache";

export async function revalidatePage(path: string, type: "page" | "layout" = "page") {
  if (path) {
    revalidatePath(path, type);
    return { revalidated: true, now: Date.now() };
  }

  return {
    revalidated: false,
    now: Date.now(),
    message: "Missing path to revalidate",
  };
}
