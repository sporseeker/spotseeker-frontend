"use client";
import React from "react";
import Image from "next/image";
import { cn, convertToLKR } from "@/lib/utils";
import { format } from "date-fns";
import { buttonVariants } from "./ui/button";
import { IAddonDetail } from "@/types/event/event-api";

interface Ticket {
  id: string;
  name: string;
  price: number;
  currency: string;
  availableQuantity: number;
  count: number;
}

const EventImage = ({ src, alt }: { src: string; alt: string }) => (
  <div className="h-[80px] min-w-[80px] flex-shrink-0">
    <Image
      src={`${src}`}
      alt={alt}
      width={80}
      height={80}
      className="min-h-[80px] min-w-[80px] rounded-lg object-cover"
    />
  </div>
);

const EventInfo = ({
  name,
  date,
  venue,
  isPastEvent,
  totalPrice,
  locationLink,
}: {
  name: string;
  date: string;
  venue: string;
  isPastEvent: boolean;
  totalPrice: string;
  locationLink: string;
}) => (
  <div className="flex flex-col justify-between gap-1 text-white">
    <h3 className="text-base font-semibold">{name}</h3>
    <p className="text-sm text-gray-400">
      {format(date, "MMM dd, yyyy - h:mma 'onwards'")}
    </p>
    <div className="flex flex-col sm:flex-row sm:items-center">
      <span className="truncate text-sm text-gray-400">{venue}</span>
      {!isPastEvent && (
        <a
          href={locationLink}
          onClick={(e) => e.stopPropagation()}
          target="_blank"
          className="max-w-[85px] grow-0"
        >
          <NavigateButton />
        </a>
      )}
    </div>
    <p className="text-sm font-semibold text-gray-100">
      Total: {convertToLKR(totalPrice)}
    </p>
  </div>
);

const NavigateButton = () => (
  <span className="mt-1 flex max-w-[90px] shrink-0 grow-0 cursor-pointer items-center text-sm text-primary-600 hover:opacity-75 sm:ml-2 sm:mt-0">
    Navigate
    <Image
      src="/icons/share.svg"
      alt="Navigate"
      width={12}
      height={12}
      className="ml-2"
    />
  </span>
);

const ActionButtons = ({
  isPastEvent,
  isExpanded,
  ticketUrl,
}: {
  isPastEvent: boolean;
  isExpanded: boolean;
  ticketUrl?: string | null;
}) => (
  <div className="flex w-full items-center justify-end space-x-4 sm:w-auto">
    {isPastEvent ? (
      <div className="inline-flex h-[31px] w-[140px] items-center justify-center rounded-lg border border-[#990012] px-3 py-2">
        <div className="text-xs font-normal text-[#e50914]">EVENT COMPLETE</div>
      </div>
    ) : (
      <>
        {ticketUrl ? (
          <button
            onClick={() => window.open(ticketUrl, "_blank")}
            className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary-600 px-4 py-2 text-sm font-bold text-gray-100 transition-colors hover:bg-primary-700 sm:w-auto"
            type="button"
          >
            Download E-Ticket
            <Image
              src="/icons/IconDownload.svg"
              alt="Download"
              width={16}
              height={16}
              className="transform transition-transform duration-200"
            />
          </button>
        ) : (
          <span
            className={cn(
              buttonVariants({ variant: "outline" }),
              "flex h-[42px] items-center justify-center gap-2 rounded-md border border-white/10 bg-transparent px-4 py-3 font-onest text-14 font-bold hover:bg-transparent hover:text-grey-100",
            )}
          >
            Ticket is Generating
          </span>
        )}

        <ExpandButton isExpanded={isExpanded} />
      </>
    )}
  </div>
);

const ExpandButton = ({ isExpanded }: { isExpanded: boolean }) => (
  <div className="flex h-[40px] w-[40px] items-center justify-center opacity-50 transition-opacity hover:opacity-75">
    <Image
      src="/icons/downArrow.svg"
      alt="Expand"
      width={16}
      height={16}
      className={cn("transform transition-transform duration-200", {
        "rotate-180": isExpanded,
      })}
    />
  </div>
);

