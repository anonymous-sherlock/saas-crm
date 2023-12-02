"use client";
import { trpc } from "@/app/_trpc/client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { AxiosError } from "axios";
import { Loader2, Trash } from "lucide-react";

interface DeleteCampaignProps {
  campaignId: string
}

export function DeleteCampaign({ campaignId }: DeleteCampaignProps) {

  const utils = trpc.useUtils();

  const { mutateAsync: deleteCampaign, isLoading: isDeletingCampaign } = trpc.campaign.deleteCampaign.useMutation({
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 500) {
          return toast({
            title: "Cannot Delete Campaign.",
            description: "",
            variant: "destructive",
          });
        }
      }
    },
    onSuccess: (data) => {
      toast({
        title: `${data.deletedCampaign.count} Campaign Deleted succesfully`,
        description: "",
        variant: "success",
      });
      utils.campaign.getAll.invalidate()
    },
  })

  function handleCampaignDelete() {
    deleteCampaign({ campaignIds: [campaignId] });
  }
  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button size="sm" className="w-full" variant="destructive">
            {isDeletingCampaign ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash className="h-4 w-4" />}
          </Button>
        </AlertDialogTrigger>
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
            <AlertDialogAction
              onClick={handleCampaignDelete}
              disabled={isDeletingCampaign}
              className={buttonVariants({ variant: "destructive" })}
            >
              {isDeletingCampaign ? "Deleting..." : "Delete Campaign"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}