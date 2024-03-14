import { PropsWithChildren } from "react";
import Sidebar from "./sidebar/Sidebar";
import { SidebarUserDetails } from "./sidebar/SidebarUserDetails";
import { Header } from "./header/Header";
import { ScrollArea } from "../ui/scroll-area";

export const SidebarLayout = ({ children }: PropsWithChildren) => {
  return (
    <section className="flex w-full grainy">
      <Sidebar>
        <SidebarUserDetails />
      </Sidebar>
      <section className="overflow-hidden flex-1 grainy">
        <Header />
        <ScrollArea className="h-[calc(100vh_-_var(--navbar-height)_-_1px)]">
          <main className="mt-0 p-4">{children}</main>
        </ScrollArea>
      </section>
    </section>
  );
};
