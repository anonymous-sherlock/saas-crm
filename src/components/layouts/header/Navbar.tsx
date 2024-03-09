import logo from "@/assets/logo.png"
import { getCurrentUser } from "@/lib/auth"
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { DEFAULT_DASHBOARD_REDIRECT, DOCUMENTATION_REDIRECT, authPages } from "routes"
import MaxWidthWrapper from '@/components/global/MaxWidthWrapper'
import MobileNav from "./MobileNav"
import UserAccountNav from '../UserAccountNav'
import { buttonVariants } from '@/ui/button'
import { MobileDocsNav } from "./mobileDocsNav"
const Navbar = async () => {
  const user = await getCurrentUser();

  return (
    <nav className='sticky h-14 inset-x-0 top-0 z-30 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all'>
      <MaxWidthWrapper className="max-w-screen-2xl md:px-16">

        <div className='flex h-14 items-center justify-between border-b border-zinc-200'>
          <Link
            href='/'
            className='flex z-40 font-semibold'>
            <span className='flex gap-2 items-center justify-center text-2xl'>
              <Image src={logo.src} blurDataURL={logo.blurDataURL} alt="Adscrush Logo" width={45} height={45} className='rounded-md' priority />{" Adscrush"}
            </span>
          </Link>
          <div className="flex items-center justify-center gap-2">
            <MobileDocsNav />
            <MobileNav isAuth={!!user} />
          </div>


          <div className='hidden items-center space-x-4 sm:flex'>
            {!user ? (
              <>
                <Link
                  href={DOCUMENTATION_REDIRECT}
                  className={buttonVariants({
                    variant: 'ghost',
                    size: 'sm',
                  })}>
                  Documentation
                </Link>
                <Link
                  href='/pricing'
                  className={buttonVariants({
                    variant: 'ghost',
                    size: 'sm',
                  })}>
                  Pricing
                </Link>
                <Link

                  href={authPages.login}
                  className={buttonVariants({
                    variant: 'ghost',
                    size: 'sm',
                  })}>
                  Sign in
                </Link>
                <Link
                  href={authPages.register}
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
                  href={DOCUMENTATION_REDIRECT}
                  className={buttonVariants({
                    variant: 'ghost',
                    size: 'sm',
                  })}>
                  Documentation
                </Link>
                <Link
                  href={DEFAULT_DASHBOARD_REDIRECT}
                  className={buttonVariants({
                    variant: 'ghost',
                    size: 'sm',
                  })}>
                  Dashboard
                </Link>

                <UserAccountNav
                  name={
                    !user.name
                      ? 'Your Account'
                      : `${user.name}`
                  }
                  email={user.email ?? ''}
                  imageUrl={user.image ?? ''}
                  user={user}
                />
              </>
            )}
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  )
}

export default Navbar
