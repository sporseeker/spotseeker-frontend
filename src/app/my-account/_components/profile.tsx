"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ProfileForm from "./profile-form";
import http from "@/lib/http";
import { removeTopLevelNullValues } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import { AxiosError } from "axios";
import { IApiResponse } from "@/types/response";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import OtpForm from "@/components/auth/otp-form";
import { IProfile } from "@/types/profile";
const formSchema = z
  .object({
    first_name: z
      .string()
      .min(2, { message: "First name must be at least 2 characters." })
      .max(30, {
        message: "First name must not be longer than 30 characters.",
      }),
    last_name: z
      .string()
      .min(2, { message: "Last name must be at least 2 characters." })
      .max(30, {
        message: "Last name must not be longer than 30 characters.",
      }),
    nic: z.string().min(2, { message: "must be at least 2 characters." }),
    email: z.string().email({ message: "Invalid email address" }),
    phone_no: z.string().regex(/^[0]{1}[7]{1}[01245678]{1}[0-9]{7}$/, {
      message: "Phone number must be in the format 0771234567 o4761234567",
    }),

    password: z.string().optional(),
    password_confirmation: z.string().optional(),
  })
  .refine(
    (data) =>
      data.password || data.password_confirmation
        ? data.password?.length &&
          data.password?.length >= 8 &&
          data.password_confirmation?.length &&
          data.password_confirmation?.length >= 8
        : true,
    {
      message:
        "Password and confirmation must both be at least 8 characters if either is entered.",
      path: ["password_confirmation"],
    },
  )
  .refine(
    (data) =>
      data.password === data.password_confirmation ||
      (!data.password && !data.password_confirmation),
    {
      message: "Passwords must match if both are provided.",
      path: ["password_confirmation"],
    },
  );

export const Profile: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { data: session, update } = useSession();
  const handleEdit = () => {
    setIsEditing(true);
  };
  const handleDiscard = () => {
    setIsEditing(false);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),

    defaultValues: {
      first_name: session?.user?.first_name ?? "",
      last_name: session?.user?.last_name ?? "",
      email: session?.user?.email ?? "",
      phone_no: session?.user?.phone_no ?? "",
      nic: session?.user?.nic ?? "",
      password: "",
      password_confirmation: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      const data = await http.post<IApiResponse<IProfile>>(
        "/api/user/profile",
        {
          ...(removeTopLevelNullValues(values) ?? {}),
        },
      );

      await update({
        first_name: data.data.data.first_name,
        last_name: data.data.data.last_name,
        phone_no: data.data.data.phone_no,
        verified: data.data.data.verified,
        nic: data.data.data.nic,
      });

      if (!data.data.data.verified) {
        setOpen(true);
      } else {
        toast({
          title: "Successful",
          description: "Changes have been saved",
        });
      }

      setIsLoading(false);
      setIsEditing(false);
    } catch (error) {
      setIsLoading(false);
      const errors = (error as AxiosError<IApiResponse>)?.response?.data.errors;
      if (Array.isArray(errors)) {
        errors.forEach((err) => {
          toast({
            title: "Profile update failed",
            description: err,
            variant: "destructive",
          });
        });
      } else {
        toast({
          title: "Profile update failed",
          description:
            ((errors as string) || (error as Error).message) ??
            "Please try agin later",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex w-full flex-col space-y-5 lg:w-[912px]">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-white sm:text-2xl">
              Profile
            </h1>
            {isEditing ? (
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  className="h-9 border !border-[#1f1f1f] bg-transparent px-3 text-xs font-bold !text-white hover:bg-transparent hover:opacity-75 sm:text-sm"
                  type="button"
                  disabled={isLoading}
                  onClick={() => {
                    handleDiscard();
                    form.reset();
                  }}
                >
                  Discard
                </Button>
                <Button
                  variant="noHover"
                  className="h-9 !bg-[#e50914] px-3 text-xs font-bold !text-white hover:opacity-75 sm:text-sm"
                  type="submit"
                >
                  Save Changes
                  {isLoading && (
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
                onClick={handleEdit}
              >
                Edit
              </Button>
            )}
          </div>
          <ProfileForm
            disabled={!isEditing}
            showVerifyBtn={
              !(session?.user?.verified ?? false) && !!session?.user?.phone_no
            }
          />
        </div>
      </form>
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
    </FormProvider>
  );
};
