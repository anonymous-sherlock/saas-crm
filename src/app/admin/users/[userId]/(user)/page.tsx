import { UserProfileForm } from "@/components/forms/user-profile-form";
import UserApiKeyForm from "@/components/forms/user-api-key-form";
import { getUserProfile, getUserSecretKeys } from "@/lib/actions/user.action";
import { notFound } from "next/navigation";

interface UserDetailPageProps {
  params: {
    userId: string;
  };
}

export default async function UserDetailPage({ params: { userId } }: UserDetailPageProps) {
  const user = await getUserProfile(userId);
  if (!user) notFound();
  const secretKeys = await getUserSecretKeys(user?.id);
  return (
    <div className="flex flex-col gap-4">
      <UserProfileForm user={user} />
      <UserApiKeyForm secretKeys={secretKeys} userId={user.id} />
    </div>
  );
}
