"use client";
import React from "react";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { toast } from "@/hooks/use-toast";
import http from "@/lib/http";
// import { useRouter } from "next/navigation";

interface LogoutModalProps {
  onClose: () => void;
}

const LogoutModal: React.FC<LogoutModalProps> = ({ onClose }) => {
  const onLogOut = async () => {
    try {
      await http.post("/api/auth/logout", {});
      await signOut({ redirectTo: "/" });
      toast({
        title: "Logout Successful",
        description: "You have successfully logged out.",
      });
    } catch (error) {
      toast({
        title: "Logout failed",
        description: "Error occurred durning logout",
        variant: "destructive",
      });
    }
  };
  return (
    <DialogContent className="w-[335px] border-[#434343] bg-neutral-800 p-5 [&>button]:hidden">
      <DialogHeader>
        <DialogTitle className="text-base font-semibold text-white">
          Log Out
        </DialogTitle>
        <DialogDescription className="text-sm font-normal leading-normal text-[#bfbfbf]">
          Are you sure you want to log out?
        </DialogDescription>
      </DialogHeader>

      <div className="mt-4 flex items-center justify-end gap-2">
        <Button
          variant="outline"
          onClick={onClose}
          className="rounded-lg border-[#434343] bg-transparent text-sm font-bold text-grey-100 hover:bg-transparent hover:text-grey-100 hover:opacity-75"
          type="button"
        >
          No, stay signed in
        </Button>
        <Button
          variant="noHover"
          onClick={() => onLogOut()}
          className="rounded-lg bg-[#e50914] text-sm font-bold text-grey-100 hover:opacity-75"
          type="submit"
        >
          Yes, log out
        </Button>
      </div>
    </DialogContent>
  );
};

export default LogoutModal;
