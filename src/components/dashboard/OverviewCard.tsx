"use client";
import { Icons } from "@/components/Icons";
import { FC } from "react";
import { Card, CardContent } from "../ui/card";
import { trpc } from "@/app/_trpc/client";
import Skeleton from "react-loading-skeleton";

interface OverviewCardProps { }

const OverviewCard: FC<OverviewCardProps> = ({ }) => {


  const { data, isLoading } = trpc.analytics.getDashboardAnalytics.useQuery()
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
      <Card>
        <CardContent className="p-6 flex justify-between items-center">
          <div>
            <h4 className="text-lg font-semibold text-slate-700 mb-2 leading-none">
              {
                isLoading ? <Skeleton count={1} height={18} width={60} /> : data?.leadsCount || 0
              }
            </h4>
            <p className="text-sm leading-4 space-y-2">
              {
                isLoading ? <Skeleton count={1} height={20} width={100} /> : "Total Leads"
              }</p>
            <div className="badge flex items-center justify-center max-w-[70px] text-xs p-1 mt-4 rounded-md text-green-900  bg-opacity-50 bg-green-200  space-x-1">
              {" "}
              <span>10%</span>
              <Icons.Leads />
            </div>
          </div>
          <div>
            <span className="text-lg text-white rounded-full flex items-center justify-center h-12 w-12 shrink-0 bg-green-500">
              <Icons.GrowthChart />
            </span>
          </div>
        </CardContent>
      </Card>


      {/* second card */}
      <Card>
        <CardContent className="p-6 flex justify-between items-center">
          <div>
            <h4 className="text-lg font-semibold text-slate-700 mb-2 leading-none">
              {
                isLoading ? <Skeleton count={1} height={18} width={60} /> : data?.avgDailyLeadsCount || 0
              }
            </h4>
            <p className="text-sm leading-4">
              {
                isLoading ? <Skeleton count={1} height={18} width={100} /> : "Average Daily Leads"
              }</p>
            <div className="badge flex items-center justify-center max-w-[70px] text-xs p-1 mt-4 rounded-md text-purple-900  bg-opacity-50 bg-purple-200  space-x-1">
              <span>30%</span>
              <Icons.Sales />
            </div>
          </div>
          <div>
            <span className="text-lg text-white rounded-full flex items-center justify-center h-12 w-12 shrink-0 bg-purple-500">
              <Icons.GrowthChart />
            </span>
          </div>
        </CardContent>
      </Card>

      {/* thired card */}
      <Card>
        <CardContent className="p-6 flex justify-between items-center">
          <div>
            <h4 className="text-lg font-semibold text-slate-700 mb-2 leading-none">
              {
                isLoading ? <Skeleton count={1} height={18} width={60} /> : data?.newCustomersCount || 0
              }
            </h4>
            <p className="text-sm leading-4">
              {
                isLoading ? <Skeleton count={1} height={18} width={100} /> : "New Customers This Month"
              }
            </p>
            <div className="badge flex items-center justify-center max-w-[70px] text-xs p-1 mt-4  rounded-md text-blue-900  bg-opacity-50 bg-blue-200  space-x-1">
              <span>13%</span>
              <Icons.Customers />
            </div>
          </div>
          <div>
            <span className="text-lg text-white rounded-full flex items-center justify-center h-12 w-12 shrink-0 bg-blue-500">
              <Icons.GrowthChart />
            </span>
          </div>
        </CardContent>
      </Card>

    </div>
  );
};

export default OverviewCard;