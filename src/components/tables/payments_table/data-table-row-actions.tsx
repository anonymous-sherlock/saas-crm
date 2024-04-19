"use client";
import { Icons } from "@/components/Icons";
import { CustomDeleteAlertDailog } from "@/components/global/custom-delete-alert-dailog";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useModal } from "@/providers/modal-provider";
import { Button } from "@/ui/button";
import { Listbox, ListboxItem, ListboxSection, Popover, PopoverContent, PopoverTrigger, Spinner } from "@nextui-org/react";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast as hotToast } from "react-hot-toast";
import { paymentRowSchema } from "./schema";
interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({ row }: DataTableRowActionsProps<TData>) {
  const { setOpen } = useModal();
  const router = useRouter();
  const { setOpen: setModalOpen } = useModal();
  const [isDeleting, startDeleteTransition] = useTransition();
  const iconClasses = "text-xl text-default-500 pointer-events-none flex-shrink-0";

  const payment = paymentRowSchema.parse(row.original);


  if (isDeleting) {
    return (
      <div className="flex items-center justify-center">
        <Spinner size="sm" color="danger" labelColor="danger" />
      </div>
    );
  }

  return (
    <Popover
      style={{
        zIndex: 10,
      }}
    >
      <PopoverTrigger>
        <Button variant="ghost" className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
          <DotsHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <Listbox variant="faded" aria-label="lead quick actions menu">
          <ListboxSection title="Quick actions" aria-label="Quick actions">
           
            <ListboxItem
              key="copy-transaction-id"
              aria-label="Copy Transaction id"
              startContent={<Icons.CopyIcon className={iconClasses} />}
              onClick={() => {
                navigator.clipboard.writeText(payment.txid.toString());
                hotToast.success("Successfully Copied Lead id");
              }}
            >
              Copy Transaction Id
            </ListboxItem>
          </ListboxSection>
        </Listbox>
        <Separator className="my-1" />
        <Listbox variant="faded" aria-label="Product Danger zone menu">
          <ListboxSection title="Danger zone" aria-label="Danger zone">
            <ListboxItem
              key="delete"
              className="text-danger"
              color="danger"
              aria-label="Permanently delete product"
              description="Permanently delete product"
              onClick={() => {
                setOpen(
                  <CustomDeleteAlertDailog
                    title="Are you absolutely sure?"
                    description="This action cannot be undone. This will permanently delete your Payment transaction from our servers."
                    isDeleting={isDeleting}
                    onDelete={()=>{}}
                    actionText="Delete Transaction"
                  />,
                );
              }}
              startContent={isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Icons.DeleteIcon className={cn(iconClasses, "text-danger")} />}
            >
              Delete
            </ListboxItem>
          </ListboxSection>
        </Listbox>
      </PopoverContent>
    </Popover>
  );
}
