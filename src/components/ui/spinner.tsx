import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import React from "react";

interface Props {
  className?: string
}

const Spinner = ({ className }: Props) => {
  return (
    <Loader2 className={cn("mr-3 h-5 w-5 animate-spin", className)} />
  );
};

export default Spinner;
