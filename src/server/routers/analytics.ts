import { db } from "@/db";
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
});

export type AnalyticsRouter = typeof analyticsRouter;
