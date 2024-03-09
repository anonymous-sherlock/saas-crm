import { Breadcrumbs } from '@/components/global/Breadcrumbs'
import { SidebarLayout } from '@/components/layouts/SidebarLayout'

import { constructMetadata } from '@/lib/utils'

export const metadata = constructMetadata()

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className='min-h-screen h-full grainy'>
      <SidebarLayout>
        <Breadcrumbs />
        {children}
      </SidebarLayout>
    </main>

  )
}
