import { LucideIcon } from "lucide-react";
import { IconType } from "react-icons";

export interface NavItem {
  title: string
  href?: string
  disabled?: boolean
  external?: boolean
  icon?: IconType | LucideIcon;
  label?: string
}

export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[]
}

interface DocsConfig {
  mainNav: MainNavItem[]
  sidebarNav: SidebarNavItem[]
}

export const docsConfig: DocsConfig = {
  mainNav: [
    {
      title: "Documentation",
      href: "/docs",
    },
    {
      title: "Linkedin",
      href: "https://in.linkedin.com/",
      external: true,
    },
    {
      title: "Twitter",
      href: "https://twitter.com/",
      external: true,
    },
  ],
  sidebarNav: [
    {
      title: "Getting Started",
      items: [
        {
          title: "Introduction",
          href: "/docs",
          items: [],
        },
        {
          title: "Changelog",
          href: "/docs/changelog",
          items: [],
        },
        {
          title: "About",
          href: "/docs/about",
          items: [],
        },
      ],
    },
    {
      title: "Products",
      items: [
        {
          title: "Add Product",
          href: "/docs/products/create",
          items: [],
        },
        {
          title: "Edit Product",
          href: "/docs/products/edit",
          items: [],
        },
        {
          title: "View All Products",
          href: "/docs/products",
          items: [],
        },

      ],
    },
    {
      title: "Campaigns",
      items: [
        {
          title: "Add a Campaigns",
          href: "/docs/campaigns/create",
          items: [],
        },
        {
          title: "Campaigns Leads",
          href: "/docs/campaigns/leads",
          items: [],
        },
        {
          title: "Campaigns Statistics",
          href: "/docs/campaigns/statistics",
          items: [],
        },
        {
          title: "View Campaigns Status",
          href: "/docs/campaigns/status",
          items: [],
        },
      ],
    },
  ],
}

export interface MainNavItem extends NavItem { }

export interface SidebarNavItem extends NavItemWithChildren { }