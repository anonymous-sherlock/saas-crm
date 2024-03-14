import { LucideIcon } from "lucide-react";
import { IconType } from "react-icons";

import { type FileWithPath } from "react-dropzone"
import { Prisma } from "@prisma/client";
import { getMedia } from "@/lib/actions/media.action";
export type FileWithPreview = FileWithPath & {
  preview: string
}

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

export interface SearchParams {
  [key: string]: string | string[] | undefined
}

export interface ResetPasswordCookie {
  email: string,
  count: number
}

export interface NotificaionSearchParams extends SearchParams {
  notification?: string
}


export type GetMediaFiles = Prisma.PromiseReturnType<typeof getMedia>


export type UploadThingEndpoint = "productImages" | "avatar"

