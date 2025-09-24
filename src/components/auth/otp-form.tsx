"use client";
import React, { FC, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import http from "@/lib/http";
import { toast } from "@/hooks/use-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { reSendOTP } from "@/services/otp-service";
import { AxiosError } from "axios";
import { IApiResponse } from "@/types/response";

const FormSchema = z.object({
  otp: z.string().min(5, {
    message: "OTP must be 5 characters.",
  }),
});
interface IOtpForm {
  onVerify?: () => void;
}
const OTP_RESEND_TIME_OUT = process.env.NEXT_PUBLIC_OTP_RESEND_TIME_OUT
  ? (parseInt(process.env.NEXT_PUBLIC_OTP_RESEND_TIME_OUT) ?? 60)
  : 60;
export const OtpForm: FC<IOtpForm> = ({ onVerify }) => {
  const { data: session, update } = useSession();
  const [isDisabled, setIsDisabled] = useState(false);
  const [counter, setCounter] = useState(0);
  const router = useRouter();
  const searchParams = useSearchParams();

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      await http.post("/api/auth/mobile/verify", { token: data.otp });
      update({
        ...session?.user,
        verified: true,
      });
      if (searchParams?.get("getting-started")) {
        const event = searchParams?.get("event");
        router.push(
          event
            ? `/event/${event}?getting-started=true`
            : "/?getting-started=true",
        );
      }
      if (onVerify) {
        onVerify();
      }
    } catch (error) {
      toast({
        title: "OTP verification Failed",
        description: "Please try agin later",
        variant: "destructive",
      });
    }
  };

  const onResend = async () => {
    try {
      await reSendOTP();
      setIsDisabled(true);
      setCounter(OTP_RESEND_TIME_OUT);
    } catch (error) {
      console.error(error as AxiosError<IApiResponse>);

      toast({
        title: "OTP Resend Failed",
        description: (error as AxiosError<IApiResponse>)?.response?.data.message
          ? (error as AxiosError<IApiResponse>)?.response?.data.message
          : (error as Error).message,
        variant: "destructive",
      });
    }
  };

  const maskMobileNumber = (number: string) => {
    const last4Digits = number.slice(-4);
    return `${number.slice(0, 2)}XXXXXX${last4Digits}`;
  };
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      otp: "",
    },
  });

  useEffect(() => {
    if (counter > 0) {
      const timer = setTimeout(() => {
        setCounter(counter - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setIsDisabled(false);
    }
  }, [counter]);
  return (
    <div className="w-full">
      <CardHeader className="!p-0 !pb-9">
        <CardTitle className="text-2xl font-semibold text-white">
          Security Verification
        </CardTitle>
      </CardHeader>
      <CardContent className="w-full space-y-6 !p-0 !pb-9">
        <p className="text-base text-[#bfbfbf]">
          Enter the 5 digit security code sent to your mobile number{" "}
          {session?.user?.phone_no
            ? maskMobileNumber(session?.user?.phone_no)
            : ""}
        </p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6"
          >
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputOTP
                      maxLength={5}
                      className="flex w-full justify-between gap-2 md:gap-4"
                      {...field}
                    >
                      {[...Array(5)].map((_, index) => (
                        <InputOTPGroup key={index} className="w-full">
                          <InputOTPSlot
                            index={index}
                            className="h-12 w-full border-white/10 bg-white/5 text-center text-white !ring-0 md:h-14"
                          />
                        </InputOTPGroup>
                      ))}
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className={cn(
                "w-full !bg-[#e50914] text-sm !text-white hover:bg-[#e50914] hover:opacity-75",
              )}
            >
              Verify {">"}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex w-full items-center justify-center !p-0">
        {isDisabled ? (
          <p className="text-14">{`Resend OTP in ${counter}s`}</p>
        ) : (
          <Button
            variant="link"
            onClick={() => onResend()}
            className={
              "h-auto min-h-0 p-0 text-14 !text-[#e50914] hover:text-[#e50914]/90"
            }
          >
            Resend Code
          </Button>
        )}
      </CardFooter>
    </div>
  );
};

export default OtpForm;
