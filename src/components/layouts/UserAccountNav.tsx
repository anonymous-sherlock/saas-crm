"use client";
import { Avatar } from "@nextui-org/react";
import { Gem } from "lucide-react";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { Icons } from "../Icons";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";

interface UserAccountNavProps {
  email: string | undefined;
  name: string;
  imageUrl: string;
  user: Session["user"];
}

const UserAccountNav = ({ email, imageUrl, name, user }: UserAccountNavProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar
          isBordered
          as="button"
          size="sm"
          className="transition-transform shrink-0"
          src={user?.image ? user.image : ""}
          fallback={<Icons.user className="h-4 w-4 text-zinc-900" />}
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent className="bg-white" align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-0.5 leading-none">
            {name && <p className="font-medium text-sm text-black">{name}</p>}
            {email && <p className="w-[200px] truncate text-xs text-zinc-700">{email}</p>}
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href="/dashboard" className="cursor-pointer">
            Dashboard
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/pricing" className="cursor-pointer">
            Upgrade <Gem className="text-blue-600 h-4 w-4 ml-1.5" />
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="cursor-pointer" onClick={() => signOut()}>
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAccountNav;
