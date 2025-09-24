"use client";
import React from "react";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface SubscribeModalProps {
  onSubscribe: () => void;
  onClose: () => void;
  eventName: string;
}

const SubscribeModal: React.FC<SubscribeModalProps> = ({
  onClose,
  onSubscribe,
  eventName,
}) => {
  return (
    <DialogContent className="w-[335px] border-[#434343] bg-neutral-800 p-5 [&>button]:hidden">
      <DialogHeader>
        <DialogTitle className="text-base font-semibold text-white"></DialogTitle>
        <DialogDescription className="text-sm font-normal leading-normal text-[#bfbfbf]">
          {`Do you want to get notified when ${eventName} tickets are live?`}
        </DialogDescription>
      </DialogHeader>

      <div className="mt-4 flex items-center justify-end gap-2">
        <Button
          variant="outline"
          onClick={onClose}
          className="rounded-lg border-[#434343] bg-transparent text-sm font-bold text-grey-100 hover:bg-transparent hover:text-grey-100 hover:opacity-75"
          type="button"
        >
          Cancel
        </Button>
        <Button
          variant="noHover"
          onClick={() => {
            onSubscribe();
            onClose();
          }}
          className="rounded-lg bg-[#e50914] text-sm font-bold text-grey-100 hover:opacity-75"
          type="submit"
        >
          Continue
        </Button>
      </div>
    </DialogContent>
  );
};

export default SubscribeModal;
