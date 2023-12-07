import { SubMenuTypes } from "@/types";
import { BsPerson } from "react-icons/bs";
import { MdDashboard, MdLeaderboard } from "react-icons/md";
import { RiBuilding3Line } from "react-icons/ri";
import { SlSettings } from "react-icons/sl";
import { TbReportAnalytics } from "react-icons/tb";

export const Menus = [
  { label: "Dashboard", icon: MdDashboard, url: "/dashboard" },
  { label: "Leads", icon: MdLeaderboard, url: "/leads", gap: true },

];
export const singleMenu = [
  {
    label: "Profile",
    icon: BsPerson,
    url: "/user/profile",
    gap: true,
  },
  {
    label: "Settings",
    icon: SlSettings,
    url: "/user/settings",
  },
  // {
  //   label: "Balance",
  //   icon: Wallet2,
  //   url: "/user/wallet",
  // },
];

export const subMenusList: SubMenuTypes[] = [
  {
    name: "Products",
    label:"product",
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
    label:"campaign",
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
