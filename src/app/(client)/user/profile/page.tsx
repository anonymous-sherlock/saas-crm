import { server } from "@/app/_trpc/server";
import { Icons } from "@/components/Icons";
import Account from "@/components/profile/Account";
import { Integration } from "@/components/profile/Integration";
import { NotificationsForm } from "@/components/profile/NotificationForm";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAuthSession } from "@/lib/authOption";
import Image from "next/image";
import { redirect } from "next/navigation";
import defaultProfileCover from "@/public/default-profile-cover.png"


export default async function UserProfilePage() {
  const session = await getAuthSession();
  if (!session || !session.user) {
    redirect("/login");
  }
  const { user } = session;
  const userData = await server.user.get()

  return (
    <main className="flex ">
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
            <div className="flex-1 space-y-4 p-8 pl-0 pt-6">
              <Tabs defaultValue="account" className="space-y-4">
                <TabsList className="text-2xl capitalize font-medium space-x-4">
                  <TabsTrigger value="account">Account</TabsTrigger>
                  <TabsTrigger value="notification">Notification</TabsTrigger>
                  <TabsTrigger value="integration">Integration</TabsTrigger>
                </TabsList>
                <TabsContent value="account" className="w-full" >
                  <Account user={userData} />
                </TabsContent>
                <TabsContent value="notification" className="w-full" >
                  <NotificationsForm />
                </TabsContent>
                <TabsContent value="integration" className="w-full" >
                  <Integration />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </CardContent>
      </Card>
    </main >
  );
}