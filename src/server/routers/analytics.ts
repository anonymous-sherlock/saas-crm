import { db } from "@/db";
import { calculatePercentage } from "@/lib/utils";
import { privateProcedure, router } from "@/server/trpc";
import { z } from "zod";
import { startOfWeek, previousDay, startOfDay, endOfMonth, endOfDay, startOfMonth, endOfWeek, subMonths, differenceInDays, subDays } from "date-fns";
import { UserRoundIcon } from "lucide-react";

export const analyticsRouter = router({
  getCampaignAnalytics: privateProcedure
    .input(
      z.object({
        campaignId: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const now = new Date();
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      const leads = await db.lead.findMany({
        where: {
          createdAt: {
            gte: new Date(oneDayAgo.getTime()),
            lt: new Date(now.getTime()),
          },
          userId: ctx.userId,
          campaignId:input.campaignId
        },
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          createdAt: true,
        },
      });

      // Organize data for the AreaChart
      const hourlyCounts = Array.from({ length: 24 }, (_, index) => {
        const hourStart = new Date(oneDayAgo.getTime() + index * 60 * 60 * 1000);
        const hourEnd = new Date(oneDayAgo.getTime() + (index + 1) * 60 * 60 * 1000);
        const count = leads.filter((lead) => lead.createdAt >= hourStart && lead.createdAt < hourEnd).length;

        const formattedHour = new Date(hourStart).toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          timeZone: "Asia/Kolkata", // Set the specific time zone for formatting
        });

        return {
          hours: `${formattedHour} - ${new Date(hourEnd).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            timeZone: "Asia/Kolkata",
          })}`,
          total: count,
        };
      });

      return hourlyCounts;
    }),

  getDashboardAnalytics: privateProcedure.query(async ({ ctx }) => {
    const userId = ctx.userId;
    const now = new Date();

    // Calculate start and end of the current day
    const dayStart = startOfDay(now);
    const dayEnd = endOfDay(now);

    // Calculate start of the current month
    const monthStart = startOfMonth(now);

    // Calculate start and end of the current week
    const weekStart = startOfWeek(now);
    const weekEnd = endOfWeek(now);

    const [leadsCount, todaysLeads, newCustomersCount, weeklyLeads, monthlyLeads] = await db.$transaction([
      db.lead.count({ where: { userId } }),
      db.lead.count({ where: { userId, createdAt: { gte: dayStart, lt: dayEnd } } }),
      db.lead.findMany({
        where: { userId, createdAt: { gte: monthStart } },
        distinct: ["phone"],
        select: {
          id: true,
        },
      }),
      db.lead.count({ where: { userId, createdAt: { gte: weekStart, lt: weekEnd } } }),

      db.lead.count({ where: { userId: userId, createdAt: { gte: monthStart } } }),
    ]);

    // prev month
    const prevMonthStart = startOfMonth(subMonths(now, 1));
    const prevMonthEnd = endOfMonth(subMonths(now, 1));

    const newCustomersCountPreviousMonth = await db.lead.findMany({
      where: {
        userId,
        createdAt: {
          gte: prevMonthStart,
          lt: prevMonthEnd,
        },
      },
      distinct: ["phone"],
      select: {
        id: true,
      },
    });
    const newCustomerPercentagethisMonth = calculatePercentage(newCustomersCountPreviousMonth.length, newCustomersCount.length);
    return {
      leads: {
        count: leadsCount,
        thisWeek: weeklyLeads,
        thisMonth: monthlyLeads,
      },
      dailyLeads: {
        count: todaysLeads,
      },
      newCustomer: {
        percentage: newCustomerPercentagethisMonth,
        count: newCustomersCount.length,
      },
    };
  }),

  getCampaignName: privateProcedure.query(async ({ ctx }) => {
    const campaign = await db.campaign.findMany({
      where: {
        userId: ctx.userId,
      },
      select: {
        name: true,
        id: true,
      },
    });

    return campaign;
  }),

  get2CampaignAnalytics: privateProcedure
    .input(
      z.object({
        campaignId1: z.string().optional(),
        campaignId2: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      let { campaignId1, campaignId2 } = input;
      let campaignName1: string | undefined, campaignName2: string | undefined;

      const now = new Date();
      const oneDayAgo = subDays(now, 1);


      if (!campaignId1 && !campaignId2) {
        const campaigns = await db.campaign.findMany({
          where: {
            userId: ctx.userId,
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 2,
          select: {
            id: true,
            name: true,
          },
        });
        campaignId1 = campaigns[0]?.id;
        campaignName1 = campaigns[0]?.name;
        campaignId2 = campaigns[1]?.id;
        campaignName2 = campaigns[1]?.name;
      }

      const leads1 = await db.lead.findMany({
        where: {
          createdAt: {
            gte: new Date(oneDayAgo.getTime()),
            lt: new Date(now.getTime()),
          },
          campaignId: campaignId1,
          userId: ctx.userId,
        },
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          createdAt: true,
          campaign: {
            select: {
              id: true,
              name: true,
            },
          }
        },
      });

      const leads2 = await db.lead.findMany({
        where: {
          createdAt: {
            gte: new Date(oneDayAgo.getTime()),
            lt: new Date(now.getTime()),
          },
          campaignId: campaignId2,
          userId: ctx.userId,
        },
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          createdAt: true,
          campaign: {
            select: {
              id: true,
              name: true,
            },
          }
        },
      });
      // Organize data for the AreaChart
      const hourlyCounts = Array.from({ length: 24 }, (_, index) => {
        const hourStart = new Date(oneDayAgo.getTime() + index * 60 * 60 * 1000);
        const hourEnd = new Date(oneDayAgo.getTime() + (index + 1) * 60 * 60 * 1000);
        const count1 = leads1.filter((lead) => lead.createdAt >= hourStart && lead.createdAt < hourEnd).length;
        const count2 = leads2.filter((lead) => lead.createdAt >= hourStart && lead.createdAt < hourEnd).length;

        const formattedHour = new Date(hourStart).toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          timeZone: "Asia/Kolkata", // Set the specific time zone for formatting
        });

        return {
          hours: `${formattedHour} - ${new Date(hourEnd).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            timeZone: "Asia/Kolkata",
          })}`,
          c1: { total: count1, name: leads1[0]?.campaign.name || campaignName1 },
          c2: { total: count2, name: leads2[0]?.campaign.name || campaignName2 },
        };
      });

      // console.log(hourlyCounts);
      return hourlyCounts;
    }),
});

export type AnalyticsRouter = typeof analyticsRouter;
