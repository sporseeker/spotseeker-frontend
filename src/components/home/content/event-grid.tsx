import React, { FC } from "react";

import EventCard from "@/components/home/content/event-card";
import { IEvent } from "@/types/event/event";
interface IEventGrid {
  events: IEvent[];
}
const EventGrid: FC<IEventGrid> = ({ events }) => {
  return (
    <div className="mt-[15px] grid grid-cols-2 gap-x-[14px] gap-y-[28px] md:grid-cols-3 lg:gap-x-[22px] xl:md:grid-cols-4 xl:gap-x-[24px]">
      {events.map((v) => (
        <EventCard
          key={v.id}
          uid={v.uid}
          image={v.banner_img}
          eventName={v.name}
          date={v.start_date}
          venue={v.venue.name}
          featured={v.featured}
          status={v.status}
          paymentGateways={v.payment_gateways}
          price={v.ticket_packages.reduce((min, ticket) => {
            return Math.min(min, parseFloat(ticket.price));
          }, Infinity)}
        />
      ))}
    </div>
  );
};

export default EventGrid;
