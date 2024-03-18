import { LeadsEditForm } from "@/components/leads/leads-edit-form";
import { db } from "@/db";
import { getCurrentUser } from "@/lib/auth";
import { authPages } from "@routes";
import { notFound, redirect } from "next/navigation";

export default async function LeadEditPage({ params }: { params: { leadId: string } }) {
    const user = await getCurrentUser()
    if (!user) redirect(authPages.login)
    const lead = await db.lead.findFirst({
        where: { id: params.leadId }, include: {
            campaign: {
                include: {
                    product: {
                        include: {
                            images: {
                                include: {
                                    media: true
                                }
                            }
                        }
                    }
                }
            }
        }
    })
    if (!lead) notFound()

    return (
        <LeadsEditForm data={lead} title="Edit Lead" />
    )
}