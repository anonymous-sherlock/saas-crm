"use client";
import { ViewVerticalIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/ui/button";
import { DOCUMENTATION_REDIRECT } from "routes";

export function MobileDocsNav() {
  return (
    <>
      <Link
        href={DOCUMENTATION_REDIRECT}
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden",
        )}
      >
        <ViewVerticalIcon className="h-5 w-5" />
        <span className="sr-only">View Documentation</span>
      </Link>
    </>
  );
}
