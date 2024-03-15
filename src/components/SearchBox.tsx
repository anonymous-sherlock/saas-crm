"use client";

import {
  EnvelopeClosedIcon,
  GearIcon,
  PersonIcon,
  RocketIcon
} from "@radix-ui/react-icons";
import * as React from "react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";

import { subMenusList } from "@/constants/MenuItems";
import { CircleIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function SearchBox() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter()

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false)
    command()
  }, [])

  return (
    <>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            {subMenusList.map((group) => (
              group.menus.map((menu) => {
                return (
                  <CommandItem key={menu.id}
                    onSelect={() => {
                      runCommand(() => router.push(menu.url))
                    }}
                  >
                    <CircleIcon className="w-3 h-3 mr-2" />
                    <Link href={menu.url}>{menu.label}</Link>
                  </CommandItem>
                )
              })
            ))}
            <CommandItem>
              <RocketIcon className="mr-2 h-4 w-4" />
              <span>Launch</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Settings">
            <CommandItem>
              <PersonIcon className="mr-2 h-4 w-4" />
              <span>Profile</span>
              <CommandShortcut>⌘P</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <GearIcon className="mr-2 h-4 w-4" />
              <span>Settings</span>
              <CommandShortcut>⌘S</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
