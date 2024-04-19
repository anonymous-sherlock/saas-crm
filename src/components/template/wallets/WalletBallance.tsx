import { buttonVariants } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { Wallet } from "lucide-react";
import Link from "next/link";
import { FC } from "react";

interface WalletBalanceProps {
  balance: number;
}

export const WalletBalance: FC<WalletBalanceProps> = ({ balance }) => {
  return (
    <Link
      href="/user/profile/wallet"
      className={buttonVariants({
        variant: "ghost",
        size: "sm",
      })}
    >
      <div className="flex gap-2 items-center justify-center">
        <Wallet size={19} />
        {formatPrice(balance)}
      </div>
    </Link>
  );
};
