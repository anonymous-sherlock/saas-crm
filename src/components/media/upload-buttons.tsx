"use client";
import { useModal } from "@/providers/modal-provider";
import { CustomModal } from "../global/custom-modal";
import { Button } from "../ui/button";
import { FileUploadDialog } from "./file-upload-form";

type Props = {
  companyId: string;
};

const MediaUploadButton = ({ companyId }: Props) => {
  const { isOpen, setOpen, setClose } = useModal();

  return (
    <Button
      onClick={() => {
        setOpen(
          <CustomModal title="Upload Media" subheading="Upload a file to your media bucket" size="md" scrollBehavior="outside">
            <FileUploadDialog />
          </CustomModal>
        )
      }}
    >
      Upload
    </Button>
  );
};

export default MediaUploadButton;
