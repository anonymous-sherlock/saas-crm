import { SearchBox } from "@/components/SearchBox";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import Providers from "@/providers/index";
import { UiProvider } from "@/providers/next-ui";
import favicon from "@/public/favicon.png";
import "./globals.css";
import dynamic from "next/dynamic";
import { Inter } from "next/font/google";
import { Toaster as HotToast } from "react-hot-toast";
import { Toaster as Sonner } from "@/components/ui/sonner"
import NextTopLoader from 'nextjs-toploader';
import 'react-loading-skeleton/dist/skeleton.css';
import 'simplebar-react/dist/simplebar.min.css';

import { Metadata } from "next";
import ModalProvider from "@/providers/modal-provider";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Adscrush - the SaaS for leads management",
  description: "Adscrush CRM is an open-source software to easily manage your hot leads.",
  icons: favicon.src
}

export default function RootLayout({ children, }: {
  children: React.ReactNode;
}) {
  const CrispWithNoSSR = dynamic(() => import('@/lib/crisp'))
  const ImpersonatingUser = dynamic(() => import('@/components/ImpersonatingUser'))
  return (
    <html lang="en" suppressHydrationWarning >
      <body className={cn('min-h-screen font-sans antialiased relative', inter.className)} >
        <NextTopLoader showSpinner={false} color="#2563EB" />
        <div>
          <HotToast position="top-center" reverseOrder={false} />
        </div>
        <Providers>
          <UiProvider >
            <ModalProvider>
              {children}
            </ModalProvider>
          </UiProvider>
          <ImpersonatingUser />
        </Providers>
        <Toaster />
        <Sonner closeButton />
        <SearchBox />
        <CrispWithNoSSR />
      </body>
    </html>
  );
}
