"use client";
import { Icons } from "@/components/Icons";
import { FC } from "react";
import { Card, CardContent } from "../ui/card";
import { trpc } from "@/app/_trpc/client";
import Skeleton from "react-loading-skeleton";
import { TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import { OverviewCount } from "./OverviewCount";

interface OverviewCardProps { }

const OverviewCard: FC<OverviewCardProps> = ({ }) => {


  const { data, isLoading, isFetched } = trpc.analytics.getDashboardAnalytics.useQuery()

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
      <Card>
        <CardContent className="p-6 flex justify-between items-center">
          <div>
            <h4 className="text-lg font-semibold text-slate-700 mb-2 leading-none">
              {
                isLoading ? <Skeleton count={1} height={18} width={60} /> : data?.leads.count || 0
              }
            </h4>
            <p className="text-sm leading-4 space-y-2">
              {
                isLoading ? <Skeleton count={1} height={20} width={100} /> : "Total Leads"
              }</p>
            {
              isLoading ? <Skeleton count={1} height={20} width={200} className="mt-2" /> :
                <OverviewCount value={data?.leads.thisMonth ?? 0} label="This month" />
            }

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
                isLoading ? <Skeleton count={1} height={18} width={60} /> : data?.dailyLeads.count || 0
              }
            </h4>
            <p className="text-sm leading-4">
              {
                isLoading ? <Skeleton count={1} height={18} width={100} /> : "Today's Leads"
              }</p>
            {
              isLoading ? <Skeleton count={1} height={20} width={200} className="mt-2" /> :
                <OverviewCount value={data?.leads.thisWeek ?? 0} label="This week" />
            }
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
                isLoading ? <Skeleton count={1} height={18} width={60} /> : data?.newCustomer.count || 0
              }
            </h4>
            <p className="text-sm leading-4">
              {
                isLoading ? <Skeleton count={1} height={18} width={100} /> : "New Customers This Month"
              }
            </p>
            {
              isLoading ? <Skeleton count={1} height={20} width={200} className="mt-2" /> :
                <div className={cn("flex items-center justify-center max-w-[70px] text-xs p-1 mt-4  rounded-md text-blue-900 bg-blue-100/80  space-x-1",
                  !(data && data?.newCustomer.percentage > 0) && "text-red-900  bg-red-100/80"
                )}>
                  <span>{data?.newCustomer.percentage || 0}%</span>
                  {
                    (data && data?.newCustomer.percentage > 0) ?
                      <TrendingUp className="w-4 h-4" />
                      :
                      <TrendingDown className="w-4 h-4" />

                  }

                </div>
            }

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