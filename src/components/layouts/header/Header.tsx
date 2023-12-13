import React from "react";


import UserAccountNav from "@/components/UserAccountNav";
import { getAuthSession } from "@/lib/authOption";
import Search from "./Search";
import ToggleSidebar from "./ToggleSidebar";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export async function Header() {
  const session = await getAuthSession();
  return (
    <React.Fragment>
      <nav className="sticky z-99 lg:z-50 left-0 top-0  w-full justify-between border-gray-200 bg-white/95 backdrop-blur-sm before:shadow-[-2px_3px_90px_-20px_rgb(0_0_0_/_25%)] dark:bg-gray-900">
        <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between p-2 md:p-4">
          <ToggleSidebar />
          <Search />

          <div className="flex flex-1 items-center justify-end space-x-4 md:order-2 ">


            {/* <ThemeToggle /> */}

            <div className='hidden items-center space-x-4 sm:flex'>
              {!session?.user ? (
                <>
                  <Link
                    href='/pricing'
                    className={buttonVariants({
                      variant: 'ghost',
                      size: 'sm',
                    })}>
                    Pricing
                  </Link>
                  <Link

                    href={"/login"}
                    className={buttonVariants({
                      variant: 'ghost',
                      size: 'sm',
                    })}>
                    Sign in
                  </Link>
                  <Link
                    href={"/register"}
                    className={buttonVariants({
                      size: 'sm',
                    })}>
                    Get started{' '}
                    <ArrowRight className='ml-1.5 h-5 w-5' />
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href='/dashboard'
                    className={buttonVariants({
                      variant: 'ghost',
                      size: 'sm',
                    })}>
                    Dashboard
                  </Link>

                  <UserAccountNav
                    name={
                      !session.user.name
                        ? 'Your Account'
                        : `${session.user.name}`
                    }
                    email={session?.user.email ?? ''}
                    imageUrl={session?.user.image ?? ''}
                    user={session.user}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </React.Fragment>
  );
}
