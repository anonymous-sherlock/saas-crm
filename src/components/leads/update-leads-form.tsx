"use client";
import React from "react";
import { trpc } from "@/app/_trpc/client";
import { Spinner } from "@nextui-org/react";
import { LeadsEditForm } from "./leads-edit-form";
import { RouterOutputs } from "@/server";

type Props = {
  leadId: string;
  data?: RouterOutputs["lead"]["getLeadDetails"];
};

export const UpdateLeadForm = ({ leadId, data }: Props) => {
  const {
    data: lead,
    isLoading,
    isFetching,
  } = trpc.lead.getLeadDetails.useQuery(
    { leadId: leadId },
    {
      initialData: data,
    },
  );

  if (isLoading || !lead) {
    return (
      <div>
        <Spinner size="md" />
      </div>
    );
  }
  return <LeadsEditForm data={lead} />;
};
