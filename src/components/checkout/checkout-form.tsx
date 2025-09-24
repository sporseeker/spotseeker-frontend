"use client";
import React, { Dispatch, FC, useState } from "react";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import { FieldValues, SubmitHandler, useFormContext } from "react-hook-form";
import { cn, removeTopLevelNullValues } from "@/lib/utils";
import { VerifyMobile } from "@/app/my-account/_components/verify-mobile";
import { useSession } from "next-auth/react";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { UserResponseType, UserType } from "@/types/user";
import http from "@/lib/http";
import { IApiResponse } from "@/types/response";
import { z } from "zod";
import { formSchema } from "./checkout";
import { AxiosError } from "axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import OtpForm from "../auth/otp-form";
interface ICheckoutForm {
  isEditing: boolean;
  setIsEditing: Dispatch<boolean>;
}
const CheckoutForm: FC<ICheckoutForm> = ({ isEditing, setIsEditing }) => {
  const {
    control,
    reset,
    handleSubmit,
    formState: { isSubmitting, isValid, isDirty },
  } = useFormContext();
  const [open, setOpen] = useState(false);
  const { data: session, update, status } = useSession();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const phoneChanged = values.phone !== session?.user?.phone_no;
      // if (!session?.user?.verified && !phoneChanged) {
      //   setError("phone", { message: "Please verify your phone" });
      //   toast({
      //     title: "Verify your mobile",
      //     description: "Please verify your mobile number before continuing.",
      //     variant: "destructive",
      //   });
      //   // setIsLoading(false);
      //   return;
      // }
      if (!session?.user) {
        console.error("User session is not defined");
        return;
      }
      const updatedValues = Object.entries({
        email: values.email,
        nic: values.nic,
        phone_no: values.phone,
        first_name: values.firstName,
        last_name: values.lastName,
      }).reduce(
        (acc, [key, value]) => {
          const typedKey = key as keyof Pick<
            UserType,
            "email" | "nic" | "phone_no" | "first_name" | "last_name"
          >;
          if (session.user && session.user[typedKey] !== value) {
            acc[typedKey] = value;
          }
          return acc;
        },
        {} as Pick<
          UserType,
          "email" | "nic" | "phone_no" | "first_name" | "last_name"
        >,
      );

      if (Object.keys(updatedValues).length > 0) {
        const res = await http.post<IApiResponse<UserResponseType>>(
          "/api/user/profile",
          {
            ...(removeTopLevelNullValues({
              email: values.email,
              nic: values.nic,
              phone_no: values.phone,
              first_name: values.firstName,
              last_name: values.lastName,
            }) ?? {}),
          },
        );

        await update({
          ...session?.user,
          first_name: res.data.data.first_name,
          last_name: res.data.data.last_name,
          phone_no: res.data.data.phone_no,
          verified: res.data.data.verified,
          nic: res.data.data.nic,
        });
        if (phoneChanged) {
          // setIsLoading(false);
          setOpen(true);
          setIsEditing(false);
          return;
        }
      }
      // setIsLoading(false);
      setIsEditing(false);
    } catch (error) {
      const errors = (error as AxiosError<IApiResponse>)?.response?.data.errors;
      if (Array.isArray(errors)) {
        errors.forEach((err) => {
          toast({
            title: "Order failed",
            description: err,
            variant: "destructive",
          });
        });
      } else {
        toast({
          title: "Order failed",
          description:
            ((errors as string) || (error as Error).message) ??
            "Please try agin later",
          variant: "destructive",
        });
      }
      // setIsLoading(false);
    }
  };

  return (
    <div className="rounded-[12px] border border-grey-550 bg-grey-650 px-[16px] py-[24px] lg:px-[28px] lg:py-[24px]">
      <div className="mb-[15px] flex items-center justify-between">
        <h2 className="text-16 font-semibold text-grey-100 lg:text-20">
          Billing Information
        </h2>
        {status === "authenticated" ? (
          <div className="flex w-full justify-end">
            {isEditing ? (
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  className="h-9 border !border-[#1f1f1f] bg-transparent px-3 text-xs font-bold !text-white hover:bg-transparent hover:opacity-75 sm:text-sm"
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => {
                    setIsEditing(false);
                    reset();
                  }}
                >
                  Discard
                </Button>
                <Button
                  variant="noHover"
                  className="h-9 gap-x-[5px] !bg-[#e50914] px-3 text-xs font-bold !text-white hover:opacity-75 sm:text-sm"
                  type="button"
                  disabled={isSubmitting || (isValid && !isDirty)}
                  onClick={handleSubmit(onSubmit as SubmitHandler<FieldValues>)}
                >
                  Save Changes
                  {isSubmitting && (
                    <Loader2
                      className="animate-spin"
                      width="20px"
                      height="20px"
                    />
                  )}
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                className="h-9 !border-[#434343] bg-transparent px-3 text-xs !text-white hover:bg-transparent sm:text-sm"
                type="button"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </Button>
            )}
          </div>
        ) : (
          false
        )}
      </div>

      <div>
        <div className="grid grid-cols-1 gap-x-[20px] gap-y-[20px] pb-[10px] lg:grid-cols-2 lg:gap-y-[28px] lg:pb-[10px]">
          <FormField
            control={control}
            name="firstName"
            render={({ field, formState: { errors } }) => (
              <FormItem>
                {/* <FormLabel className="text-14 text-grey-300">
                  First Name
                </FormLabel> */}
                <FormControl>
                  <Input
                    placeholder="First Name"
                    disabled={!isEditing}
                    {...field}
                    className={cn(
                      "h-[42px] rounded-[8px] border bg-black/[15%] text-14 text-grey-100 placeholder:text-14 placeholder:text-grey-300/50",
                      errors.firstName
                        ? "border-primary-600"
                        : "border-white/[8%]",
                    )}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="lastName"
            render={({ field, formState: { errors } }) => (
              <FormItem>
                {/* <FormLabel className="text-14 text-grey-300">
                  Last Name
                </FormLabel> */}
                <FormControl>
                  <Input
                    placeholder="Last Name"
                    disabled={!isEditing}
                    {...field}
                    className={cn(
                      "h-[42px] rounded-[8px] border bg-black/[15%] text-14 text-grey-100 placeholder:text-14 placeholder:text-grey-300/50",
                      errors.lastName
                        ? "border-primary-600"
                        : "border-white/[8%]",
                    )}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="email"
            render={({ field, formState: { errors } }) => (
              <FormItem>
                {/* <FormLabel className="text-14 text-grey-300">
                  Email Address
                </FormLabel> */}
                <FormControl>
                  <Input
                    placeholder="Email Address"
                    disabled={!(!session?.user?.email && isEditing)}
                    {...field}
                    className={cn(
                      "h-[42px] rounded-[8px] border bg-black/[15%] text-14 text-grey-100 placeholder:text-14 placeholder:text-grey-300/50",
                      errors.email ? "border-primary-600" : "border-white/[8%]",
                    )}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <div className="relative">
            <FormField
              control={control}
              name="phone"
              render={({ field, formState: { errors } }) => (
                <FormItem>
                  {/* <FormLabel className="text-14 text-grey-300">
                    Phone Number
                  </FormLabel> */}
                  <FormControl>
                    <Input
                      placeholder="Phone Number"
                      {...field}
                      disabled={!isEditing}
                      className={cn(
                        "h-[42px] rounded-[8px] border bg-black/[15%] text-14 text-grey-100 placeholder:text-14 placeholder:text-grey-300/50",
                        errors.phone
                          ? "border-primary-600"
                          : "border-white/[8%]",
                      )}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            {!session?.user?.verified &&
            !isEditing &&
            session?.user?.phone_no ? (
              <VerifyMobile />
            ) : (
              ""
            )}
          </div>
          <FormField
            control={control}
            name="nic"
            render={({ field, formState: { errors } }) => (
              <FormItem>
                {/* <FormLabel className="text-14 text-grey-300">
                  NIC / Driving License / Passport
                </FormLabel> */}
                <FormControl>
                  <Input
                    placeholder="NIC / Driving License / Passport"
                    disabled={!isEditing}
                    {...field}
                    className={cn(
                      "h-[42px] rounded-[8px] border bg-black/[15%] text-14 text-grey-100 placeholder:text-14 placeholder:text-grey-300/50",
                      errors.nic ? "border-primary-600" : "border-white/[8%]",
                    )}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="agree"
            render={({ field, formState: { errors } }) => (
              <FormItem className="lg:col-span-2">
                <div className="flex items-center gap-x-[12px]">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className={cn(
                        "rounded-[4px] bg-white/[4%]",
                        errors.agree
                          ? "border-primary-600"
                          : "border-white/[8%]",
                      )}
                    />
                  </FormControl>
                  <FormLabel className="!m-0 text-12 text-grey-300 lg:text-14">
                    I accept and agree to Terms and Conditions
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />
        </div>
      </div>
      <Dialog onOpenChange={setOpen} open={open}>
        <DialogContent className="!gap-0 rounded-xl border border-neutral-800 bg-[#181818]/90 sm:max-w-[425px]">
          <DialogHeader className="invisible">
            <DialogTitle></DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <OtpForm onVerify={() => setOpen(false)} />
          <DialogFooter className="invisible"></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CheckoutForm;
