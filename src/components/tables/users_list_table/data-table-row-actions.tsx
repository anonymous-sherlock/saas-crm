"use client";
import { trpc } from "@/app/_trpc/client";
import { Icons } from "@/components/Icons";
import { Separator } from "@/components/ui/separator";
import Spinner from "@/components/ui/spinner";
import { Button } from "@/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from "@/ui/dropdown-menu";
import { Listbox, ListboxItem, ListboxSection } from "@nextui-org/react";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast as hotToast } from "react-hot-toast";
import { DeleteUserAlert } from "./delete-user-alert";
import { UserListSchema } from "./schema";
interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const utils = trpc.useUtils();
  const { data: session, status, update } = useSession()
  const isAdmin = session?.user?.role === 'ADMIN';
  const router = useRouter()
  const parsedUser = UserListSchema.safeParse(row.original);

  const { mutateAsync: deleteUser, isLoading: isDeletingUser } = trpc.admin.deleteUser.useMutation({
    onSuccess() {
      utils.admin.getAllUser.invalidate()
      router.refresh()
    }
  })
  if (!parsedUser.success) return null
  const user = parsedUser.data

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
            userId: user.id,
            image: user.image,
            company: {
              id: user.company?.id,
              name: user.company?.name,
              address: user.company?.address
            }
          },
        }
      };
      hotToast.promise(
        update(updatedSession).then((ses) => router.refresh()),
        {
          loading: 'Impersonating user...',
          success: "User impersonated successfully!",
          error: "Could not impersonate this user.",
        }
      );
    }
  }

  const handleDelteUser = () => {
    hotToast.promise(
      deleteUser({ userIds: [user.id] }),
      {
        loading: 'Deleting user...',
        success: "User Deleted successfully!",
        error: "Could not delete user.",
      }
    );
  }
  const iconClasses = "text-xl text-default-500 pointer-events-none flex-shrink-0";

  return (
    <>
      {isDeletingUser ? (
        <div className="flex items-center justify-center">
          <Spinner />
        </div>
      ) : (
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
          <DropdownMenuContent align="end">
            <Listbox variant="faded" aria-label="User quick actions menu">
              <ListboxSection title="Quick actions" aria-label='Quick actions'>
                <ListboxItem key="edit" startContent={<Icons.EditIcon className={iconClasses} />} href={`admin/users/${user.id}/edit`}>
                  Edit User
                </ListboxItem>
                <ListboxItem key="copy-user-id" aria-label='Copy user id' startContent={<Icons.CopyIcon className={iconClasses} />}
                  onClick={() => {
                    navigator.clipboard.writeText(user.id.toString());
                    hotToast.success('Successfully Copied user id')
                  }}
                >
                  Copy User Id
                </ListboxItem>
              </ListboxSection>
            </Listbox>
            <Separator className='my-1' />
            <DeleteUserAlert
              onDelete={handleDelteUser}
              isDeleting={isDeletingUser}
            />
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  );
}