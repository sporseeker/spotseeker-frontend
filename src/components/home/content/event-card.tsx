"use client";
import ImageWrapper from "@/components/image-wrapper";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import React, { FC, useState } from "react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import FeaturedBadge from "./featured-badge";
import { cn, convertToLKR } from "@/lib/utils";
import { AxiosError } from "axios";
import { SubscribeType } from "@/types/subscribe";
import { toast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import { IApiResponse } from "@/types/response";
import SubscribeModal from "./subscribeModal";
import { Dialog } from "@radix-ui/react-dialog";
import http from "@/lib/http";
import { PAYMENT_METHOD_ID, PaymentMethod } from "@/enum/event";
import { IEventPaymentGateway } from "@/types/event/event";
interface IEventCard {
  image: string;
  eventName: string;
  date: string;
  venue: string;
  price: number;
  uid: string;
  featured?: boolean;
  status: string;
  paymentGateways: IEventPaymentGateway[];
}
const EventCard: FC<IEventCard> = ({
  image,
  eventName,
  date,
  venue,
  price,
  uid,
  featured,
  status,
  paymentGateways = [],
}) => {
  const eventDate = new Date(date);
  const router = useRouter();

  const { data: session, status: authStatus } = useSession();
  const subscribeClick = async () => {
    if (authStatus !== "authenticated") {
      router.push("/auth/signin");
    }
    try {
      if (!session?.user?.phone_no) {
        router.push("/my-account?tab=profile");
        toast({
          title: "Phone number not found",
          description:
            "Please add phone number before subscribe to notification",
          variant: "destructive",
        });
      }
      // await axios.post(`/api/subscribe`, {
      //   event_id: uid,
      //   type: SubscribeType.EVENT,
      // });
      if (session && session.user && session.user.phone_no) {
        await http.post("/api/subscribe", {
          mobile_no: session.user.phone_no,
          event_id: uid,
          type: SubscribeType.EVENT,
        });
      } else {
        throw new Error("Profile must have phone number");
      }

      toast({
        title: "Successfully subscribed",
        description: `Successfully subscribed to the event ${eventName}`,
      });
    } catch (error) {
      toast({
        title: "Subscribe Failed",
        description: (error as AxiosError<IApiResponse>)?.response?.data.message
          ? (error as AxiosError<IApiResponse>)?.response?.data.message
          : (error as Error).message,
        variant: "destructive",
      });
    }
  };
  const onCardClick = () => {
    if (status === "soldout" || status === "postponed" || status === "closed") {
      return;
    }
    if (status === "pending") {
      if (authStatus !== "authenticated") {
        router.push("/auth/signin");
      } else {
        if (session.user?.verified) {
          setIsSubscribeModelOpen(true);
        } else {
          toast({
            title: "Verify your mobile",
            description: "Please verify your mobile number before continuing.",
            variant: "destructive",
          });
          router.push("/my-account?tab=profile");
        }
      }
    } else {
      router.push(`/event/${uid}`);
    }
  };
  const [isSubscribeModelOpen, setIsSubscribeModelOpen] = useState(false);

  return (
    <>
      <div
        onClick={() => onCardClick()}
        className={cn(
          "group relative flex w-full flex-col overflow-hidden rounded-[12px] border border-grey-550",
          status === "soldout" || status === "postponed" || status === "closed"
            ? ""
            : "hover:cursor-pointer hover:border-grey-500",
        )}
      >
        {featured && <FeaturedBadge />}
        {/* <div className="absolute right-0 top-0 z-[10] flex h-[44px] w-[48px] flex-col items-center justify-center rounded-bl-[12px] rounded-tr-[11px] bg-primary-600 text-14 font-medium leading-none text-white lg:h-[64px] lg:w-[56px] lg:text-16">
          <span className="mb-[4px] lg:mb-[8px]">
            {format(eventDate, "MMM")}
          </span>
          <span>{format(eventDate, "d")}</span>
        </div> */}
        <div className="absolute right-0 top-0 z-[10] flex h-[44px] w-[48px] flex-col items-center justify-center rounded-bl-[12px] rounded-tr-[11px] bg-primary-600 text-14 font-medium leading-none text-white lg:h-[64px] lg:w-[56px] lg:text-16">
          {status === "postponed" ? (
            <span className="text-center leading-tight">TBA</span>
          ) : (
            <>
              <span className="mb-[4px] lg:mb-[8px]">
                {format(eventDate, "MMM")}
              </span>
              <span>{format(eventDate, "d")}</span>
            </>
          )}
        </div>
        <div className="relative h-[160px] sm:h-[240px] md:h-[215px] lg:md:h-[284px] xl:md:h-[280px]">
          <ImageWrapper
            src={image}
            className="h-[160px] w-full sm:h-[240px] md:h-[215px] lg:md:h-[284px] xl:md:h-[280px]"
            imageElementClassName="object-cover"
            skeleton={false}
          />
        </div>
        <div
          className={cn(
            "h-full min-h-[200px] bg-grey-600 px-[12px] py-[14px] lg:min-h-[200px] lg:p-[16px]",
            status === "soldout" ||
              status === "postponed" ||
              status === "closed"
              ? ""
              : "group-hover:bg-grey-550",
          )}
        >
          <div className="relative h-full">
            <div className="flex flex-col">
              <p className="mb-[8px] text-12 tracking-[-0.24px] text-primary-600 lg:mb-[12px] lg:text-14">
                {`${format(eventDate, "h:mma")} onwards`}
              </p>
              <div className="min-h-[36px] lg:min-h-[46px]">
                <p className="mb-[4px] line-clamp-2 text-14 font-semibold leading-[1.2] text-neutral-100 lg:text-18">
                  {eventName}
                </p>
              </div>
              <div className="min-h-[36px] lg:min-h-[40px]">
                <p className="line-clamp-2 text-14 leading-[1.2] tracking-[-0.28px] text-grey-400 lg:line-clamp-1">
                  {venue}
                </p>
              </div>
            </div>
            <div className="absolute bottom-0 flex w-full flex-col lg:flex-row-reverse lg:items-center lg:justify-between">
              <Button
                variant="ghost"
                className={cn(
                  "mb-[8px] h-[34px] w-full min-w-[122px] gap-x-[3px] bg-primary-600 p-0 font-bold !text-[#ffffff] hover:!bg-primary-600 hover:!text-[#ffffff] lg:mb-0 lg:h-[46px]",
                  status !== "ongoing"
                    ? "mb-[26px] w-full lg:!text-14"
                    : "!text-14 lg:w-[122px]",
                  status === "pending" ? "!text-[8px]" : "!text-[14px]",
                  status === "soldout" ||
                    status === "postponed" ||
                    status === "closed"
                    ? "cursor-default"
                    : "hover:opacity-75",
                )}
                onClick={() => onCardClick()}
              >
                {status === "pending" ? "Notify when Tickets Out" : ""}
                {status === "closed" ? "Event closed" : ""}
                {status === "postponed" ? "Event postponed" : ""}
                {status === "ongoing" ? "Book Now" : ""}
                {status === "soldout" ? "Sold out" : ""}
                {status === "soldout" ||
                status === "postponed" ||
                status === "closed" ? (
                  ""
                ) : (
                  <ChevronRight className="h-[18px] w-[18px] lg:h-[19px] lg:w-[19px]" />
                )}
              </Button>
              {status === "ongoing" && (
                <div className="relative w-full">
                  <p
                    className={cn(
                      "text-center text-grey-350 lg:flex lg:flex-col lg:gap-x-[12px] lg:text-left",
                      paymentGateways?.find(
                        (pg) => pg.id === PAYMENT_METHOD_ID[PaymentMethod.KOKO],
                      )
                        ? "animate-fadeInOut"
                        : "",
                    )}
                  >
                    <span className="text-12 tracking-[-0.24px] lg:text-14">
                      Starting at
                    </span>
                    <span className="ml-[4px] text-12 tracking-[-0.24px] lg:ml-0 lg:text-14">
                      {convertToLKR(price, 0)}
                    </span>
                  </p>
                  <div
                    className={cn(
                      "absolute inset-0 flex h-full items-center justify-center gap-x-[4px] gap-y-[4px] text-12 tracking-[-0.24px] text-grey-350 lg:flex lg:flex-col-reverse lg:items-start lg:justify-start lg:gap-x-[12px] lg:text-left lg:text-14",
                      paymentGateways?.find(
                        (pg) => pg.id === PAYMENT_METHOD_ID[PaymentMethod.KOKO],
                      )
                        ? "animate-fadeOutIn"
                        : "!hidden",
                    )}
                  >
                    <p className="text-12 leading-[1] tracking-[-0.24px] text-grey-350 lg:pb-[4px]">
                      <span className="inline lg:hidden">Pay in 3 with</span>
                      <span className="hidden lg:inline">
                        Pay in 3 installments
                      </span>
                    </p>
                    <ImageWrapper
                      src="/images/checkout/koko.png"
                      className="flex h-[14px] w-[29px] justify-start lg:h-[22px] lg:w-[45.8px]"
                      imageElementClassName="object-contain "
                      skeleton={false}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Dialog
        open={isSubscribeModelOpen}
        onOpenChange={setIsSubscribeModelOpen}
      >
        <SubscribeModal
          onSubscribe={() => subscribeClick()}
          onClose={() => {
            setIsSubscribeModelOpen(false);
          }}
          eventName={eventName}
        />
      </Dialog>
    </>
  );
};

export default EventCard;
