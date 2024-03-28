import { SubMenuTypes } from "@/types";
import { AreaChart, BarChartBig, Circle, Folders, LayoutDashboard, Settings, UserRoundCog } from "lucide-react";
import { BsPerson } from "react-icons/bs";
// import { MdDashboard, MdLeaderboard } from "react-icons/md";
import { RiBuilding3Line } from "react-icons/ri";
import { TbReportAnalytics } from "react-icons/tb";

export const Menus = [
  { label: "Dashboard", icon: LayoutDashboard, url: "/dashboard" },
  { label: "Leads", icon: BarChartBig, url: "/leads", gap: true },
];
export const singleMenu = [
  {
    label: "Media",
    icon: Folders,
    url: "/media",
    gap: true,
  },
  {
    label: "Profile",
    icon: BsPerson,
    url: "/user/profile",
  },
  {
    label: "Settings",
    icon: Settings,
    url: "/settings",
  },
];

export const subMenusList: SubMenuTypes[] = [
  {
    name: "admin",
    label: "Admin",
    icon: UserRoundCog,
    menus: [
      {
        id: "1",
        label: "All Users",
        url: "/admin/users",
        icon: Circle,
      },
      {
        id: "2",
        label: "All Users Leads",
        url: "/admin/users-leads",
        icon: Circle,
      },
      {
        id: "3",
        label: "All Users Campaigns",
        url: "/admin/users-campaigns",
        icon: Circle,
      },
      {
        id: "4",
        label: "Assign Notifications",
        url: "/admin/notifications",
        icon: Circle,
      },
    ],
    isAdmin: true,
  },
  {
    name: "Products",
    label: "product",
    icon: RiBuilding3Line,
    menus: [
      {
        id: "1",
        label: "All Products",
        url: "/products",
        icon: Circle,
      },
      {
        id: "2",
        label: "New Products",
        url: "/products/create",
        icon: Circle,
      },
    ],
  },
  {
    name: "analytics",
    label: "campaign",
    icon: AreaChart,
    menus: [
      {
        id: "1",
        label: "Campaigns",
        url: "/campaigns",
        icon: Circle,
      },
      {
        id: "2",
        label: "New Campaign",
        url: "/campaigns/create",
        icon: Circle,
      },
    ],
  },
];
