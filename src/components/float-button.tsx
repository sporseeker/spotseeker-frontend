"use client";
import React, { FC, useMemo } from "react";
import ImageWrapper from "./image-wrapper";
import Sticky from "react-sticky-el";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
interface IFloatButton {
  isEventHide?: boolean;
}
const FloatButton: FC<IFloatButton> = ({ isEventHide = true }) => {
  const pathname = usePathname();
  const isEvent = useMemo(() => {
    return pathname.includes("/event") ? true : false;
  }, [pathname]);
  return (
    <Sticky
      hideOnBoundaryHit={false}
      mode="bottom"
      bottomOffset={30}
      stickyClassName="z-[9999] "
      wrapperClassName={cn(isEvent && isEventHide ? "hidden" : "", "")}
      key="sticky-2"
    >
      <FloatButtonInner />
    </Sticky>
  );
};
export default FloatButton;
interface IFloatButtonInner {
  className?: string;
}
export const FloatButtonInner: FC<IFloatButtonInner> = ({ className }) => {
  return (
    <div
      className={cn(
        "container pointer-events-none relative mx-auto mt-[-85px] flex h-full w-full flex-col items-end px-3 sm:max-w-sm sm:px-3 md:max-w-md lg:max-w-lg xl:max-w-xl xxl:max-w-xxl",
        className,
      )}
    >
      <div className="pointer-events-auto mb-[30px] xxl:mr-[-60px]">
        <a href="https://wa.me/+94741133880" target="_blank">
          <ImageWrapper
            src={"/images/footer/whatsapp.svg"}
            className="h-[55px] w-[55px] cursor-pointer"
            skeleton={false}
          />
        </a>
      </div>
    </div>
  );
};
