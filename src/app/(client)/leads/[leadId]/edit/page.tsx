import { server } from "@/app/_trpc/server";
import { LeadsEditForm } from "@/components/leads/leads-edit-form";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth";
import { authPages } from "@routes";
import { notFound, redirect } from "next/navigation";

interface LeadEditPageProps {
  params: { leadId: string };
}

export default async function LeadEditPage({ params: { leadId } }: LeadEditPageProps) {
  const user = await getCurrentUser();
  if (!user) redirect(authPages.login);
  const leadDetails = await server.lead.getLeadDetails({ leadId });
  if (!leadDetails) notFound();

  return (
    <Card className="bg-white p-6">
      <CardTitle>Update Leads Details</CardTitle>
      <CardContent className="mt-8 w-full p-0">
        <LeadsEditForm data={leadDetails} />
      </CardContent>
    </Card>
  );
}
