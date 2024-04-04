"use client";
import { revalidatePage } from "@/lib/actions/revalidate.action";
import { cn } from "@/lib/utils";
import { Avatar, Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger, User } from "@nextui-org/react";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { motion, useDragControls } from "framer-motion";
import { LogOut } from "lucide-react";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CSSProperties, FC, useRef } from "react";
import { toast as hotToast } from "react-hot-toast";
import { IconComponent, IconKey, Icons } from "./Icons";
import { allowedAdminRoles } from "@/lib/auth.permission";

interface ImpersonatingUserProps {}

const navItems: {
  name: string;
  link: string;
  icon?: IconKey;
  divider?: boolean;
}[] = [
  { name: "View Leads", link: `/leads` },
  { name: "View Campaigns", link: `/campaigns` },
  { name: "View Products", link: `/products` },
  { name: "User Profile", link: `/user/profile` },
];

const ImpersonatingUser: FC<ImpersonatingUserProps> = ({}) => {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const controls = useDragControls();
  const constraintsRef = useRef(null);
  const iconClasses = "text-xl text-default-500 pointer-events-none flex-shrink-0";
  const actor = session?.user.actor;
  const isAdmin = allowedAdminRoles.some((role) => role === session?.user.role);

  if (!session?.user.isImpersonating || !session.user.actor) {
    return null;
  }

  async function discardImpersonation() {
    if (status === "authenticated" && isAdmin) {
      const updatedSession: Session = {
        ...session,
        user: {
          ...session?.user,
          isImpersonating: false,
          actor: null as any,
        },
      };
      try {
        await update(updatedSession).then(async (ses) => {
          await revalidatePage("/");
          setTimeout(() => {
            window.location.reload();
          }, 1000);
          router.refresh();
        }),
          hotToast.custom((t) => (
            <div
              className={`${t.visible ? "animate-enter" : "animate-leave"} max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
            >
              <div className="flex-1 w-0 p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 pt-0.5">
                    <Avatar isBordered as="button" className="transition-transform " src={actor ? actor.image ?? "" : ""} />
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-gray-900">Removed impersonated session successfully!</p>
                    <p className="mt-1 text-sm text-gray-500">Page Reload Required</p>
                  </div>
                </div>
              </div>
              <div className="flex border-l border-gray-200">
                <button
                  onClick={() => window.location.reload()}
                  className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Reload
                </button>
              </div>
            </div>
          ));
      } catch (error) {
        hotToast.error("Could not remove impersonated session as this time.");
      }
    }
  }

  const defaultPosition: CSSProperties = {
    top: "20%",
    right: "2%",
  };

  return (
    <>
      <div className="h-[calc(100vh-1rem)] w-[calc(100vw-1rem)] fixed inset-0 -z-50" ref={constraintsRef} />
      <motion.div
        style={{ touchAction: "none", ...defaultPosition }}
        whileHover={{ scale: 1.1 }}
        dragControls={controls}
        dragMomentum={true}
        dragConstraints={constraintsRef}
        drag="y"
        dragElastic={0.1}
        className="fixed rounded-full size-10 z-[999999999]"
      >
        <Dropdown placement="bottom-end" backdrop="opaque">
          <DropdownTrigger>
            <Avatar isBordered as="button" className="transition-transform bg-red-600 text-white" fallback={<ExclamationTriangleIcon className="h-6 w-6" />} />
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="faded">
            <DropdownSection title="Signed in as" showDivider>
              <DropdownItem
                key="profile"
                aria-label="profile"
                className="gap-2"
                classNames={{
                  base: "w-full",
                  wrapper: "w-full",
                  title: "!text-wrap !overflow-visible",
                }}
                textValue="Profile menu"
              >
                <div className="flex justify-start items-center gap-2 w-full ">
                  <User
                    as="button"
                    name={actor && actor?.actorName}
                    description={actor && actor?.actorEmail}
                    avatarProps={{
                      size: "sm",
                      isBordered: true,
                      src: actor ? actor.image ?? "" : "",
                      className: "shrink-0",
                      fallback: <Icons.user className="h-4 w-4 text-zinc-900" />,
                    }}
                  />
                </div>
              </DropdownItem>
            </DropdownSection>
            <DropdownSection title="Actions">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <DropdownItem
                    key={item.link}
                    href={item.link}
                    as={Link}
                    showDivider={item.divider}
                    startContent={Icon ? <IconComponent name={Icon} className={iconClasses} /> : <Icons.ViewLeadsIcon className={iconClasses} />}
                  >
                    {item.name}
                  </DropdownItem>
                );
              })}
            </DropdownSection>
            <DropdownSection title="Danger zone">
              <DropdownItem
                key="delete"
                onClick={discardImpersonation}
                className="text-danger"
                color="danger"
                startContent={<LogOut className={cn(iconClasses, "text-danger size-4")} />}
              >
                Logout the Session
              </DropdownItem>
            </DropdownSection>
          </DropdownMenu>
        </Dropdown>
      </motion.div>
    </>
  );
};

export default ImpersonatingUser;
