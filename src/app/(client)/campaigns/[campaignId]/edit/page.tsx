import { server } from "@/app/_trpc/server";
import { CampaignForm } from "@/components/template/campaigns/campaign-form";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { getAuthUser } from "@/lib/auth";
import { authPages } from "@routes";
import { notFound, redirect } from "next/navigation";

export default async function CampaginEditPage({ params }: { params: { campaignId: string } }) {
  const { authUserId, authUserName } = await getAuthUser();
  if (!authUserId) redirect(authPages.login);
  try {
    const campaign = await server.campaign.get({ camapaingId: params.campaignId, userId: authUserId });
    if (campaign) {
      return (
        <Card className="bg-white p-6">
          <CardTitle>Update Campaign Details</CardTitle>
          <CardContent className="mt-8 w-full p-0">
            <CampaignForm
              data={campaign}
              type="update"
              user={{
                id: authUserId,
                name: authUserName,
              }}
            />
          </CardContent>
        </Card>
      );
    }
  } catch (error) {
    console.log(error);
    return notFound();
  }
}
