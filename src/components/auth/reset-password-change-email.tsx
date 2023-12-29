"use client"
import { FC } from 'react'
import { Button } from '../ui/button'
import { removeResetPasswordCookie } from '@/lib/actions/auth.action'
import { useRouter } from 'next/navigation'
interface ResetPasswordChangeEmailProps {

}

const ResetPasswordChangeEmail: FC<ResetPasswordChangeEmailProps> = ({ }) => {
    const router = useRouter()
    return <Button variant="secondary" onClick={async () => {
        const data = await removeResetPasswordCookie()
        if (data.success) {
            router.refresh()
        }
    }}>Change Email</Button>
}

export default ResetPasswordChangeEmail