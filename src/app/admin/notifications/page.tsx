import {AddNotificationForm} from "@/components/forms/add-notification-form";
import { PageHeader, PageHeaderDescription, PageHeaderHeading } from "@/components/global/page-header";
import { db } from "@/db";

interface NotificationPageProps {}

const NotificationPage = async ({}: NotificationPageProps) => {
  const users = await db.user.findMany();
  return (
    <>
      <PageHeader separated>
        <div className="flex flex-col md:flex-row justify-between md:items-center">
          <div>
            <div className="flex space-x-4">
              <PageHeaderHeading size="sm" className="flex-1">
                Notification
              </PageHeaderHeading>
            </div>
            <PageHeaderDescription size="sm">Assign Notification to Users</PageHeaderDescription>
          </div>
        </div>
      </PageHeader>
      <div className="p-0 md:!pt-4">
        <AddNotificationForm users={users} />
      </div>
    </>
  );
};

export default NotificationPage;
