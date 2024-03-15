import { SubMenuTypes } from "@/types";
import { BarChartBig, Folders, LayoutDashboard, Settings, UserRoundCog } from "lucide-react";
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
      },
      {
        id: "2",
        label: "All Users Campaigns",
        url: "/admin/user-campaigns",
      },
      {
        id: "3",
        label: "Notifications",
        url: "/admin/notifications",
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
      },
      {
        id: "2",
        label: "New Products",
        url: "/products/create",
      },
    ],
  },
  {
    name: "analytics",
    label: "campaign",
    icon: TbReportAnalytics,
    menus: [
      {
        id: "1",
        label: "Campaigns",
        url: "/campaigns",
      },
      {
        id: "2",
        label: "New Campaign",
        url: "/campaigns/create",
      },
    ],
  },
];
