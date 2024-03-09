import AddNotificationForm from '@/components/forms/add-notification-form'
import { db } from '@/db'

interface NotificationPageProps { }

const NotificationPage = async ({ }: NotificationPageProps) => {
    const users = await db.user.findMany()
    return (
        <div className='h-[calc(85dvh_-_var(--navbar-height)_-_1px)] flex justify-center items-center'>
            <AddNotificationForm users={users} />
        </div>
    )
}

export default NotificationPage