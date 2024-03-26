"use client";
import React from "react";
import CampaignForm from "./campaign-form";
import { trpc } from "@/app/_trpc/client";
import { Spinner } from "@nextui-org/react";

type Props = {
  campaignId: string;
  userId: string;
};

export const UpdateCampaignForm = ({ campaignId, userId }: Props) => {
  const { data: campaign, isLoading, isFetching } = trpc.campaign.get.useQuery({ camapaingId: campaignId, userId: userId });

  if (isLoading || !campaign) {
    return (
      <div>
        <Spinner size="md" />
      </div>
    );
  }
  return <CampaignForm type="update" user={campaign?.user} data={campaign} />;
};
