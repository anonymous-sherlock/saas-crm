import { db } from "@/db";
import { Company } from "@prisma/client";

interface getCompanyDetailsArgs<T extends keyof Company> {
    pick?: T[];
}

export async function getCompanyDetails<T extends keyof Company>(
    companyId: string | undefined,
    args: getCompanyDetailsArgs<T> = {}
): Promise<Pick<Company, T> | null> {
    try {
        if (!companyId) return null;

        const companyDetails = await db.company.findFirst({
            where: { id: companyId },
            select: {
                ...(args.pick ? args.pick.reduce((acc, key) => ({ ...acc, [key]: true }), {}) : { id: true }),
            },
        });

        return companyDetails as unknown as Pick<Company, T> | null;
    } catch (error) {
        console.log(error);
        return null;
    }
}
