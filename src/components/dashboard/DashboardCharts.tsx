"use client"
import { FC } from 'react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
interface DashboardChartsProps {

}
const data = [
  { hours: "1:00 - 3:00 PM", c1: { total: 2400 }, c2: { total: 500 } },
  { hours: "1:00 - 3:00 PM", c1: { total: 500 }, c2: { total: 45.00 } },
  { hours: "1:00 - 3:00 PM", c1: { total: 2400 }, c2: { total: 780 } },
  { hours: "1:00 - 3:00 PM", c1: { total: 2400 }, c2: { total: 500 } },
  { hours: "1:00 - 3:00 PM", c1: { total: 0 }, c2: { total: 40 } },
  { hours: "1:00 - 3:00 PM", c1: { total: 100 }, c2: { total: 500 } },
  { hours: "1:00 - 3:00 PM", c1: { total: 2300 }, c2: { total: 457 } },
  { hours: "1:00 - 3:00 PM", c1: { total: 5000 }, c2: { total: 1200 } },

]


export const DashboardCharts: FC<DashboardChartsProps> = ({ }) => {

  return (
    <>
      <div className='flex flex-col md:flex-row gap-2 items-start justify-between md:items-center mb-2'>
        <p className="font-medium">Compare Campaign Performance</p>
      </div>

      {/* charts start here */}
      <div className="chart">
        <div style={{ overflowX: 'auto' }}>

          <ResponsiveContainer width="100%" aspect={2 / 1}>
            <AreaChart width={730} height={250} data={data}
              margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
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
              <Area type="monotone" name="Campaign 1" dataKey="c1.total" stroke="#8884d8" fillOpacity={1} fill="url(#c1.total)" />
              <Area type="monotone" name="Campaign 2" dataKey="c2.total" stroke="#82ca9d" fillOpacity={1} fill="url(#c2.total)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>

  )
}

