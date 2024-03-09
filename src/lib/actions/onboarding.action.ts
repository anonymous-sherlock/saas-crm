"use server";
import { db } from "@/db";
import { CompanyDetailsSchema, CompanyDetailsType } from "@/schema/company.schema";
import { getActorUser, getCurrentUser } from "../auth";

export async function addCompanyDetails(rawdata: CompanyDetailsType) {
    const user = await getCurrentUser();
    if (!user) return { error: "Unauthorized: Please log in to your account" };
    const actor = await getActorUser(user)
    const parsedData = CompanyDetailsSchema.safeParse(rawdata)
    if (!parsedData.success) return { error: "Invalid data passed. Please check the provided information." };

    const existingCompany = await db.company.findFirst({ where: { user: { id: actor ? actor.userId : user.id }, } })
    if (!existingCompany) {
        const newCompany = await db.company.create({
            data: {
                ...parsedData.data,
                user: { connect: { id: actor ? actor.userId : user.id } },
                notification: {
                    create: {
                        userId: actor ? actor.userId : user.id,
                        message: `Congratulations, ${actor ? actor.actorName : user.name}! Your company ${parsedData.data.name} has been successfully onboarded. We're excited to have you on board.`,
                    }
                }
            }
        })
        return { success: `Congratulations, ${actor ? actor.actorName : user.name}! Your company ${newCompany.name} has been successfully onboarded` }
    }
    return upsertCompanyDetails(parsedData.data)
}


export async function upsertCompanyDetails(rawdata: Partial<CompanyDetailsType>) {
    const user = await getCurrentUser();
    if (!user) return { error: "Unauthorized: Please log in to your account" };
    const actor = await getActorUser(user)
    const parsedData = CompanyDetailsSchema.partial().safeParse(rawdata)
    const companyId = actor ? actor.company.id : user.company.id
    try {
        if (!parsedData.success) return { error: "Invalid data passed. Please check the provided information." };
        const updatedCompanyDetails = await db.company.update({
            where: { id: companyId },
            data: parsedData.data,
        })
        return { success: `${actor ? actor.actorName + "'s" : "Your"} Company ${updatedCompanyDetails.name} details have been successfully updated.`, };

    } catch (error) {
        return { error: "Uh oh! Something went wrong." }
    }
}