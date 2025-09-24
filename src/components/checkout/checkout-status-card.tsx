import ImageWrapper from "@/components/image-wrapper";
import { formatDateTypeOne } from "@/lib/utils";
import { IEvent } from "@/types/event/event";
import Link from "next/link";
import React, { FC } from "react";
interface ICard {
  event: IEvent;
}
export const Card: FC<ICard> = ({ event }) => {
  return (
    <div className="flex h-[110px] w-full items-start justify-start gap-5 rounded-md bg-[rgba(255,255,255,0.08)] p-3 md:h-[113px]">
      <ImageWrapper
        className="h-[80px] min-w-[80px] rounded-[8px]"
        src={event.thumbnail_img}
        imageElementClassName="object-cover"
        alt={"Checkout card image"}
      />
      <div className="m-0 w-full">
        <p className="line-clamp-1 text-left font-onest text-16 font-semibold text-neutral-100 md:text-18">
          {event.name}
        </p>
        <p className="text-left font-onest text-14 text-grey-100 opacity-50 md:text-16">
          {event.start_date ? formatDateTypeOne(event?.start_date) : ""}
        </p>
        <p className="line-clamp-1 text-left font-onest text-14 text-grey-100 opacity-50 md:text-16">
          {event?.venue.name}
        </p>
        <Link href={event?.venue.location_url ?? "#"}>
          <div className="flex items-center space-x-0.5">
            <p className="mr-1 text-left font-onest text-14 tracking-[-0.28px] text-primary-600">
              Navigate
            </p>
            <ImageWrapper
              className="h-[16px] w-[16px]"
              src={"/images/checkout/navigate.svg"}
              alt={"Navigate icon"}
            />
          </div>
        </Link>
      </div>
    </div>
  );
};
