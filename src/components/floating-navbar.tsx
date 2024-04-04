"use client";
import { Avatar, Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger, User } from "@nextui-org/react";
import { User as UserType } from "@prisma/client";
import { motion, useDragControls } from "framer-motion";
import Link from "next/link";
import { CSSProperties, useRef } from "react";
import { IconComponent, IconKey, Icons } from "./Icons";

interface FloatingNavProps {
  navItems: {
    name: string;
    link: string;
    icon?: IconKey;
    divider?: boolean;
  }[];
  user: UserType | null;
  className?: string;
}

export const FloatingNav = ({ navItems, className, user }: FloatingNavProps) => {
  const controls = useDragControls();
  const floatingNavRef = useRef<HTMLDivElement | null>(null);
  const constraintsRef = useRef(null);
  const iconClasses = "text-xl text-default-500 pointer-events-none flex-shrink-0";
  const defaultPosition: CSSProperties = {
    top: "9.5%",
    left: "40%",
  };

  return (
    <>
      <div className="h-[calc(100vh-1rem)] w-[calc(100vw-1rem)] fixed inset-0 -z-50" ref={constraintsRef} />
      <motion.div
        ref={floatingNavRef}
        style={{ touchAction: "none", ...defaultPosition }}
        whileHover={{ scale: 1.1 }}
        dragControls={controls}
        dragMomentum={true}
        dragConstraints={constraintsRef}
        drag
        dragElastic={0.1}
        className="fixed rounded-full size-10 z-[999999999]"
      >
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar isBordered as="button" className="transition-transform " src={user?.image ? user.image : ""} fallback={<Icons.user className="h-4 w-4 text-zinc-900" />} />
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" items={navItems} variant="faded">
            <DropdownSection title="Profile" showDivider>
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
                    name={user?.name}
                    description={user?.email}
                    avatarProps={{
                      size: "sm",
                      isBordered: true,
                      src: user?.image ?? "",
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
          </DropdownMenu>
        </Dropdown>
      </motion.div>
    </>
  );
};
