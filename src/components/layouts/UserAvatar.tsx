import { Avatar, AvatarFallback } from "@/ui/avatar";
import { User } from "next-auth";
import Image from "next/image";
import { Icons } from "../Icons";

interface UserAvatarProps extends React.HTMLAttributes<HTMLDivElement> {
    user: Pick<User, "name" | "image" | "email">;
    className?: string;
}

export const UserAvatar = async ({ user, className }: UserAvatarProps) => {
    return (
        <Avatar className='relative w-8 h-8'>
            {user.image ? (
              <div className='relative aspect-square h-full w-full'>
                <Image
                  fill
                  src={user.image}
                  alt='profile picture'
                  referrerPolicy='no-referrer'
                  sizes="80px"
                />
              </div>
            ) : (
              <AvatarFallback>
                <span className='sr-only'>{user.name}</span>
                <Icons.user className='h-4 w-4 text-zinc-900' />
              </AvatarFallback>
            )}
          </Avatar>
    );
};
