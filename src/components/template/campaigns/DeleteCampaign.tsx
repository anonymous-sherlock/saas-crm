"use client";
import { Icons } from "@/components/Icons";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Listbox, ListboxItem, ListboxSection } from "@nextui-org/react";
import { Loader2 } from "lucide-react";
import { useState } from "react";

interface DeleteCampaignProps {
  campaignId: string,
  onDelete: () => void,
  isDeleting: boolean
}

export function DeleteCampaign({ campaignId, isDeleting, onDelete }: DeleteCampaignProps) {
  const [open, setOpen] = useState<boolean>(false)


  const iconClasses = "text-xl text-default-500 pointer-events-none flex-shrink-0";
  return (
    <>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <Listbox variant="faded" aria-label="Campaign Danger zone menu">
          <ListboxSection title="Danger zone" aria-label='Danger zone' >
            <ListboxItem key="delete" className="text-danger" color="danger"
              aria-label='Permanently delete campaign'
              description="Permanently delete campaign"
              onClick={() => {
                setOpen(true)
              }}
              startContent={isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Icons.DeleteIcon className={cn(iconClasses, "text-danger")} />} >
              Delete campaign
            </ListboxItem>
          </ListboxSection>
        </Listbox>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              Campaign and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onDelete} disabled={isDeleting} className={buttonVariants({ variant: "destructive" })}>
              {isDeleting ? "Deleting..." : "Delete Campaign"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}