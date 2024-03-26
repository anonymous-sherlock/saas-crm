"use client";
import { trpc } from "@/app/_trpc/client";
import Skeleton from "react-loading-skeleton";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { DatePickerWithRange } from "./DatePicker";

interface CampaignAnalyticsChartProps {
  campaignId: string;
}

const data = [
  { hours: "1:00 - 3:00 PM", total: 2 },
  { hours: "3:00 - 5:00 PM", total: 8 },
  { hours: "5:00 - 7:00 PM", total: 40 },
  { hours: "7:00 - 9:00 PM", total: 1 },
  { hours: "9:00 - 11:00 PM", total: 50 },
  { hours: "11:00 - 1:00 AM", total: 50 },
  { hours: "1:00 - 3:00 AM", total: 12 },
  { hours: "3:00 - 5:00 AM", total: 80 },
  { hours: "5:00 - 7:00 AM", total: 200 },
  { hours: "7:00 - 9:00 AM", total: 50 },
  { hours: "9:00 - 11:00 AM", total: 150 },
  { hours: "11:00 - 1:00 PM", total: 150 },
];

export const CampaignAnalyticsChart = ({ campaignId }: CampaignAnalyticsChartProps) => {
  const { data, isLoading, isFetching } = trpc.analytics.getCampaignAnalytics.useQuery(
    { campaignId },
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  );

  return (
    <>
      <div className="flex flex-col md:flex-row gap-2 items-start justify-between md:items-center mb-2">
        <p className="font-medium">Compare Leads Performance</p>
      </div>
      {isFetching || isLoading || !data ? (
        <Skeleton height={400} className="my-4" count={1} />
      ) : (
        <div className="chart">
          <div style={{ overflowX: "auto" }}>
            <ResponsiveContainer width="100%" aspect={2 / 1}>
              <AreaChart width={730} height={250} data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id={"total"} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="40%" stopColor="#8884d8" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="hours" stroke="gray" allowDataOverflow width={400} fontSize={12} />
                <YAxis allowDataOverflow={true} axisLine={false} tickLine={true} tick={true} width={50} tickMargin={0} tickCount={6} />
                <CartesianGrid strokeDasharray="3 2" className="chartGrid" />
                <CartesianGrid strokeDasharray="4" />
                <CartesianGrid strokeDasharray="4 1" />
                <CartesianGrid strokeDasharray="4 1 2" />
                <Tooltip formatter={(value, name, props) => [value, "Leads"]} />

                <Area type="monotone" dataKey="total" stroke="#8884d8" fillOpacity={1} fill="url(#total)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </>
  );
};
