import { LeadsDetailsView } from "@/components/template/leads/leads-details-view";
import { db } from "@/db";
import { getCurrentUser } from "@/lib/auth";
import { formatDistanceToNow } from "date-fns";
import { notFound, redirect } from "next/navigation";

interface LeadsPageProps {
    params: {
        leadId: string
    }
}
async function LeadsPage({ params: { leadId } }: LeadsPageProps) {
    const lead = await db.lead.findFirst({ where: { id: leadId } })
    if (!lead) notFound()
    return (
        <div className="flex flex-col gap-4">
            <p className="inline-flex text-sm px-2 ml-auto bg-yellow-100/50 rounded-lg border-yellow-200 border">Last updated : {formatDistanceToNow(lead.updatedAt)}</p>
            <section className=" bg-white border p-4 rounded-sm">
                <LeadsDetailsView data={lead} />
            </section>

        </div>
    );
}

export default LeadsPage