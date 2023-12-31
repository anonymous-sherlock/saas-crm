import { PropsWithChildren } from "react";
import Sidebar from "./sidebar/Sidebar";
import UserAvatarDetails from "./sidebar/UserAvatarDetails";
import { Header } from "./header/Header";

export const SidebarLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex w-full grainy">
      <Sidebar>
        <UserAvatarDetails />
      </Sidebar>
      <section className="overflow-hidden flex-1 grainy">
        <Header />
        <main className="mt-0 p-4">{children}</main>
      </section>
    </div>
  );
};
