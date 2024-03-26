"use client";
import { trpc } from "@/app/_trpc/client";
import { useDashboardChartStore } from "@/store/dashboard";
import { FC, useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import ChartCampaignSelect from "./ChartCampaignSelect";
interface DashboardChartsProps {}
const data = [
  { hours: "1:00 - 3:00 PM", c1: { total: 2400 }, c2: { total: 500 } },
  { hours: "1:00 - 3:00 PM", c1: { total: 500 }, c2: { total: 45.0 } },
  { hours: "1:00 - 3:00 PM", c1: { total: 2400 }, c2: { total: 780 } },
  { hours: "1:00 - 3:00 PM", c1: { total: 2400 }, c2: { total: 500 } },
  { hours: "1:00 - 3:00 PM", c1: { total: 0 }, c2: { total: 40 } },
  { hours: "1:00 - 3:00 PM", c1: { total: 100 }, c2: { total: 500 } },
  { hours: "1:00 - 3:00 PM", c1: { total: 2300 }, c2: { total: 457 } },
  { hours: "1:00 - 3:00 PM", c1: { total: 5000 }, c2: { total: 1200 } },
];

export const DashboardCharts: FC<DashboardChartsProps> = ({}) => {
  const { data, isLoading, mutateAsync } = trpc.analytics.get2CampaignAnalytics.useMutation({});

  const { firstCampaignId, secondCampaignId } = useDashboardChartStore();

  useEffect(() => {
    mutateAsync({ campaignId1: "", campaignId2: "" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (firstCampaignId && secondCampaignId) {
      mutateAsync({ campaignId1: firstCampaignId ?? "", campaignId2: secondCampaignId ?? "" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondCampaignId, firstCampaignId]);

  const c1name = data && data.length > 0 ? data[0].c1.name : "Campaign 1";
  const c2name = data && data.length > 0 ? data[0].c2.name : "Campaign 2";
  return (
    <>
      <div className="flex flex-col md:flex-row gap-2 items-start justify-between md:items-center mb-2">
        <p className="font-medium">Compare Campaign Performance</p>
        <ChartCampaignSelect />
      </div>

      {/* charts start here */}

      {isLoading || !data ? (
        <Skeleton height={400} className="my-4" count={1} />
      ) : (
        <div className="chart">
          <div style={{ overflowX: "auto" }}>
            <ResponsiveContainer width="100%" aspect={2 / 1}>
              <AreaChart width={730} height={250} data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="c1.total" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="c2.total" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="hours" stroke="gray" allowDataOverflow width={400} fontSize={12} />
                <YAxis fontSize={12} />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip formatter={(value, name, props) => [value, name]} />
                <Area type="monotone" name={c1name} dataKey="c1.total" stroke="#8884d8" fillOpacity={1} fill="url(#c1.total)" />
                <Area type="monotone" name={c2name} dataKey="c2.total" stroke="#82ca9d" fillOpacity={1} fill="url(#c2.total)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </>
  );
};
