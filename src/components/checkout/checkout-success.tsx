"use client";
import React, { FC, useCallback, useEffect, useState } from "react";
import axios from "axios";
import ImageWrapper from "@/components/image-wrapper";
import { Card } from "./checkout-status-card";
import { ContentAreaLayout } from "../content-area-layout";
import { IEvent } from "@/types/event/event";
import { cn } from "@/lib/utils";
import { buttonVariants } from "../ui/button";
import Link from "next/link";
import { IBookingDetails } from "@/types/booking";
import { LoaderCircle } from "lucide-react";
import { fbPixelInit, fbPixelEvent } from "@/lib/fbPixel";
import { gaInit, gaEvent } from "@/lib/gAnalytics";

interface ICheckoutSuccess {
  event: IEvent;
  orderId: string;
}

export const CheckoutSuccess: FC<ICheckoutSuccess> = ({ event, orderId }) => {
  const [booking, setBooking] = useState<IBookingDetails | null>(null);
  // const [status, setStatus] = useState<string>("Generating E-Ticket...");
  const [retryCount, setRetryCount] = useState<number>(0);
  const [error, setError] = useState<boolean>(false);

  const fetchBooking = useCallback(async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/bookings/${orderId}`,
      );
      if (!response.data.status) {
        throw new Error(response.data.message || "");
      }
      const data: IBookingDetails | null = response.data?.data ?? null;

      setBooking(data);

      // if (data?.ticket_url) {
      //   setStatus("E-Ticket Ready");
      // } else {
      //   setStatus("Generating E-Ticket");
      // }
    } catch (error) {
      console.error("Error fetching booking:", error);
      setError(true);
    }
  }, [orderId]);

  useEffect(() => {
    if (retryCount >= 20 || error) {
      setError(true);
      return;
    }

    const interval = setInterval(() => {
      if (!booking?.ticket_url) {
        fetchBooking();
        setRetryCount((prev) => prev + 1);
      }
    }, 5000);
    fetchBooking();

    return () => clearInterval(interval);
  }, [booking?.ticket_url, retryCount, error, fetchBooking]);

  useEffect(() => {
    if (typeof window !== "undefined" && event) {
      if(event && event.analytics && event.analytics.google) {
                gaInit(event.analytics.google, {
                    page_path: window.location.pathname,
                });
            }

            if(event && event.analytics && event.analytics.facebook) {
                fbPixelInit(event.analytics.facebook);
            }

      gaEvent("purchase", {
        value: booking?.tot_amount,
        currency: "LKR",
      });

      fbPixelEvent("Purchase", {
        value: booking?.tot_amount,
        currency: "LKR",
      });
    }
  }, [booking]);

  return (
    <section className="flex h-screen flex-col items-center justify-center">
      <ContentAreaLayout className="relative flex w-full flex-col">
        <div className="bg-gradient-type-two-mobile lg:bg-gradient-type-two absolute z-[-1]"></div>
        <div className="mb-[32px] flex flex-col items-center justify-center lg:mb-[40px]">
          <ImageWrapper
            className="mb-[16px] h-[55px] w-[55px] md:h-[68px] md:w-[68px]"
            src={"/images/checkout/congratulation.png"}
            alt={"warning image"}
          />
          <p className="md:text-24 mb-[8px] text-center text-20 font-semibold text-grey-100">
            Congratulations!
          </p>
          <p className="mb-[8px] text-center font-onest text-16 text-grey-350 md:text-18">
            You have successfully reserved your spot.
          </p>
        </div>
        <div className="flex flex-col items-center justify-center">
          <div className="flex w-full max-w-[528px] flex-col items-center justify-start gap-[28px] rounded-lg border border-[rgba(255,_255,_255,_0.08)] bg-[linear-gradient(111deg,#192145_12%,#200e16_100%)] p-[16px] md:gap-[40px] md:bg-[linear-gradient(152deg,#192145_34%,#200e16_100%)] md:p-[24px]">
            <Card event={event} />
            <div className="flex w-full flex-col justify-between gap-y-[16px] md:flex-row">
              <Link
                href="/my-account?tab=bookings"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "flex h-[42px] items-center justify-center gap-2 rounded-md border border-white/10 bg-transparent px-4 py-3 font-onest text-14 font-bold hover:bg-transparent hover:text-grey-100 hover:opacity-75",
                )}
              >
                View My Bookings
              </Link>
              {booking?.ticket_url ? (
                <a
                  href={booking.ticket_url}
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "flex h-[42px] flex-row items-center justify-center gap-2 rounded-md border-none bg-primary-600 px-4 py-3 font-onest text-14 font-bold text-grey-100 hover:bg-primary-600 hover:text-gray-100 hover:opacity-75 md:mb-0",
                  )}
                >
                  <span>Download E-Ticket</span>
                  <ImageWrapper
                    className="h-[10.3px] w-[10.3px]"
                    src={"/images/checkout/download.svg"}
                    alt={"Navigate icon"}
                  />
                </a>
              ) : (
                !error && (
                  <div className="flex h-[42px] items-center justify-center gap-2 rounded-md border border-white/10 bg-transparent px-4 py-3 font-onest text-14 font-bold text-grey-100 opacity-85">
                    {"Generating E-Ticket"}
                    <LoaderCircle size={20} className="animate-spin" />
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </ContentAreaLayout>
    </section>
  );
};
