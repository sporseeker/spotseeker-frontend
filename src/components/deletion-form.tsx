"use client";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import {
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { FormTextField } from "../components/auth/form-field";
import { useRouter, useSearchParams } from "next/navigation";
import SocialLogin from "../components/auth/social-login";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { AxiosError } from "axios";

const loginFormSchema = z.object({
  email: z.string().email("Invalid email format."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});
type LoginFormValues = z.infer<typeof loginFormSchema>;
const defaultValues: Partial<LoginFormValues> = {
  email: "",
  password: "",
};

export const DeletionForm = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const event = searchParams?.get("event");
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setLoading(true);
      const res = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });
      if (res?.error) {
        throw new Error("Authentication failure");
      }
      toast({
        title: "Login Successful",
        description: "You have successfully logged in.",
      });
      setLoading(false);
      if (event) {
        router.push(`/event/${event}`);
      } else {
        router.push("/");
      }
    } catch (error: unknown) {
      setLoading(false);
      if (
        (error as AxiosError).response &&
        (error as AxiosError)?.response?.status === 422
      ) {
        const axiosError = error as AxiosError<{
          errors: Record<string, string[]>;
        }>;
        const errors = axiosError?.response?.data?.errors;

        if (errors) {
          Object.values(errors).forEach((errorMessages) => {
            errorMessages.forEach((message) => {
              toast({
                title: "Error",
                description: message,
                variant: "destructive",
              });
            });
          });
        } else {
          toast({
            title: "Error",
            description: "There was an issue with the submitted data.",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Error",
          description:
            "Authentication failed please check username  and password.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="w-full max-w-sm">
      <CardHeader className="!p-0 !pb-[24px] lg:!pb-[36px]">
        <CardTitle className="text-2xl font-semibold text-white">
          User Deletion Form
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 !p-0">
        <FormProvider {...form}>
          <form className="grid">
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
              <Controller
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormTextField
                    {...field}
                    placeholder="Reason"
                    type="reason"
                  />
                )}
              />
              {/* <Button
                variant="link"
                className="h-auto min-h-0 w-full !p-0 text-[14px] font-normal !leading-none text-[#8c8c8c] hover:underline hover:opacity-75"
                type="button"
                onClick={() => router.push("/auth/password/verify")}
              >
                Forgot password?
              </Button> */}
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
                  Delete Account <ChevronRight className="h-[16px] w-[16px]" />
                </>
              )}
            </Button>
          </form>
        </FormProvider>
        {/* <div className="!m-0 !my-[24px] text-center text-sm text-[#8c8c8c]">
          or continue with
        </div> */}
        {/* <div className="!m-0 !mb-[24px] flex gap-3">
          <SocialLogin event={event} />
        </div> */}
      </CardContent>
      {/* <CardFooter className="flex justify-center !p-0">
        <span className="!p-0 text-sm !leading-none text-[#8c8c8c]">
          New to Spotseeker?
          <Button
            variant="link"
            onClick={() =>
              router.push(`/auth/register${event ? `?event=${event}` : ""}`)
            }
            className={cn(
              "h-auto p-0 px-2 !text-[#e50914] underline hover:opacity-75",
            )}
          >
            Register Now
          </Button>
        </span>
      </CardFooter> */}
    </div>
  );
};
