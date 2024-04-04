import { Avatar } from "@nextui-org/react";
import { User } from "next-auth";
import { Icons } from "../Icons";

interface UserAvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  user: Pick<User, "name" | "image" | "email">;
  className?: string;
}

export const UserAvatar = async ({ user, className }: UserAvatarProps) => {
  return (
    <Avatar isBordered as="button" className="transition-transform shrink-0" src={user?.image ? user.image : ""} fallback={<Icons.user className="h-4 w-4 text-zinc-900" />} />
  );
};
