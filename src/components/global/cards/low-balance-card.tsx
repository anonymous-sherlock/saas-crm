import { AlertOctagon } from "lucide-react";
import React from "react";

export default function LowBalanceCard() {
  return (
    <div className="sm:mx-auto p-6 max-w-[500px] flex flex-col justify-center items-center">
      <div className="mx-auto flex justify-center flex-col items-center">
        <AlertOctagon className="w-14 h-14 text-yellow-500 my-2" />
        <h2 className="text-2xl my-2 text-center">Low Balance Alert!</h2>
        <p className="text-center text-sm">
          We regret to inform you that your account balance is currently low. Kindly reach out to your advertiser manager for assistance.
        </p>
      </div>
    </div>
  );
}
