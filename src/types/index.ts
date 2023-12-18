import { LucideIcon } from "lucide-react";
import { IconType } from "react-icons";

// sidebar submenu
interface MenuItem {
  id: string
  label: string;
  url: string;
}

export interface SubMenuTypes {
  name: string;
  label: string;
  icon: IconType | LucideIcon;
  menus: MenuItem[];
  isAdmin?: boolean
}