const ExpandedContent = ({
  tickets,
  purchaseDate,
  addons,
}: {
  purchaseDate: string;
  tickets: Ticket[];
  addons: IAddonDetail[];
}) => (
  <div className="flex w-full flex-col gap-1 text-white">
    <div className="pb-4 md:ml-[96px]">
      <div className="rounded-lg bg-gray-400 bg-opacity-10 p-3">
        <div className="flex flex-col gap-4">
          <TicketSection tickets={tickets} />
          {addons.length > 0 ? <EatsAndSpiritsSection addons={addons} /> : ""}
        </div>
      </div>
    </div>
    <div className="flex w-full justify-end">
      <span className="text-14 text-gray-400">Purchased on {purchaseDate}</span>
    </div>
  </div>
);

const TicketSection = ({ tickets }: { tickets: Ticket[] }) => (
  <div className="flex flex-col space-y-2">
    <h4 className="text-xs font-semibold text-gray-300">Tickets</h4>
    <div className="space-y-2">
      {tickets
        .filter((t) => t.count > 0)
        .map((t) => (
          <TicketItem quantity={t.count} tier={t.name} key={t.id} />
        ))}
    </div>
  </div>
);

const TicketItem = ({ quantity, tier }: { quantity: number; tier: string }) => (
  <div className="flex items-center gap-2">
    <span className="rounded-full bg-gray-300 bg-opacity-10 px-3 py-1 text-14 text-white">
      {quantity}
      <span className="text-14 text-white">x</span>
    </span>
    <span className="text-14 text-white">{tier}</span>
  </div>
);

const EatsAndSpiritsSection = ({ addons }: { addons: IAddonDetail[] }) => (
  <div className="flex flex-col space-y-2">
    <h4 className="text-xs font-semibold text-gray-300">Eats & Spirits</h4>
    {addons.map((a) => (
      <TicketItem quantity={a.quantity} tier={a.addon.name} key={a.id} />
    ))}
  </div>
);
interface BookingCardProps {
  name: string;
  date: string;
  venue: string;
  locationLink: string;
  image: string;
  totalAmount: number;
  tickets: Ticket[];
  isPastEvent: boolean;
  isCanceled?: boolean;
  ticketCount?: number;
  addons: IAddonDetail[];
  purchasedDate: string;
  ticketUrl?: string | null;
}

const BookingCard: React.FC<BookingCardProps> = ({
  name,
  date,
  venue,
  locationLink,
  image,
  totalAmount,
  tickets,
  addons,
  isPastEvent,
  purchasedDate,
  isCanceled,
  ticketUrl,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const handleCardClick = (e: React.MouseEvent) => {
    if (!isPastEvent && !(e.target as HTMLElement).closest("button")) {
      setIsExpanded(!isExpanded);
    }
  };

  const formattedPurchasedDate = format(
    new Date(purchasedDate.replace(" ", "T")),
    "MMM dd, yyyy - h:mma",
  );

  return (
    <div
      onClick={handleCardClick}
      className={cn(
        "flex w-full max-w-full flex-col rounded-xl border border-none bg-booking-card-gradient p-4 shadow-sm transition-all duration-300",
        {
          "cursor-pointer": !isPastEvent,
          "h-auto": isExpanded,
          "h-auto sm:h-[130px]": !isExpanded,
        },
      )}
    >
      <div className="flex h-auto w-full flex-col items-start justify-between sm:flex-row sm:items-center">
        <div className="mb-4 flex flex-1 items-start space-x-4 sm:mb-0">
          <EventImage src={image} alt={name} />
          <EventInfo
            locationLink={locationLink}
            name={name}
            date={date}
            venue={venue}
            isPastEvent={isPastEvent}
            totalPrice={totalAmount.toString()}
          />
        </div>

        <div className="mb-4 h-[1px] w-full border-t border-white opacity-10 sm:hidden" />
        {!isCanceled && (
          <ActionButtons
            isPastEvent={isPastEvent}
            isExpanded={isExpanded}
            ticketUrl={ticketUrl}
          />
        )}
      </div>

      {!isPastEvent && (
        <div
          className={cn(
            "overflow-hidden transition-all duration-300 ease-in-out",
            {
              "mt-6 max-h-96 opacity-100": isExpanded,
              "max-h-0 opacity-0": !isExpanded,
            },
          )}
        >
          <ExpandedContent
            addons={addons}
            tickets={tickets}
            purchaseDate={formattedPurchasedDate}
          />
        </div>
      )}
    </div>
  );
};

export default BookingCard;
