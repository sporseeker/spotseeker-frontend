"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FormTextField } from "./form-field";
import { FC, useState } from "react";
import { VerifyMobile } from "./verify-mobile";
import { Dialog } from "@radix-ui/react-dialog";
import AccountDeleteModal from "@/components/checkout/account-delete-model";
import { Button } from "@/components/ui/button";
interface IProfileForm {
  disabled: boolean;
  showVerifyBtn: boolean;
}
const ProfileForm: FC<IProfileForm> = ({ disabled, showVerifyBtn }) => {
  const [isAccountDeleteModalOpen, setIsAccountDeleteModalOpen] =
    useState(false);
  return (
    <div>
      <Card className="mb-[30px] border-[#1f1f1f] bg-gradient-to-br from-[#192145] to-[#200e16] text-white">
        <CardHeader>
          <h2 className="text-base font-semibold">Personal Information</h2>
        </CardHeader>
        <CardContent className="max-w-[760px] space-y-12">
          <div className="grid grid-cols-1 gap-x-[20px] gap-y-[20px] pb-[10px] lg:grid-cols-2 lg:gap-y-[30px] lg:pb-[10px]">
            <FormTextField
              name="first_name"
              label="First Name"
              disabled={disabled}
            />
            <FormTextField
              name="last_name"
              label="Last Name"
              disabled={disabled}
            />
            <FormTextField
              name="email"
              label="Email Address"
              type="email"
              disabled={true}
            />
            <div className="relative">
              <FormTextField
                name="phone_no"
                label="Phone Number"
                disabled={disabled}
              />
              {disabled && showVerifyBtn ? <VerifyMobile /> : ""}
            </div>
            <FormTextField
              name="nic"
              label="NIC / Driving License / Passport"
              disabled={disabled}
            />
            <Separator className="my-[10px] bg-white/10 lg:col-span-2 lg:my-[16px]" />
            <h2 className="mb-[-8px] text-base font-semibold lg:col-span-2 lg:mb-[-12px]">
              Security
            </h2>
            <FormTextField
              name="password"
              label="Password"
              type="password"
              autoComplete={false}
              disabled={disabled}
            />
            {!disabled && (
              <FormTextField
                name="password_confirmation"
                label="Confirm Password"
                type="password"
                autoComplete={false}
              />
            )}
          </div>
        </CardContent>
      </Card>
      <Card className="border-[#1f1f1f] bg-gradient-to-br from-[#192145] to-[#200e16] text-white">
        <CardHeader>
          <h2 className="text-base font-semibold text-grey-300">
            Account Deletion
          </h2>
        </CardHeader>
        <CardContent className="max-w-[760px] space-y-12">
          <p className="mb-[30px] text-14 text-grey-300">
            Deleting your account is a permanent action and cannot be undone.
            All your data, including profile details, saved preferences, and
            purchase history, will be permanently removed. If you&apos;re sure
            about deleting your account, please proceed with caution.
          </p>
          <Button
            className="!m-0 border-primary-900 bg-transparent text-primary-600 hover:bg-transparent hover:text-primary-600 hover:opacity-75"
            variant="outline"
            type="button"
            onClick={() => setIsAccountDeleteModalOpen(true)}
          >
            Delete account
          </Button>
        </CardContent>
      </Card>
      <Dialog
        open={isAccountDeleteModalOpen}
        onOpenChange={setIsAccountDeleteModalOpen}
      >
        <AccountDeleteModal
          onClose={() => setIsAccountDeleteModalOpen(false)}
        />
      </Dialog>
    </div>
  );
};

export default ProfileForm;
