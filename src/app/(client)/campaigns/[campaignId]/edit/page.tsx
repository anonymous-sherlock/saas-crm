import { server } from "@/app/_trpc/server";
import CampaignForm from "@/components/template/campaigns/CampaignForm";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth";
import { authPages } from "@routes";
import { notFound, redirect } from "next/navigation";

export default async function CampaginEditPage({ params }: { params: { campaignId: string } }) {
  const user = await getCurrentUser();
  if (!user) redirect(authPages.login);
  try {
    const campaign = await server.campaign.get({ camapaingId: params.campaignId });
    if (campaign) {
      return (
        <Card className="bg-white p-6">
          <CardTitle>Update Campaign Details</CardTitle>
          <CardContent className="mt-8 w-full p-0">
            <CampaignForm
              data={campaign}
              type="update"
              user={{
                id: user.id,
                name: user.name,
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
