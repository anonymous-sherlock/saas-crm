import {
  Activity,
  CiCreditCard1,
  HelpCircle,
  HiOutlineUser,
  LifeBuoy,
  Settings,
} from "@/components/Icons";
import SignOutButton from "@/components/ui/SignOutButton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Separator } from "@/components/ui/separator";
import { UserAvatar } from "@/components/layouts/UserAvatar";
import { getAuthSession } from "@/lib/authOption";
import { generateInitialFromName } from "@/lib/utils";
import Link from "next/link";

export const UserProfileHover = async () => {
  const session = await getAuthSession();

  return (
    <HoverCard>
      {/* user image */}
      <HoverCardTrigger asChild>
        <div className="flex cursor-pointer items-center justify-start gap-2 border-y p-4">
          <Avatar>
            <AvatarImage
              src={session?.user.image as string}
              alt={session?.user.name as string}
            />
            <AvatarFallback>
              {generateInitialFromName(session?.user.name as string)}
            </AvatarFallback>
          </Avatar>
          <span className="truncate">
            <span className="block text-sm text-gray-900 dark:text-white">
              {session?.user.name}
            </span>
            <span className="block truncate text-sm text-gray-500 dark:text-gray-400">
              {session?.user.email}
            </span>
          </span>
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="m-0 w-fit p-0" side="right">
        <div className="">
          <div className="flex items-center justify-start gap-2 border-y p-4">
            {session?.user && <UserAvatar user={session.user} />}
            <div>
              <span className="block text-sm text-gray-900 dark:text-white">
                {session?.user.name}
              </span>
              <span className="block truncate  text-sm text-gray-500 dark:text-gray-400">
                {session?.user.email}
              </span>
            </div>
          </div>
        </div>
        <ul className="" aria-labelledby="user-menu-button">
          <li>
            <Link
              href="#"
              className="m-1 flex items-center justify-start gap-2 rounded-sm p-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              <HiOutlineUser size={16} className="mr-2 text-gray-400" />
              Profile
            </Link>
          </li>
          <li>
            <Link
              href="#"
              className="m-1 flex items-center justify-start gap-2 rounded-sm p-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              <CiCreditCard1 size={16} className="mr-2 text-gray-400" />
              Billing
            </Link>
          </li>
          <li>
            <Link
              href="#"
              className="m-1 flex items-center justify-start gap-2 rounded-sm p-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white "
            >
              <Settings size={16} className="mr-2 text-gray-400" />
              Settings
            </Link>
          </li>
          <li>
            <Link
              href="#"
              className="m-1 flex items-center justify-start gap-2 rounded-sm p-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white "
            >
              <Activity size={16} className="mr-2 text-gray-400" />
              Activity Log
            </Link>
          </li>
          <Separator className="my-1" />
          <li>
            <Link
              href="#"
              className="m-1 flex items-center justify-start gap-2 rounded-sm p-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white "
            >
              <LifeBuoy size={16} className="mr-2 text-gray-400" />
              Support
            </Link>
          </li>
          <li>
            <Link
              href="#"
              className="m-1 flex items-center justify-start gap-2 rounded-sm p-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white "
            >
              <HelpCircle size={16} className="mr-2 text-gray-400" />
              Help
            </Link>
          </li>
          <Separator className="my-1" />
          <li className="mx-1">
            <SignOutButton iconSize={16} className="w-full p-2 text-gray-400">
              Log out
            </SignOutButton>
          </li>
        </ul>
      </HoverCardContent>
    </HoverCard>
  );
};

export default UserProfileHover;
