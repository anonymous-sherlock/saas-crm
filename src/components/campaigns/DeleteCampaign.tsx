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
import { toast as hotToast } from "react-hot-toast";
import { AxiosError } from "axios";
import { Loader2, Trash } from "lucide-react";

interface DeleteCampaignProps {
  campaignId: string
}

export function DeleteCampaign({ campaignId }: DeleteCampaignProps) {

  const utils = trpc.useUtils();

  const { mutateAsync: deleteCampaign, isLoading: isDeletingCampaign } = trpc.campaign.deleteCampaign.useMutation({
    onSuccess: (data) => {
      utils.campaign.getAll.invalidate()
    },
  })

  function handleCampaignDelete() {
    hotToast.promise(
      deleteCampaign({ campaignIds: [campaignId] }),
			{
				loading: 'Deleting campaign...',
				success: "Campaign deleted successfully!",
				error: "Could not delete campaign.",
			}
		);

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