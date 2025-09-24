"use client";

import { Button } from "@/components/ui/button";

import {
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FormTextField } from "./form-field";
import { toast } from "@/hooks/use-toast";
import { IUserRegistration, userRegister } from "@/services/auth-service";
import SocialLogin from "./social-login";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { AxiosError } from "axios";
import { signIn } from "next-auth/react";

export const RegisterForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const event = searchParams?.get("event");
  const [loading, setLoading] = useState(false);
  const formSchema = z
    .object({
      name: z
        .string()
        .min(2, { message: "First name must be at least 2 characters." })
        .max(30, {
          message: "First name must not be longer than 30 characters.",
        }),
      email: z.string().email({ message: "Invalid email address" }),
      password: z
        .string()
        .min(8, "Password must be at least 8 characters long"),
      password_confirmation: z
        .string()
        .min(8, "Password must be at least 8 characters long"),
      phone_no: z.string().regex(/^[0]{1}[7]{1}[01245678]{1}[0-9]{7}$/, {
        message: "Phone number must be in the format 0771234567 o4761234567",
      }),
    })
    .refine((data) => data.password === data.password_confirmation, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
      phone_no: "",
    },
  });
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      await userRegister(values as IUserRegistration);
      await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
      });
      if (event) {
        router.push(`/auth/verify?getting-started=true&event=${event}`);
      } else {
        router.push("/auth/verify?getting-started=true");
      }
    } catch (error: unknown) {
      setLoading(false);
      if (
        (error as AxiosError).response &&
        (error as AxiosError).response?.status === 422
      ) {
        const axiosError = error as AxiosError<{
          errors: Record<string, string[]>;
        }>;
        const errors = axiosError?.response?.data?.errors;

        if (errors) {
          // Iterate over each error message array and display individual messages
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
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
      }
    }
  };
  return (
    <div className="w-full max-w-sm">
      <CardHeader className="!p-0 !pb-[24px] lg:!pb-[36px]">
        <CardTitle className="text-2xl font-semibold text-white">
          Create an Account
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 !p-0">
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-3">
              <Controller
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormTextField {...field} placeholder="Full Name" />
                )}
              />
              <Controller
                name="phone_no"
                control={form.control}
                render={({ field }) => (
                  <FormTextField {...field} placeholder="Mobile Number" />
                )}
              />
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
                    placeholder="Create Password"
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
                  Register <ChevronRight className="h-[16px] w-[16px]" />
                </>
              )}
            </Button>
          </form>
        </FormProvider>
        <div className="!m-0 !my-[24px] text-center text-sm text-[#8c8c8c] lg:!my-[36px]">
          or continue with
        </div>
        <div className="!m-0 !mb-[24px] flex gap-3 lg:!mb-[36px]">
          <SocialLogin event={event} register={true} />
        </div>
      </CardContent>
      <CardFooter className="flex justify-center !p-0">
        <span className="!p-0 text-sm !leading-none text-[#8c8c8c]">
          Already registered?
          <Button
            variant="link"
            onClick={() =>
              router.push(
                event ? `/auth/signin?event=${event}` : "/auth/signin",
              )
            }
            className="h-auto p-0 px-2 !text-[#e50914] underline hover:opacity-75"
          >
            Log In
          </Button>
        </span>
      </CardFooter>
    </div>
  );
};
