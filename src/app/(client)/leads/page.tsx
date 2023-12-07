import { server } from '@/app/_trpc/server';
import LeadsDashboard from '@/components/leads/LeadsDashboard';
import { getAuthSession } from '@/lib/authOption';
import { redirect } from 'next/navigation';

async function LeadsPage() {
  const session = await getAuthSession()
  if (!session) redirect("/login")

  const Leads = await server.lead.getAll();

  return (
    <main className="mx-auto max-w-7xl md:p-2">
      <div className="mt-8 flex flex-col items-start justify-between gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:gap-0">
        <h1 className="mb-3 font-bold text-4xl text-gray-900">My Leads</h1>
      </div>

      <LeadsDashboard Leads={Leads} />
    </main>
  );
}

export default LeadsPage