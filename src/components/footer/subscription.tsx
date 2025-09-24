"use client";
import { toast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { SubscribeType } from "@/types/subscribe";
import { AxiosError } from "axios";
import { IApiResponse } from "@/types/response";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import OtpForm from "../auth/otp-form";
import Verification from "./mobile-verify/verification";
import http from "@/lib/http";

const formSchema = z.object({
  phone_no: z.string().regex(/^[0]{1}[7]{1}[01245678]{1}[0-9]{7}$/, {
    message: "Phone number must be in the format 0771234567 o4761234567",
  }),
});

const Subscription = () => {
  const { data: session, status, update } = useSession();
  const [open, setOpen] = useState(false);
  const [verify, setVerify] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phone_no: "",
    },
  });
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (status === "authenticated") {
      if (
        values.phone_no === session.user?.phone_no &&
        session.user?.verified
      ) {
        try {
          await http.post(`/api/subscribe`, {
            mobile_no: phone_no,
            type: SubscribeType.ALL,
          });
          toast({
            title: "Subscribe",
            description: "Successfully Subscribed",
          });
        } catch (error) {
          toast({
            title: "Subscribe Failed",
            description: (error as AxiosError<IApiResponse>)?.response?.data
              .message
              ? (error as AxiosError<IApiResponse>)?.response?.data.message
              : (error as Error).message,
            variant: "destructive",
          });
        }
      } else {
        setVerify(false);
        setOpen(true);
      }
    }
  };
  const phone_no = form.watch("phone_no");
  const subscribeAndVerify = async (phone_no: string) => {
    try {
      await http.post(`/api/subscribe`, {
        mobile_no: phone_no,
        type: SubscribeType.ALL,
      });
      await update({
        ...session?.user,
        verified: false,
        phone_no,
      });
      setVerify(true);
    } catch (error) {
      setOpen(false);
      toast({
        title: "Subscribe Failed",
        description: (error as AxiosError<IApiResponse>)?.response?.data.message
          ? (error as AxiosError<IApiResponse>)?.response?.data.message
          : (error as Error).message,
        variant: "destructive",
      });
    }
  };

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        onClick={() => {
          if (status === "unauthenticated") {
            toast({
              title: "Login Required",
              description: "Please log in to access subscription features",
              variant: "destructive",
            });
            router.push("/auth/signin", { scroll: true });
          }
        }}
      >
        <div className="flex w-full max-w-[400px]">
          <Controller
            name="phone_no"
            control={form.control}
            rules={{
              validate: (value) =>
                /^[0-9]*$/.test(value) || "Only numbers are allowed",
            }}
            render={({ field, fieldState: { error, isTouched, isDirty } }) => (
              <Input
                {...field}
                placeholder="Enter mobile number"
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, "");
                  field.onChange(value);
                }}
                className={cn(
                  "h-[46px] w-full flex-grow basis-0 rounded-[8px] !rounded-r-none !border-r-0 border-gray-400 border-white/[16%] !bg-black/40 !text-14 text-grey-100 placeholder:!text-14 hover:!ring-0 focus:!ring-0",
                  (isTouched && isDirty) || form.formState.isSubmitted
                    ? error
                      ? "!ring-1 !ring-primary-900 hover:!ring-1 focus:!ring-1"
                      : ""
                    : "",
                )}
              />
            )}
          />
          <Button
            variant="ghost"
            className="h-[46px] basis-[106px] rounded-[8px] !rounded-l-none !bg-primary-600 text-14 !text-white hover:!bg-primary-600 hover:opacity-75"
            type="submit"
          >
            Subscribe
          </Button>
        </div>
      </form>
      <Dialog onOpenChange={setOpen} open={open}>
        <DialogContent className="!gap-0 rounded-xl border border-neutral-800 bg-[#181818]/90 sm:max-w-[425px]">
          <DialogHeader className="invisible">
            <DialogTitle></DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          {verify ? (
            <OtpForm
              onVerify={async () => {
                setOpen(false);
                await update({
                  ...session?.user,
                  verified: true,
                });
                toast({
                  title: "Subscribe",
                  description: "Successfully Subscribed",
                });
              }}
            />
          ) : (
            <Verification
              onContinue={async () => {
                await subscribeAndVerify(phone_no);
                form.reset();
              }}
              phone={phone_no}
            />
          )}
          <DialogFooter className="invisible"></DialogFooter>
        </DialogContent>
      </Dialog>
    </FormProvider>
  );
};

export default Subscription;
