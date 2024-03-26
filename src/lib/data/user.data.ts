import { db } from "@/db";

export async function getOnboardingDetails(userId: string | undefined) {
  try {
    if (!userId) return null;
    const companyDetails = await db.company.findFirst({ where: { user: { id: userId } } });
    return companyDetails;
  } catch (error) {
    return null;
  }
}

export async function getUserByUserId(userId: string | undefined) {
  try {
    if (!userId) return null;
    const user = await db.user.findUnique({ where: { id: userId } });
    return user;
  } catch (error) {
    return null;
  }
}
