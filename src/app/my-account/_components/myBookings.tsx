"use client";
import React from "react";
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import BookingCard from "@/components/booking-card";
import { CustomTabsTrigger } from "@/components/home/content/content";
import { useFetchOrdersQuery } from "@/hooks/api-hooks/fetch.orders";
import { BookingStatus } from "@/types/order";
import { Skeleton } from "@/components/ui/skeleton";

const CustomTabsContent = React.memo(
  ({ value, children }: { value: string; children: React.ReactNode }) => (
    <TabsContent value={value} className="mt-1">
      {children}
    </TabsContent>
  ),
);

CustomTabsContent.displayName = "CustomTabsContent";

export const MyBookings: React.FC = React.memo(() => {
  const { data, isLoading } = useFetchOrdersQuery();
  const orders = data?.orders ?? [];

  return (
    <section className="flex w-full flex-col gap-6 space-y-4 lg:w-[912px]">
      <div className="text-2xl font-bold">My Bookings</div>
      <Tabs defaultValue="upcoming">
        <ScrollArea className="whitespace-nowrap">
          <div className="flex w-max pb-[18px] lg:pb-[28px]">
            <TabsList className="h-full space-x-[20px] !bg-transparent p-0">
              <CustomTabsTrigger value="upcoming" label="Upcoming" />
              <CustomTabsTrigger value="history" label="Event History" />
              {/* <CustomTabsTrigger value="cancelled" label="Cancelled" /> */}
            </TabsList>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        <CustomTabsContent value="upcoming">
          <div className="space-y-2">
            {!isLoading &&
              orders
                .filter(
                  (order) =>
                    order.event?.status === "ongoing" &&
                    order.booking_status === BookingStatus.COMPLETE,
                )
                .map((order, index) => (
                  <BookingCard
                    key={`upcoming-${index}`}
                    isPastEvent={false}
                    name={order.event?.name ?? "Unknown Event"}
                    date={order.event?.start_date ?? "TBD"}
                    venue={order.event?.venue?.name ?? "No Venue"}
                    locationLink={order.event?.venue?.location_url ?? "#"}
                    image={order.event?.thumbnail_img ?? "/placeholder.jpg"}
                    totalAmount={order.tot_amount}
                    ticketUrl={order.e_ticket_url}
                    tickets={
                      order.event?.ticket_packages.map((tm) => ({
                        id: String(tm.id),
                        name: tm.name,
                        price: parseFloat(tm.price),
                        currency: "LKR",
                        availableQuantity: 0,
                        count:
                          order.packages?.find(
                            (p) => p.package_name === tm.name,
                          )?.ticket_count ?? 0,
                      })) ?? []
                    }
                    addons={order.addons.filter((d) => d.quantity > 0) ?? []}
                    purchasedDate={order.booking_date ?? ""}
                  />
                ))}
            {isLoading &&
              [1, 2, 3, 4, 5].map((i) => (
                <Skeleton
                  className="h-[100px] w-full"
                  key={`upcoming-loading-${i}`}
                />
              ))}
          </div>
        </CustomTabsContent>

        <CustomTabsContent value="history">
          <div className="space-y-2">
            {!isLoading &&
              orders
                .filter(
                  (order) =>
                    order.event?.status !== "ongoing" &&
                    order.booking_status === BookingStatus.COMPLETE,
                )
                .map((order, index) => (
                  <BookingCard
                    key={`history-${index}`}
                    isPastEvent={true}
                    name={order.event?.name ?? "Unknown Event"}
                    date={order.event?.start_date ?? "TBD"}
                    venue={order.event?.venue?.name ?? "No Venue"}
                    locationLink={order.event?.venue?.location_url ?? "#"}
                    image={order.event?.thumbnail_img ?? "/placeholder.jpg"}
                    totalAmount={order.tot_amount}
                    tickets={[]}
                    addons={[]}
                    purchasedDate={order.booking_date}
                  />
                ))}
            {isLoading &&
              [1, 2, 3, 4, 5].map((i) => (
                <Skeleton
                  className="h-[100px] w-full"
                  key={`history-loading-${i}`}
                />
              ))}
          </div>
        </CustomTabsContent>

        {/* <CustomTabsContent value="cancelled">
          <div className="space-y-2">
            {orders
              .filter(
                (order) => order.booking_status !== BookingStatus.COMPLETE,
              )
              .map((order, index) => (
                <BookingCard
                  key={`canceled-${index}`}
                  isPastEvent={true}
                  isCanceled={true}
                  name={order.event?.name ?? "Unknown Event"}
                  date={order.event?.start_date ?? "TBD"}
                  venue={order.event?.venue?.name ?? "No Venue"}
                  locationLink={order.event?.venue?.location_url ?? "#"}
                  image={order.event?.thumbnail_img ?? "/placeholder.jpg"}
                  totalAmount={order.tot_amount}
                  tickets={[]}
                  addons={[]}
                  purchasedDate={order.booking_date}
                />
              ))}
          </div>
        </CustomTabsContent> */}
      </Tabs>
    </section>
  );
});

MyBookings.displayName = "MyBookings";
