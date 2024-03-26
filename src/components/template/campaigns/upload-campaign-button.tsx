"use client";
import { CustomModal } from "@/components/global/custom-modal";
import { Button } from "@/components/ui/button";
import { useModal } from "@/providers/modal-provider";
import { FC } from "react";
import CampaignForm from "./campaign-form";

interface UploadProductButtonProps {
  user: {
    id: string;
    name: string;
  };
}

export const UploadCampaignButton: FC<UploadProductButtonProps> = ({ user }) => {
  const { setOpen } = useModal();
  return (
    <Button
      onClick={() =>
        setOpen(
          <CustomModal size="5xl" title={`Create a new campaign`} subheading={`Add this campaign for user ${user.name}`}>
            <CampaignForm type="create" user={user} />
          </CustomModal>,
        )
      }
      className="shrink-0"
    >
      Add Campaign
    </Button>
  );
};
