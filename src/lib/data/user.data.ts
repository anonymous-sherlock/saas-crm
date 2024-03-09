import { db } from "@/db";

export async function getOnboardingDetails(userId: string | undefined) {
    try {
        if (!userId) return null
        const companyDetails = await db.company.findFirst({ where: { user: { id: userId } } })
        return companyDetails;
    } catch (error) {
        return null
    }
}