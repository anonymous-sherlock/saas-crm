import { LucideIcon } from "lucide-react";
import { IconType } from "react-icons";
import { type FileWithPath } from "react-dropzone";
import { Prisma } from "@prisma/client";
import { getMedia } from "@/lib/actions/media.action";
import { Table } from "@tanstack/react-table";
export type FileWithPreview = FileWithPath & {
  preview: string;
};

// sidebar submenu
interface MenuItem {
  id: string;
  label: string;
  url: string;
  icon?: IconType | LucideIcon;
}

export interface SubMenuTypes {
  name: string;
  label: string;
  icon: IconType | LucideIcon;
  menus: MenuItem[];
  isAdmin?: boolean;
}

export interface SearchParams {
  [key: string]: string | string[] | undefined;
}

export interface ResetPasswordCookie {
  email: string;
  count: number;
}

export interface NotificaionSearchParams extends SearchParams {
  notification?: string;
}

export type GetMediaFiles = Prisma.PromiseReturnType<typeof getMedia>;

export type UploadThingEndpoint = "productImages" | "avatar";

export type Option = {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
};

type NestedKey<T> = T extends object ? `${string & keyof T}.${string}` : never;

export interface DataTableSearchableColumn<TData> {
  id: keyof TData | NestedKey<TData>
  title: string;
}
export interface DataTableFilterableColumn<TData> extends DataTableSearchableColumn<TData> {
  options: Option[];
}
export interface DataTableVisibleColumn<TData> {
  id: keyof TData;
  value: boolean;
}

export interface ProductsPageSearchParams extends SearchParams {
  date?: string;
}

interface DataTableButtonProps<TData> {
  table: Table<TData>;
}
export type DataTableDownloadRowsButtonType<TData> = React.ComponentType<DataTableButtonProps<TData>>;
export type DataTableDeleteRowsButtonType<TData> = React.ComponentType<DataTableButtonProps<TData>>;
