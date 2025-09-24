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
import { reSendOTP } from "@/services/otp-service";
import { toast } from "@/hooks/use-toast";
import { AxiosError } from "axios";
import { IApiResponse } from "@/types/response";
import { useSession } from "next-auth/react";
interface IVerification {
  onContinue: () => void;
}

export const Verification: FC<IVerification> = ({ onContinue }) => {
  const { data: session } = useSession();
  const maskMobileNumber = (number: string) => {
    const last4Digits = number.slice(-4);
    return `${number.slice(0, 2)}XXXXXX${last4Digits}`;
  };
  const [loading, setLoading] = useState(false);
  const onContinueClick = async () => {
    try {
      await reSendOTP();
      setLoading(true);
      onContinue();
    } catch (error) {
      toast({
        title: "OTP Resend Failed",
        description: (error as AxiosError<IApiResponse>)?.response?.data.message
          ? (error as AxiosError<IApiResponse>)?.response?.data.message
          : (error as Error).message,
        variant: "destructive",
      });
    }
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
          {`Are you sure you want to send the OTP to ${session?.user?.phone_no ? maskMobileNumber(session?.user?.phone_no) : ""} for verification? Please ensure
          that the information you've entered is correct before proceeding.`}
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
