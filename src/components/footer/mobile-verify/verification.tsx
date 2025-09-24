"use client";
import React, { FC, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
interface IVerification {
  onContinue: () => void;
  phone: string;
}

export const Verification: FC<IVerification> = ({ onContinue, phone }) => {
  const [loading, setLoading] = useState(false);
  const onContinueClick = async () => {
    setLoading(true);
    onContinue();
  };
  return (
    <div className="w-full">
      <CardHeader className="!p-0 !pb-9">
        <CardTitle className="text-2xl font-semibold text-white">
          Security Verification
        </CardTitle>
      </CardHeader>
      <CardContent className="w-full space-y-6 !p-0">
        <p className="text-base text-[#bfbfbf]">
          {`Subscribe to notifications at ${phone}? This action will set it as your default number.`}
        </p>
        <div className="flex gap-x-[10px]">
          <Button
            type="button"
            className={cn(
              "w-full !bg-[#e50914] text-sm !text-white hover:bg-[#e50914] hover:opacity-75",
            )}
            onClick={() => onContinueClick()}
          >
            Continue
            {loading && (
              <Loader2 className="animate-spin" width="20px" height="20px" />
            )}
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex w-full items-center justify-center !p-0"></CardFooter>
    </div>
  );
};

export default Verification;
