"use client";
import { cn } from "@/lib/utils";
import { useModal } from "@/providers/modal-provider";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, type ModalProps } from "@nextui-org/react";
import React from "react";
import { Separator } from "../ui/separator";

interface CustomModalProps extends ModalProps {
  title: string;
  subheading?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export const CustomModal = ({ children, defaultOpen, subheading, title, size, placement, scrollBehavior, className, ...props }: CustomModalProps) => {
  const { isOpen, setClose, setOpen } = useModal();
  return (
    <Modal
      {...props}
      isOpen={isOpen}
      placement={placement || "auto"}
      onOpenChange={setOpen}
      onClose={setClose}
      size={size}
      scrollBehavior={scrollBehavior || "inside"}
      className={cn("", className)}
      classNames={{
        wrapper: "[--slide-exit:0px] z-[200]",
        backdrop: "z-[200] bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <h3>{title}</h3>
              <p className="text-xs text-muted-foreground">{subheading}</p>
              <Separator className="mt-4" />
            </ModalHeader>
            <ModalBody>{children}</ModalBody>
            <ModalFooter></ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
