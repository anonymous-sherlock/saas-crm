import Navbar from '@/components/Navbar'

import { constructMetadata } from '@/lib/utils'

export const metadata = constructMetadata()

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className='min-h-screen h-full grainy'>
      <Navbar />
      {children}
    </main>

  )
}
