"use client";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";

import { Button, buttonVariants } from "@/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from "@/ui/dropdown-menu";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast as hotToast } from "react-hot-toast";


import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { UserListSchema } from "./schema";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {

  const { data: session, update, status } = useSession()

  const user = UserListSchema.parse(row.original);

  const handleUserUpdate = () => {
    if (status === "authenticated" && session.user.role === "ADMIN") {
      const updatedSession: Session = {
        ...session,
        user: {
          ...session?.user,
          isImpersonating: true,
          actor: {
            actorEmail: user.email,
            actorName: user.name,
            userId: user.id
          },
        }
      };
      hotToast.promise(
        update(updatedSession),
        {
          loading: 'Impersonating user...',
          success: "User impersonated successfully!",
          error: "Could not impersonate this user.",
        }
      );
    }
  }
  return (
    <>

      <AlertDialog>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
            >
              <DotsHorizontalIcon className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[160px]">
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer"
              onClick={() => {
                navigator.clipboard.writeText(user.id.toString());
                hotToast.success('Successfully Copied User ID!')

              }}
            >Copy User ID</DropdownMenuItem>

            <DropdownMenuItem onClick={handleUserUpdate} className="cursor-pointer">
              Impersonate User
            </DropdownMenuItem>

            <DropdownMenuSeparator />
            <AlertDialogTrigger asChild>
              <DropdownMenuItem className="text-red-600" >
                Delete
                <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
              </DropdownMenuItem>
            </AlertDialogTrigger>
          </DropdownMenuContent>
        </DropdownMenu>
        {/*Delete Dialog Content */}
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              lead from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction

              className={buttonVariants({ variant: "destructive" })}
            >
              Delete User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </>
  );
}