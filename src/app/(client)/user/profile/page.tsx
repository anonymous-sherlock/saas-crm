import { server } from "@/app/_trpc/server";
import { Icons } from "@/components/Icons";
import Account from "@/components/template/profile/Account";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { getCurrentUser } from "@/lib/auth";
import { cn } from "@/lib/utils";
import defaultProfileCover from "@/public/default-profile-cover.png";
import { authPages } from "@routes";
import Image from "next/image";
import { redirect } from "next/navigation";


export default async function UserProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect(authPages.login);

  const userData = await server.user.get()

  return (
    <main className="flex">
      <Card className="w-full overflow-hidden">
        <div className="min-h-[200px] w-full relative">
          <Image src={defaultProfileCover.src} blurDataURL={defaultProfileCover.blurDataURL} fill alt="" priority quality={90} />
          <div className="absolute -bottom-1/2 -translate-y-1/2 border-white border-4 left-4 w-[120px] h-[120px] rounded-full bg-gray-200">
            <Label htmlFor="profile-avatar" className="bg-transparent w-full h-full">
              <Avatar className="w-full h-full cursor-pointer">
                <AvatarImage src={user?.image ?? ""} alt="Profile image" />
                <AvatarFallback>
                  <span className='sr-only'>{user?.name}</span>
                  <Icons.user className='h-12 w-12 text-zinc-600' />
                </AvatarFallback>
              </Avatar>
            </Label>
          </div>
        </div>
        <CardContent className="mt-16 p-8 pt-0">
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-medium">{user?.name}</h3>
            </div>
            <Separator />
            <div className={cn("flex-1 space-y-4 p-8 pl-0", "!pt-0")}>
              <Account user={userData} />
            </div>
          </div>
        </CardContent>
      </Card>
    </main >
  );
}