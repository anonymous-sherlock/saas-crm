"use server";
import { db } from "@/db";
import { CompanyDetailsSchema, CompanyDetailsType } from "@/schema/company.schema";
import { getActorUser, getCurrentUser } from "../auth";
import { getCompanyByCompanyId } from "../data/company.data";

interface CreateCompanyProps {
  data: CompanyDetailsType;
  userId: string;
}
export async function createCompany({ data, userId }: CreateCompanyProps) {
  const parsedData = CompanyDetailsSchema.safeParse(data);
  const user = await db.user.findFirst({ where: { id: userId } });
  if (!user) return { error: "User not found" };
  if (!parsedData.success) return { error: "Invalid data passed. Please check the provided information." };
  const newCompany = await db.company.create({
    data: {
      ...parsedData.data,
      user: { connect: { id: userId } },
      notification: {
        create: {
          userId: userId,
          message: `Congratulations, ${user.name}! Your company ${parsedData.data.name} has been successfully onboarded. We're excited to have you on board.`,
        },
      },
    },
  });
  return { success: `Congratulations, ${user.name}! Your company ${newCompany.name} has been successfully onboarded` };
}

interface AddCompanyDetailsProps {
  data: CompanyDetailsType;
  userId?: string;
}
export async function addCompanyDetails({ data, userId: userIdProps }: AddCompanyDetailsProps) {
  const user = await getCurrentUser();
  if (!user) return { error: "Unauthorized: Please log in to your account" };
  const actor = await getActorUser(user);
  const userId = userIdProps ? userIdProps : actor ? actor.userId : user.id;
  const existingCompany = await db.company.findFirst({ where: { user: { id: userId } } });
  if (!existingCompany) {
    const res = await createCompany({ data, userId });
    return res.success ? { success: res.success } : { error: res.error };
  }
  return upsertCompanyDetails({ data: data, companyId: existingCompany.id });
}

interface upsertCompanyDetailsProps {
  data: Partial<CompanyDetailsType>;
  companyId: string;
}

export async function upsertCompanyDetails({ data: rawdata, companyId }: upsertCompanyDetailsProps) {
  const user = await getCurrentUser();
  if (!user) return { error: "Unauthorized: Please log in to your account" };
  const parsedData = CompanyDetailsSchema.partial().safeParse(rawdata);
  if (!parsedData.success) return { error: "Invalid data passed. Please check the provided information." };

  try {
    const existingCompany = await getCompanyByCompanyId(companyId);
    if (!existingCompany) return { error: "Company not Found" };
    const updatedCompanyDetails = await db.company.update({
      where: { id: companyId },
      data: parsedData.data,
      include: { user: { select: { name: true } } },
    });
    if (!updatedCompanyDetails) return { error: "Failed to update company details" };

    const username = updatedCompanyDetails.user?.name;
    const companyName = updatedCompanyDetails.name;
    return { success: `Congratulations, ${user.name}! your company ${companyName} details has been successfully updated` };
  } catch (error) {
    console.error("Error occurred during upsertCompanyDetails:", error);
    return { error: "Uh oh! Something went wrong." };
  }
}
