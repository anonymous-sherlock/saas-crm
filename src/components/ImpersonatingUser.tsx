"use client"
import { ExclamationTriangleIcon } from "@radix-ui/react-icons"
import { Session } from "next-auth"
import { useSession } from 'next-auth/react'
import Image from "next/image"
import { FC } from 'react'

import { toast as hotToast } from "react-hot-toast"
import { Icons } from "./Icons"
import { Avatar, AvatarFallback } from './ui/avatar'
import { Button } from './ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu'
interface ImpersonatingUserProps {

}

const ImpersonatingUser: FC<ImpersonatingUserProps> = ({ }) => {
  const { data: session, status, update } = useSession()
  const user = session?.user
  if (!session?.user.isImpersonating || !session.user.actor) {
    return null
  }



  async function discardImpersonation() {
    if (status === "authenticated" && session.user.role === "ADMIN") {
      const updatedSession: Session = {
        ...session,
        user: {
          ...session?.user,
          isImpersonating: false,
          actor: null as any
        }
      };

      try {
        await update(updatedSession),
          hotToast.custom((t) => (
            <div
              className={`${t.visible ? 'animate-enter' : 'animate-leave'
                } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
            >
              <div className="flex-1 w-0 p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 pt-0.5">
                    <Avatar className='relative w-8 h-8'>
                      {user?.image ? (
                        <div className='relative aspect-square h-full w-full'>
                          <Image
                            fill
                            src={user.image}
                            alt='profile picture'
                            referrerPolicy='no-referrer'
                            sizes='150px'
                          />
                        </div>
                      ) : (
                        <AvatarFallback>
                          <span className='sr-only'>{user?.name}</span>
                          <Icons.user className='h-4 w-4 text-zinc-900' />
                        </AvatarFallback>
                      )}
                    </Avatar>
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      Removed impersonated session successfully!
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      Page Reload Required
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex border-l border-gray-200">
                <button
                  onClick={() => window.location.reload()}
                  className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Reload
                </button>
              </div>
            </div>
          ))
      } catch (error) {
        hotToast.error("Could not remove impersonated session as this time.");
      }


    }
  }

  return (
    <>
      <DropdownMenu >

        <DropdownMenuTrigger
          asChild
          className='overflow-visible fixed top-32 right-6'>
          <Button className='rounded-full w-10 h-10 aspect-square bg-red-500 hover:bg-red-700'>
            <Avatar className='relative  flex justify-center items-center'>
              <ExclamationTriangleIcon className="h-6 w-6" />
            </Avatar>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className='bg-white ' align='end'>
          <div className='flex items-center justify-start gap-2 p-2'>
            <div className='flex flex-col space-y-0.5 leading-none'>
              {user?.actor && (
                <>
                  <p className='font-medium text-sm  text-red-500'> Signed in as </p>
                  <p className='font-medium text-sm text-black'>
                    {user.actor.actorName}
                  </p>
                </>

              )}
              {user?.isImpersonating && user?.actor.actorEmail && (
                <p className='w-[200px] truncate text-xs text-zinc-700'>
                  {user.actor.actorEmail}
                </p>
              )}
            </div>
          </div>

          <DropdownMenuSeparator />

          <DropdownMenuItem className='cursor-pointer' onClick={discardImpersonation}>
            Log out impersonated session
          </DropdownMenuItem>
        </DropdownMenuContent>

      </DropdownMenu>
    </>


  )
}

export default ImpersonatingUser