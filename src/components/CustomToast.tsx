import React from "react";
import Image from "next/image";

interface ToastProps {
  title: string;
  description: string;
  onClose: () => void;
}

export const CustomToast: React.FC<ToastProps> = ({
  title,
  description,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-[400px] rounded-xl border border-[#434343] bg-neutral-800 p-6 shadow-lg">
        <div className="flex flex-col items-center justify-start gap-5">
          <div className="relative h-[60px] w-[60px]">
            <Image
              src="/icons/heart.svg"
              alt="Heart icon"
              layout="fill"
              objectFit="contain"
            />
          </div>
          <div className="flex flex-col items-center justify-start gap-1 text-center">
            <div className="text-lg font-semibold text-white">{title}</div>
            <div className="text-base font-normal leading-normal text-[#bfbfbf]">
              {description}
            </div>
          </div>
        </div>
        <div className="mt-8 flex justify-center">
          <button
            onClick={onClose}
            className="flex items-center justify-center gap-1 rounded-lg bg-[#e50914] px-6 py-3"
          >
            <span className="text-center text-sm font-semibold text-white">
              Let&apos;s go
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
