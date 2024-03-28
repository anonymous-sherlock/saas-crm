"use client";
import { Icons } from "@/components/Icons";
import { CustomDeleteAlertDailog } from "@/components/global/custom-delete-alert-dailog";
import { Separator } from "@/components/ui/separator";
import { deleteUsers } from "@/lib/actions/user.action";
import { cn } from "@/lib/utils";
import { useModal } from "@/providers/modal-provider";
import { Button } from "@/ui/button";
import { Listbox, ListboxItem, ListboxSection, Popover, PopoverContent, PopoverTrigger, Spinner } from "@nextui-org/react";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";
import { Loader2 } from "lucide-react";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast as hotToast } from "react-hot-toast";
import { UserListSchema } from "./schema";
import { allowedAdminRoles } from "@/lib/auth.permission";
interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({ row }: DataTableRowActionsProps<TData>) {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const { setOpen: setModalOpen } = useModal();
  const [isDeletingUser, startTransition] = useTransition();
  const isAdmin = allowedAdminRoles.some((role) => role === session?.user.role);

  const parsedUser = UserListSchema.safeParse(row.original);
  if (!parsedUser.success) return null;
  const user = parsedUser.data;

  const handleUserUpdate = () => {
    if (status === "authenticated" && isAdmin) {
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
              address: user.company?.address,
            },
          },
        },
      };
      hotToast.promise(
        update(updatedSession).then((ses) => router.refresh()),
        {
          loading: "Impersonating user...",
          success: "User impersonated successfully!",
          error: "Could not impersonate this user.",
        },
      );
    }else{
      hotToast.error("You don't have access to impersonate other users.")
    }
  };

  const handleDelteUser = () => {
    startTransition(() => {
      hotToast.promise(
        deleteUsers({ userIds: [user.id] }).then((data) => {
          if (data.success) {
            router.refresh();
          }
        }),
        {
          loading: "Deleting user...",
          success: "User Deleted successfully!",
          error: "Could not delete user.",
        },
      );
    });
  };
  const iconClasses = "text-xl text-default-500 pointer-events-none flex-shrink-0";

  return (
    <>
      {isDeletingUser ? (
        <div className="flex items-center justify-center">
          <Spinner size="sm" color="danger" />
        </div>
      ) : (
        <Popover placement="left" style={{ zIndex: 200 }}>
          <PopoverTrigger>
            <Button variant="ghost" className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
              <DotsHorizontalIcon className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <Listbox variant="faded" aria-label="User quick actions menu">
              <ListboxSection title="Quick actions" aria-label="Quick actions">
                <ListboxItem
                  key="copy-user-id"
                  aria-label="Copy user id"
                  startContent={<Icons.CopyIcon className={iconClasses} />}
                  onClick={() => {
                    navigator.clipboard.writeText(user.id.toString());
                    hotToast.success("Successfully Copied user id");
                  }}
                >
                  Copy User Id
                </ListboxItem>
                <ListboxItem key="impersonate-user" aria-label="Impersonate User" startContent={<Icons.ImpersonateUserIcon className={iconClasses} />} onClick={handleUserUpdate}>
                  Impersonate User
                </ListboxItem>
              </ListboxSection>
            </Listbox>
            {isAdmin ? (
              <Listbox variant="faded" aria-label="User Quick View menu">
                <ListboxSection title="Quick actions" aria-label="View actions">
                  <ListboxItem
                    key="view-leads"
                    aria-label="View Leads"
                    startContent={<Icons.ViewLeadsIcon className={iconClasses} />}
                    href={`/admin/users/${user.id}/leads`}
                    as={Link}
                  >
                    View Leads
                  </ListboxItem>
                  <ListboxItem
                    key="view-campaigns"
                    aria-label="View Campaigns"
                    startContent={<Icons.ViewLeadsIcon className={iconClasses} />}
                    href={`/admin/users/${user.id}/campaigns`}
                    as={Link}
                  >
                    View Campaigns
                  </ListboxItem>
                  <ListboxItem
                    key="view-products"
                    aria-label="View Products"
                    startContent={<Icons.ViewLeadsIcon className={iconClasses} />}
                    href={`/admin/users/${user.id}/products`}
                    as={Link}
                  >
                    View Products
                  </ListboxItem>
                  <ListboxItem
                    key="view-user-details"
                    aria-label="View Leads"
                    startContent={<Icons.ImpersonateUserIcon className={iconClasses} />}
                    href={`/admin/users/${user.id}`}
                    as={Link}
                  >
                    View User Details
                  </ListboxItem>
                </ListboxSection>
              </Listbox>
            ) : null}
            {isAdmin ? (
              <>
                <Separator className="my-1" />
                <Listbox variant="faded" aria-label="User Danger zone menu">
                  <ListboxSection title="Danger zone" aria-label="Danger zone">
                    <ListboxItem
                      key="delete"
                      className="text-danger"
                      color="danger"
                      aria-label="Permanently delete user"
                      description="Permanently delete user"
                      onClick={() => {
                        setModalOpen(
                          <CustomDeleteAlertDailog
                            title="Are you absolutely sure?"
                            description="This action cannot be undone. This will permanently delete this
                            user from our servers."
                            isDeleting={isDeletingUser}
                            onDelete={handleDelteUser}
                            actionText="Delete User"
                          />,
                        );
                      }}
                      startContent={isDeletingUser ? <Loader2 className="h-4 w-4 animate-spin" /> : <Icons.DeleteIcon className={cn(iconClasses, "text-danger")} />}
                    >
                      Delete
                    </ListboxItem>
                  </ListboxSection>
                </Listbox>
              </>
            ) : null}
          </PopoverContent>
        </Popover>
      )}
    </>
  );
}
