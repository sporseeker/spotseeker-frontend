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
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import { IApiResponse } from "@/types/response";

const passwordResetFormSchema = z.object({
  email: z.string().email("Invalid email format."),
});
type PasswordResetFormValues = z.infer<typeof passwordResetFormSchema>;
const defaultValues: Partial<PasswordResetFormValues> = {
  email: "",
};

export const PasswordResetForm = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const form = useForm<PasswordResetFormValues>({
    resolver: zodResolver(passwordResetFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const onSubmit = async (data: PasswordResetFormValues) => {
    try {
      setLoading(true);
      const res = await axios.post<IApiResponse>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/password/forgot`,
        {
          email: data.email,
        },
        {
          withXSRFToken: true,
        },
      );
      toast({
        title: "Password Reset",
        description: res.data.message
          ? res.data.message
          : "Password reset E-mail sent to your inbox.",
      });
      router.push("/");
      setLoading(false);
    } catch (error: unknown) {
      setLoading(false);
      toast({
        title: "Error",
        description:
          "Failed to send reset password email. Please try agin later",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full max-w-sm">
      <CardHeader className="!p-0">
        <CardTitle className="mb-[20px] text-[20px] font-semibold text-white lg:mb-[24px] lg:text-[24px]">
          Forgot Password?
        </CardTitle>
        <CardDescription className="!mb-[20px] !mt-0 text-16 leading-[1.5] text-grey-350 lg:!mb-[24px]">
          Enter the email address associated with your account.
        </CardDescription>
      </CardHeader>
      <CardContent className="mb-[20px] space-y-6 !p-0 lg:mb-[36px]">
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid">
            <div className="space-y-3">
              <Controller
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormTextField
                    {...field}
                    placeholder="Email Address"
                    type="email"
                  />
                )}
              />
            </div>
            <Button
              disabled={loading}
              type="submit"
              className={cn(
                "!m-0 !mt-[24px] min-h-[46px] w-full gap-x-[8px] py-0 !text-white hover:opacity-95",
                form.formState.isValid
                  ? "bg-primary-600 hover:bg-primary-600"
                  : "bg-primary-600/50 hover:bg-primary-600/50",
              )}
            >
              {loading ? (
                "Processing..."
              ) : (
                <>
                  Proceed <ChevronRight className="h-[16px] w-[16px]" />
                </>
              )}
            </Button>
          </form>
        </FormProvider>
      </CardContent>
      <CardFooter className="flex justify-center !p-0">
        <span className="!p-0 text-sm !leading-none text-[#8c8c8c]">
          <Button
            variant="link"
            onClick={() => router.push("/auth/signin")}
            className="h-auto p-0 px-2 !text-[#e50914] underline hover:opacity-75"
          >
            Back to Login
          </Button>
        </span>
      </CardFooter>
    </div>
  );
};
