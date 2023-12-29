"use client"
import { FC } from 'react'
import { Button } from '../ui/button'
import { trpc } from '@/app/_trpc/client'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { Icons } from '../Icons'

interface SendResetPasswordMailProps {
  email: string
}

const SendResetPasswordMail: FC<SendResetPasswordMailProps> = ({ email }) => {
  const router = useRouter()
  const { mutate: sendResetPasswordAgain, isLoading } = trpc.auth.resetPassword.useMutation({
    onError(error) {
      toast.error(error.message)
    },
    onSuccess(data) {
      router.refresh()
      toast.success(data.message)
    }
  })
  async function handleClick() {
    sendResetPasswordAgain({ email: email })
  }
  return <Button onClick={handleClick} disabled={isLoading} className='font-semibold
  text-white hover:bg-indigo-900 focus:bg-indigo-400 bg-[#112164]'>
    {isLoading ? (
      <>
        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
        Sending mail...
      </>

    )
      : <>Send Reset Password Mail Again</>
    }

  </Button>
}

export default SendResetPasswordMail