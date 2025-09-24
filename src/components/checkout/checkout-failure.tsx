import ImageWrapper from "@/components/image-wrapper";
import React, { FC } from "react";
import { Card } from "./checkout-status-card";
import { ContentAreaLayout } from "../content-area-layout";
import { IEvent } from "@/types/event/event";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";
interface CheckoutFailure {
  event: IEvent;
}
export const CheckoutFailure: FC<CheckoutFailure> = ({ event }) => {
  return (
    <section className="flex h-screen flex-col items-center justify-center">
      <ContentAreaLayout className="relative flex w-full flex-col">
        <div className="bg-gradient-type-three-mobile lg:bg-gradient-type-two absolute z-[-1]"></div>
        <div className="mb-[32px] flex flex-col items-center justify-center lg:mb-[40px]">
          <ImageWrapper
            className="mb-[16px] h-[55px] w-[55px] md:h-[68px] md:w-[68px]"
            src={"/images/checkout/warning.png"}
            alt={"warning image"}
          />
          <p className="md:text-24 mb-[8px] text-center text-20 font-semibold text-grey-100">
            Payment Failed!
          </p>
          <p className="mb-[8px] text-center font-onest text-16 text-grey-350 md:text-18">
            Oops, something went wrong. Please try again!
          </p>
          {/* <p className="text-center font-onest text-16 text-grey-450 md:text-18">
            (show the error type if possible in this text)
          </p> */}
        </div>
        <div className="flex flex-col items-center justify-center">
          <div className="flex w-full max-w-[528px] flex-col items-center justify-start gap-[28px] rounded-lg border border-[rgba(255,_255,_255,_0.08)] bg-[linear-gradient(111deg,#192145_12%,#200e16_100%)] p-[16px] md:gap-[40px] md:bg-[linear-gradient(152deg,#192145_34%,#200e16_100%)] md:p-[24px]">
            <Card event={event} />
            <div className="flex w-full justify-center md:flex-row">
              <Link
                href={`/event/${event.uid}`}
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "flex h-[42px] items-center justify-center gap-2 rounded-md border border-white/10 bg-transparent px-4 py-3 font-onest text-14 font-bold hover:bg-transparent hover:text-grey-100 hover:opacity-75",
                )}
              >
                Back to Event
              </Link>
            </div>
          </div>
        </div>
      </ContentAreaLayout>
    </section>
  );
};
