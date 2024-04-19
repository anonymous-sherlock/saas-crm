import UserApiKeyForm from "@/components/forms/user-api-key-form";
import { UserProfileForm } from "@/components/forms/user-profile-form";
import { getUserProfile, getUserSecretKeys } from "@/lib/actions/user.action";
import { getActorUser, getCurrentUser } from "@/lib/auth";
import { authPages } from "@routes";
import { notFound, redirect } from "next/navigation";
export const dynamic = 'force-dynamic';

export default async function UserProfilePage() {
  const authUser = await getCurrentUser();
  const actor = await getActorUser(authUser);
  if (!authUser) redirect(authPages.login);
  const userId = actor ? actor.userId : authUser.id;
  const user = await getUserProfile(userId);
  if (!user) notFound();
  const secretKeys = await getUserSecretKeys(userId);
  return (
    <div className="flex flex-col gap-4">
      <UserProfileForm user={user} />
      <UserApiKeyForm secretKeys={secretKeys} userId={user.id} />
    </div>
  );
}
