"use client";
import AuthWrapper from "@/components/auth/auth-wrapper";
import OtpForm from "@/components/auth/otp-form";
import React from "react";

const Page = () => {
  return (
    <AuthWrapper>
      <OtpForm />
    </AuthWrapper>
  );
};

export default Page;
