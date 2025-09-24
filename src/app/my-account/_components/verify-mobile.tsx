import OtpForm from "@/components/auth/otp-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { reSendOTP } from "@/services/otp-service";
import { IApiResponse } from "@/types/response";
import { AxiosError } from "axios";
import { FC, useState } from "react";
interface IVerifyMobile {
  isOpen?: true;
}
export const VerifyMobile: FC<IVerifyMobile> = ({ isOpen = false }) => {
  const [open, setOpen] = useState(isOpen);
  const onResend = async () => {
    try {
      await reSendOTP();
    } catch (error) {
      toast({
        title: "OTP Resend Failed",
        description: (error as AxiosError<IApiResponse>)?.response?.data.message
          ? (error as AxiosError<IApiResponse>)?.response?.data.message
          : (error as Error).message,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button
          variant="link"
          className="absolute bottom-0 right-[10px] min-h-[42px] p-0 text-primary-600 hover:no-underline hover:opacity-75"
          type="button"
          onClick={() => {
            onResend();
          }}
        >
          Verify
        </Button>
      </DialogTrigger>
      <DialogContent className="!gap-0 rounded-xl border border-neutral-800 bg-[#181818]/90 sm:max-w-[425px]">
        <DialogHeader className="invisible">
          <DialogTitle></DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <OtpForm onVerify={() => setOpen(false)} />
        <DialogFooter className="invisible"></DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
