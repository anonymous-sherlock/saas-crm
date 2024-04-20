"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DEFAULT_LOW_BALANCE_THRESHOLD } from "@/constants/index";
import { Card, Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/react";
import { AlertOctagon, AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";
import LowBalanceCard from "../cards/low-balance-card";

interface LowBalanceAlertProps {
  balance: number;
}
export function LowBalanceAlert({ balance }: LowBalanceAlertProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    console.log(DEFAULT_LOW_BALANCE_THRESHOLD, balance);
    if (balance <= DEFAULT_LOW_BALANCE_THRESHOLD) {
      setIsOpen(true);
    }
  }, [balance]);
  return (
    <Modal
      backdrop="blur"
      isOpen={isOpen}
      size="md"
      onOpenChange={setIsOpen}
      scrollBehavior="outside"
      isDismissable={false}
      classNames={{}}
      placement="auto"
      closeButton={false}
    >
      <ModalContent>
        <>
          <ModalBody>
            <LowBalanceCard />
          </ModalBody>
        </>
      </ModalContent>
    </Modal>
  );
}
