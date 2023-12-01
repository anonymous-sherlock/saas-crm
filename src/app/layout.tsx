import "@/styles/globals.css";
import { Inter } from "next/font/google";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as HotToast } from "react-hot-toast";

import Providers from "@/providers/index";
import { SearchBox } from "@/components/SearchBox";
import 'react-loading-skeleton/dist/skeleton.css'
import 'simplebar-react/dist/simplebar.min.css'
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const CrispWithNoSSR = dynamic(
    () => import('@/lib/crisp')
  )
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn('h-full font-sans antialiased', inter.className)} >
        <div><HotToast position="top-center" reverseOrder={false} /></div>
        <Providers>{children}</Providers>
        <Toaster />
        <SearchBox />
        <CrispWithNoSSR />
      </body>
    </html>
  );
}
