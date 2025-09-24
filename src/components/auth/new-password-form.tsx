"use client";
import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { FormTextField } from "./form-field";
import { useRouter, useSearchParams } from "next/navigation";
import { FC, useState } from "react";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import { IApiResponse } from "@/types/response";

const passwordResetFormSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters long"),
  password_confirmation: z
    .string()
    .min(8, "Password must be at least 8 characters long"),
});
type PasswordResetFormValues = z.infer<typeof passwordResetFormSchema>;
const defaultValues: Partial<PasswordResetFormValues> = {
  password: "",
  password_confirmation: "",
};
interface INewPasswordForm {
  token: string;
}
export const NewPasswordForm: FC<INewPasswordForm> = ({ token }) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const form = useForm<PasswordResetFormValues>({
    resolver: zodResolver(passwordResetFormSchema),
    defaultValues,
    mode: "onChange",
  });
  const searchParams = useSearchParams();

  const onSubmit = async (data: PasswordResetFormValues) => {
    try {
      setLoading(true);
      await axios.post<IApiResponse>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/password/reset`,
        {
          email: searchParams?.get("email"),
          token,
          password: data.password,
          password_confirmation: data.password_confirmation,
        },
        {
          withXSRFToken: true,
        },
      );
      toast({
        title: "Password reset successful",
        description: "Please login using new password",
      });
      router.push("/auth/signin");
      setLoading(false);
    } catch (error: unknown) {
      setLoading(false);
      toast({
        title: "Error",
        description: "Password reset unsuccessful. Please try agin later",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full max-w-sm">
      <CardHeader className="!p-0">
        <CardTitle className="mb-[20px] text-[20px] font-semibold text-white lg:mb-[24px] lg:text-[24px]">
          Create New Password
        </CardTitle>
        <CardDescription className="!mb-[20px] !mt-0 text-16 leading-[1.5] text-grey-350 lg:!mb-[24px]">
          Enter at least 8 characters, including a number and a special symbol.
        </CardDescription>
      </CardHeader>
      <CardContent className="mb-[20px] space-y-6 !p-0 lg:mb-[36px]">
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid">
            <div className="space-y-3">
              <Controller
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormTextField
                    {...field}
                    placeholder="New Password"
                    type="password"
                  />
                )}
              />
              <Controller
                name="password_confirmation"
                control={form.control}
                render={({ field }) => (
                  <FormTextField
                    {...field}
                    placeholder="Confirm Password"
                    type="password"
                  />
                )}
              />
            </div>
            <Button
              disabled={loading}
              type="submit"
              className={cn(
                "!m-0 !mt-[20px] min-h-[46px] w-full gap-x-[8px] !bg-primary-600 py-0 !text-white hover:opacity-75 lg:!mt-[24px]",
              )}
            >
              {loading ? (
                "Processing..."
              ) : (
                <>
                  Finish <ChevronRight className="h-[16px] w-[16px]" />
                </>
              )}
            </Button>
          </form>
        </FormProvider>
      </CardContent>
      <CardFooter className="hidden justify-center !p-0"></CardFooter>
    </div>
  );
};
