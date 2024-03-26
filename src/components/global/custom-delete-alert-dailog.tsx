import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spinner, type ModalProps } from "@nextui-org/react";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { useModal } from "@/providers/modal-provider";

interface CustomAlertDailogProps {
  title: string;
  description: string;
  isDefaultOpen?: boolean;
  isDeleting: boolean;
  onDelete: () => void;
  actionText: string;
}
export const CustomDeleteAlertDailog = ({ title, description, isDefaultOpen, isDeleting, onDelete, actionText }: CustomAlertDailogProps) => {
  const { isOpen, setClose, setOpen } = useModal();

  function handleClick() {
    setClose();
    onDelete();
  }
  return (
    <Modal
      size="lg"
      backdrop="blur"
      defaultOpen={isDefaultOpen}
      isOpen={isOpen}
      onOpenChange={setOpen}
      onClose={setClose}
      classNames={{
        wrapper: "[--slide-exit:0px] z-[200]",
        backdrop: "z-[200]",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 mb-0 pb-0">{title}</ModalHeader>
            <ModalBody>{description}</ModalBody>
            <ModalFooter>
              <Button color="danger" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleClick} disabled={isDeleting}>
                {isDeleting ? <Spinner size="sm" color="danger" /> : actionText}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
