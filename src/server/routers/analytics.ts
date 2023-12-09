import { db } from "@/db";
import { calculatePercentage } from "@/lib/utils";
import { privateProcedure, router } from "@/server/trpc";
import { z } from "zod";

export const analyticsRouter = router({
  getCampaignAnalytics: privateProcedure
    .input(
      z.object({
        campaignId: z.string(),
      }),
    )
    .query(async () => {
      const now = new Date();
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      const leads = await db.lead.findMany({
        where: {
          createdAt: {
            gte: new Date(oneDayAgo.getTime()),
            lt: new Date(now.getTime()),
          },
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

    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfNextDay = new Date(now);
    endOfNextDay.setDate(endOfNextDay.getDate() + 1);
    endOfNextDay.setHours(0, 0, 0, 0);

    const startOfMonth = new Date(now);
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const [leadsCount, avgDailyLeadsCount, newCustomersCount] = await db.$transaction([
      db.lead.count({
        where: {
          userId,
        },
      }),
      db.lead.count({
        where: {
          userId,
          createdAt: {
            gte: startOfDay,
            lt: endOfNextDay,
          },
        },
      }),
      db.lead.findMany({
        where: {
          userId,
          createdAt: {
            gte: startOfMonth,
          },
        },
        distinct: ["phone"],
      }),
    ]);
    const startOfPreviousMonth = new Date(startOfMonth);
    startOfPreviousMonth.setMonth(startOfPreviousMonth.getMonth() - 1);
    const endOfPreviousMonth = new Date(startOfMonth);
    endOfPreviousMonth.setDate(0); // Set to the last day of the previous month
    endOfPreviousMonth.setHours(0, 0, 0, 0);
    const newCustomersCountPreviousMonth = await db.lead.findMany({
      where: {
        userId,
        createdAt: {
          gte: startOfPreviousMonth,
          lt: endOfPreviousMonth,
        },
      },
      distinct: ["phone"],
    });
    console.log("prev month",newCustomersCountPreviousMonth.length)
    console.log("this  month",newCustomersCount.length)

    const newCustomersCountIncreasePercentage = calculatePercentage(newCustomersCountPreviousMonth.length, newCustomersCount.length);

    console.log(newCustomersCountIncreasePercentage);
    return {
      leadsCount,
      avgDailyLeadsCount,
      newCustomersCount: newCustomersCount.length,
    };
  }),
});

export type AnalyticsRouter = typeof analyticsRouter;

