import { Copy } from "lucide-react";
import { Button } from "../ui/button";
import { ButtonHTMLAttributes, FC } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface CopyButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  valueToCopy: string;
  label: string;
}
export const CopyButton: FC<CopyButtonProps> = ({ valueToCopy, label, className, ...props }) => {
  return (
    <Button
      {...props}
      type="button"
      onClick={() => {
        navigator.clipboard.writeText(valueToCopy);
        toast.success("Copied", {
          description: `${label} copied to clipboard`,
        });
      }}
      variant="ghost"
      className={cn("", className)}
    >
      <Copy className="h-5 w-5" />
    </Button>
  );
};
