"use client";
import { FC, useEffect, useMemo, useState } from "react";
import { CalendarDays, Clock, ExternalLink, MapPin, Play } from "lucide-react";
import { useRouter } from "next/navigation";
import { ContentAreaLayout } from "@/components/content-area-layout";
import ImageWrapper from "@/components/image-wrapper";
import { TicketTierCard } from "@/components/ui/ticket-tier-card";
import { Countdown } from "@/components/ui/countdown";
import { Button } from "@/components/ui/button";
import { CheckoutBar } from "@/components/ui/checkout-bar";
import { Step } from "@/enum/step";
import { RootState } from "@/lib/store";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  setEvent,
  updateTicketPackageCount,
} from "@/lib/store/slices/event-slice";
import { IEvent } from "@/types/event/event";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import { Skeleton } from "../ui/skeleton";
import { isBefore } from "date-fns";
import { PAYMENT_METHOD_ID, PaymentMethod } from "@/enum/event";
import { fbPixelEvent, fbPixelInit } from "@/lib/fbPixel";
import { gaEvent, gaInit } from "@/lib/gAnalytics";

const Description = dynamic(() => import("./description"), {
  loading: () => <Skeleton className="h-[50px] w-full opacity-10" />,
});

const SingleEvent: FC<{ eventData: IEvent }> = ({ eventData }) => {
  const router = useRouter();

  const dispatch = useAppDispatch();
  const ticketPackages = useAppSelector(
    (state: RootState) => state.event.ticketPackages,
  );
  const event = useAppSelector((state: RootState) => state.event.event);
  useEffect(() => {
    if (event?.uid !== eventData.uid) {
      dispatch(setEvent(eventData));
    }
  }, [eventData, dispatch, event?.uid]);

  useEffect(() => {
  if (typeof window === "undefined" || !event || !event.analytics) return;

  if(event && event.analytics && event.analytics.google) {
                  gaInit(event.analytics.google, {
                      page_path: window.location.pathname,
                  });
                  gaEvent("page_view", { page_path: window.location.pathname });
              }
  
              if(event && event.analytics && event.analytics.facebook) {
                  fbPixelInit(event.analytics.facebook);
                  fbPixelEvent("PageView", { page_path: window.location.pathname });
              }

}, [event]);


  const eventDateTime = new Date(eventData.start_date);

  const [expandedDescription, setExpandedDescription] = useState(false);
  const seatedEvent = useMemo(
    () => eventData.ticket_packages.some((tp) => tp.free_seating === false),
    [eventData.ticket_packages],
  );
  const standingEvent = useMemo(
    () => eventData.ticket_packages.some((tp) => tp.free_seating === true),
    [eventData.ticket_packages],
  );

  return (
    <section className="single-event pt-[100px] lg:pt-[130px]">
      <ContentAreaLayout className="relative flex flex-col gap-[40px] pb-[112px] md:gap-[80px] lg:flex-row">
        <div className="bg-gradient-type-one-mobile lg:bg-gradient-type-one absolute z-[-1]"></div>
        <div className="flex max-w-[700px] flex-col gap-[24px] rounded-2xl border-[1px] border-solid border-[#ffffff1f] bg-[linear-gradient(135deg,rgba(25,33,69,0.9)_50%,rgba(32,14,22,0.9)_100%)] p-[16px] md:flex-[35] md:gap-[28px] lg:p-[28px]">
          <div className="flex flex-col gap-[16px] md:flex-row md:gap-[32px]">
            <ImageWrapper
              src={eventData.banner_img}
              className="aspect-square w-full rounded-lg border-[1px] border-solid border-grey-550 md:w-[300px] md:min-w-[300px]"
              imageElementClassName="object-cover"
              skeleton={false}
            />
            <div className="flex flex-col gap-[24px] md:gap-[22px]">
              <div className="flex flex-col gap-[0px] md:gap-[4px]">
                <h1 className="text-[24px] font-semibold leading-[30.6px] md:text-[28px] md:leading-[35.7px]">
                  {eventData.name}
                </h1>
                <p className="text-[16px] font-normal leading-[20.4px] text-grey-100 opacity-50">
                  by {eventData.organizer}
                </p>
              </div>
              <div className="flex flex-col gap-[16px] md:gap-[20px]">
                <div className="flex gap-[8px]">
                  <CalendarDays className="h-[16px] w-[16px] md:h-[20px] md:w-[20px]" />
                  <p className="text-[14px] font-medium leading-[17.85px] text-grey-100 md:text-[16px] md:leading-[20.4px]">
                    {eventDateTime.toLocaleString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div className="flex gap-[8px]">
                  <Clock className="h-[16px] w-[16px] md:h-[20px] md:w-[20px]" />
                  <p className="text-[14px] font-medium leading-[17.85px] text-grey-100 md:text-[16px] md:leading-[20.4px]">
                    {eventDateTime.toLocaleString("en-US", {
                      hour: "numeric",
                      minute: "numeric",
                      hour12: true,
                    })}{" "}
                    onwards
                  </p>
                </div>
                <div className="flex gap-[8px]">
                  <MapPin className="h-[16px] w-[16px] md:h-[20px] md:w-[20px]" />
                  <p className="flex flex-col gap-[7px] text-[14px] font-medium leading-[17.85px] text-grey-100 md:gap-[5px] md:text-[16px] md:leading-[20.4px]">
                    {eventData.venue.name}
                    <div className="flex">
                      {eventData?.sub_type && (
                        <div className="mr-[10px] flex h-[20px] items-center justify-center rounded-[4px] border border-white/10 bg-white/20 px-[5px] text-12 font-semibold leading-none text-white">
                          {eventData.sub_type}
                        </div>
                      )}
                      <a
                        href={eventData.venue.location_url ?? "#"}
                        className="flex max-w-[85px] items-center gap-[4px] font-normal text-primary-600 hover:text-opacity-75 md:text-[14px] md:leading-[17.85px]"
                      >
                        Navigate <ExternalLink size={16} />
                      </a>
                    </div>
                  </p>
                </div>
              </div>
              {isBefore(new Date(), eventDateTime) && (
                <div className="flex w-full items-center justify-between gap-[32px] rounded-lg bg-[#ffffff14] p-[8px] pl-[12px] md:w-auto md:pl-[16px]">
                  <p className="text-[12px] font-normal leading-[15.3px]">
                    Event starts in
                  </p>
                  <Countdown targetDate={eventDateTime} />
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-[20px]">
            <div className="flex justify-between">
              <Button
                variant="ghost"
                className="flex h-[31px] items-center gap-[8px] bg-primary-600 py-[0] pl-[12px] pr-[14px] text-[12px] font-normal leading-[15.3px] text-white hover:!bg-primary-600 hover:text-white hover:opacity-75"
                disabled={
                  !eventData.trailer_url || eventData.trailer_url === "null"
                }
                onClick={() =>
                  window.open(
                    eventData.trailer_url ?? "",
                    "_blank",
                    "noopener,noreferrer",
                  )
                }
              >
                <Play className="fill-white" size={14} />
                Watch Trailer
              </Button>
              <button
                className="text-[14px] font-medium leading-[17.85px] text-grey-300 underline md:hidden"
                onClick={() => setExpandedDescription((prev) => !prev)}
              >
                About event
              </button>
            </div>
            <Description
              className={cn(expandedDescription ? "max-h-[5000px]" : "max-h-0")}
              text={eventData.description}
            />
          </div>
        </div>
        <div className="flex flex-col gap-[14px] md:flex-[23] md:gap-[20px]">
          <div>
            <h2 className="mb-[2px] text-[18px] font-semibold leading-none md:text-[20px] md:leading-[25.5px]">
              Select Tickets
            </h2>
            <h3 className="text-12 text-primary-600 lg:text-14">
              {`${seatedEvent ? "Seated" : ""} ${seatedEvent && standingEvent ? "&" : ""} ${standingEvent ? "Standing" : ""} Event`}
            </h3>
          </div>
          {eventData?.payment_gateways?.find(
            (pg) => pg.id === PAYMENT_METHOD_ID[PaymentMethod.KOKO],
          ) && (
            <div className="flex items-center gap-x-[6px] pb-[4px] text-14 -tracking-[0.28px] text-[#bfbfbf]">
              To pay in 3 installments, select
              <ImageWrapper
                src="/images/checkout/koko.png"
                className="flex h-[22px] w-[46px] justify-start"
                imageElementClassName="object-contain "
                skeleton={false}
              />
              at Checkout
            </div>
          )}
          <div className="flex flex-col gap-[8px]">
            {eventData.ticket_packages.map((ticket) => {
              return (
                <TicketTierCard
                  key={ticket.id}
                  name={ticket.name}
                  price={parseFloat(ticket.price)}
                  soldOut={ticket.sold_out}
                  active={ticket.active}
                  seated={!ticket.free_seating}
                  currency={"LKR"}
                  selection={{
                    qty:
                      ticketPackages.find((v) => v.id === ticket.id)?.count ??
                      0,
                    max:
                      ticket.max_tickets_can_buy ||
                      ticket.max_tickets_can_buy !== 0
                        ? ticket.max_tickets_can_buy
                        : 20,
                    changeQty: (qty) => {
                      dispatch(
                        updateTicketPackageCount({
                          id: ticket.id,
                          count: qty,
                        }),
                      );
                    },
                  }}
                  totalTicketCount={ticketPackages.reduce(
                    (acc, v) => acc + v.count,
                    0,
                  )}
                />
              );
            })}
          </div>
        </div>
      </ContentAreaLayout>
      <CheckoutBar
        qty={ticketPackages.reduce((acc, v) => acc + v.count, 0)}
        total={ticketPackages.reduce((acc, v) => {
          return acc + parseFloat(v.price) * v.count;
        }, 0)}
        boundaryElement=".single-event"
        step={Step.EVENT}
        onClick={() => {
          // if (status === "authenticated") {
          //   router.push(`/event/${eventData.uid}/checkout`);
          // } else {
          //   toast({
          //     title: "Please login",
          //     description: "Please log in before proceeding to checkout!",
          //     variant: "destructive",
          //   });
          //   router.push(`/auth/signin?event=${eventData.uid}`);
          // }
          router.push(`/event/${eventData.uid}/checkout`);
        }}
        key="check-2"
      />
    </section>
  );
};

export default SingleEvent;
