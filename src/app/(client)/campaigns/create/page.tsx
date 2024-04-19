import { CampaignForm } from "@/components/template/campaigns/campaign-form";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { getAuthUser } from "@/lib/auth";
import { authPages } from "@routes";
import { redirect } from "next/navigation";
export const dynamic = "force-dynamic";

export default async function CampaignCreate() {
  const { authUserId, authUserName } = await getAuthUser();
  if (!authUserId) redirect(authPages.login);
  return (
    <Card className="bg-white p-6">
      <CardTitle>Create a Campaign</CardTitle>
      <CardContent className="mt-8 w-full p-0">
        <CampaignForm type="create" user={{ id: authUserId, name: authUserName }} />
      </CardContent>
    </Card>
  );
}
