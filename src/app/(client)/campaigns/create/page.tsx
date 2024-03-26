import CampaignForm from "@/components/template/campaigns/CampaignForm";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { getActorUser, getCurrentUser } from "@/lib/auth";
import { authPages } from "@routes";
import { redirect } from "next/navigation";

export default async function CampaignCreate() {
  const user = await getCurrentUser();
  if (!user) redirect(authPages.login);
  const actor = await getActorUser(user);
  const userId = actor ? actor.userId : user?.id;
  const name = actor ? actor.actorName : user.name;
  return (
    <Card className="bg-white p-6">
      <CardTitle>Create a Campaign</CardTitle>
      <CardContent className="mt-8 w-full p-0">
        <CampaignForm type="create" user={{ id: user.id, name: user.name ?? "" }} />
      </CardContent>
    </Card>
  );
}
