"use server";
import { server } from "@/app/_trpc/server";
import UserAccountNav from "@/components/layouts/UserAccountNav";
import { buttonVariants } from "@/components/ui/button";
import { getAuthUser, getCurrentUser } from "@/lib/auth";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React from "react";
import { DEFAULT_DASHBOARD_REDIRECT, DOCUMENTATION_REDIRECT, authPages } from "routes";
import Notifiation from "./Notifiation";
import Search from "./Search";
import ToggleSidebar from "./ToggleSidebar";
import { MobileDocsNav } from "./mobileDocsNav";
import { WalletBalance } from "@/components/template/wallets/WalletBallance";
import { db } from "@/db";

export async function Header() {
  const user = await getCurrentUser();
  const {authUserId} =await getAuthUser()
  const [notifications, wallet] = await Promise.all([server.notification.getNotifictions(), db.wallet.findFirst({ where: { user: { id: authUserId } } })]);
  return (
    <React.Fragment>
      <nav className="sticky z-99 lg:z-50 left-0 top-0  w-full justify-between border-gray-200 bg-white/95 backdrop-blur-sm before:shadow-[-2px_3px_90px_-20px_rgb(0_0_0_/_25%)] dark:bg-gray-900 border-b">
        <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between p-2 md:p-4">
          <ToggleSidebar />
          <Search />

          <div className="flex flex-1 items-center justify-end space-x-4 md:order-2 ">
            {/* <ThemeToggle /> */}
            <MobileDocsNav />
            <div className="hidden items-center space-x-4 sm:flex">
              {!user ? (
                <>
                  <Link
                    href="/pricing"
                    className={buttonVariants({
                      variant: "ghost",
                      size: "sm",
                    })}
                  >
                    Pricing
                  </Link>
                  <Link
                    href={authPages.login}
                    className={buttonVariants({
                      variant: "ghost",
                      size: "sm",
                    })}
                  >
                    Sign in
                  </Link>
                  <Link
                    href={authPages.register}
                    className={buttonVariants({
                      size: "sm",
                    })}
                  >
                    Get started <ArrowRight className="ml-1.5 h-5 w-5" />
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href={DOCUMENTATION_REDIRECT}
                    className={buttonVariants({
                      variant: "ghost",
                      size: "sm",
                    })}
                  >
                    Documentation
                  </Link>
                  <Link
                    href={DEFAULT_DASHBOARD_REDIRECT}
                    className={buttonVariants({
                      variant: "ghost",
                      size: "sm",
                    })}
                  >
                    Dashboard
                  </Link>
                  <WalletBalance balance={wallet?.balance ?? 0} />
                  <UserAccountNav name={!user.name ? "Your Account" : `${user.name}`} email={user.email ?? ""} imageUrl={user.image ?? ""} user={user} />
                </>
              )}
            </div>
            <Notifiation notifications={notifications} />
          </div>
        </div>
      </nav>
    </React.Fragment>
  );
}
