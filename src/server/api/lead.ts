import { db } from "@/db";

type LeadApiArgs = {};
type LeadsGetAllArgs = {
  userId: string;
  date?: { from: Date | undefined; to: Date | undefined };
};
type GetAllUsersLeadsArgs = {
  date?: { from: Date | undefined; to: Date | undefined };
};

export class LeadApi {
  constructor(private readonly opts?: LeadApiArgs) {}
  async getAllLeads({ date, userId }: LeadsGetAllArgs) {
    try {
      const leads = await db.lead.findMany({
        orderBy: { createdAt: "desc" },
        where: {
          userId: userId,
          createdAt: {
            gte: date?.from,
            lte: date?.to,
          },
        },
        include: {
          campaign: {
            select: {
              name: true,
              code: true,
              id: true,
            },
          },
        },
      });

      return leads;
    } catch (error) {
      console.error("Error occurred during getAllLeads:", error);
      return [];
    }
  }

  async getAllUsersLeads({ date }: GetAllUsersLeadsArgs) {
    try {
      const leads = await db.lead.findMany({
        orderBy: { createdAt: "desc" },
        where: {
          createdAt: {
            gte: date?.from,
            lte: date?.to,
          },
        },
        include: {
          campaign: {
            select: {
              name: true,
              code: true,
              id: true,
              product: {
                include: {
                  images: {
                    include: {
                      media: true,
                    },
                  },
                },
              },
            },
          },
          user: {
            select: {
              name: true,
              id: true,
              email: true,
              image: true,
            },
          },
        },
      });

      return leads;
    } catch (error) {
      console.error("Error occurred during getAllUsersLeads:", error);
      return [];
    }
  }
}

export const lead = new LeadApi();
