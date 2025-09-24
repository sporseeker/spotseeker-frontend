"use client";
import React, { FC, useEffect, useMemo, useState } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EventGrid from "./event-grid";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { ContentAreaLayout } from "@/components/content-area-layout";
import { IEvent } from "@/types/event/event";
import { IApiResponse } from "@/types/response";
import { EventType } from "@/enum/event";
import { Skeleton } from "@/components/ui/skeleton";
import { useFetchEventsQuery } from "@/hooks/api-hooks/fetch.events.query";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { RootState } from "@/lib/store";
import { clearFilters } from "@/lib/store/slices/filter-slice";
interface ICustomTabsTrigger {
  label: string;
  value: string;
}

type EventAccumulator = {
  [key: string]: {
    data: IEvent[];
    name: string;
    cacheKey: string;
  };
};

const statusTypes: string[] = process.env.NEXT_PUBLIC_STATUS_TYPES
  ? (process.env.NEXT_PUBLIC_STATUS_TYPES.split(",") as string[])
  : [];

const accumulator: EventAccumulator = {
  [EventType.ALL]: {
    data: [] as IEvent[],
    name: "TRENDING NOW",
    cacheKey: JSON.stringify([
      "/api/events",
      null,
      {
        status: statusTypes,
      },
    ]),
  },
  [EventType.UPCOMING]: {
    data: [] as IEvent[],
    name: "UPCOMING",
    cacheKey: JSON.stringify([
      "/api/events",
      null,
      {
        status: ["pending"],
      },
    ]),
  },
};

export const CustomTabsTrigger: FC<ICustomTabsTrigger> = ({ label, value }) => {
  return (
    <TabsTrigger
      value={value}
      defaultChecked
      className="!h-[34px] rounded-full p-0 px-[16px] !text-14 !text-grey-400 hover:bg-white/[12%] data-[state=active]:!bg-grey-250 data-[state=active]:px-[16px] data-[state=active]:py-[12px] data-[state=active]:!text-black lg:!h-[38px] lg:px-[20px] lg:!text-16 lg:data-[state=active]:px-[20px]"
    >
      {label}
    </TabsTrigger>
  );
};

interface IContentSection {
  initialEvents: IApiResponse<IEvent[]>;
}
const ContentSection: FC<IContentSection> = ({ initialEvents }) => {
  const dispatch = useAppDispatch();

  const { date, priceRange, search } = useAppSelector(
    (state: RootState) => state.filter,
  );
  const handleClearFilters = () => {
    dispatch(clearFilters());
  };

  const [eventType, setEventType] = useState<EventType | undefined>();
  const { data, isLoading, mutate, cache } = useFetchEventsQuery(
    {
      ...initialEvents,
      data: initialEvents.data.filter((data) => data.status !== "pending"),
    },
    eventType,
    search,
    true,
    priceRange ? priceRange[0] : undefined,
    priceRange ? priceRange[1] : undefined,
    date?.from ? format(date.from, "yyyy-MM-dd HH:mm:ss") : undefined,
    date?.to ? format(date.to, "yyyy-MM-dd HH:mm:ss") : undefined,
  );

  useEffect(() => {
    mutate();
  }, [priceRange, date, mutate]);

  const formattedStartDate = date?.from ? format(date.from, "dd/MM/yyyy") : "";
  const formattedEndDate = date?.to ? format(date.to, "dd/MM/yyyy") : "";

  const priceFormatter = new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    minimumFractionDigits: 0,
  });

  const minPrice = priceRange ? priceFormatter.format(priceRange[0]) : "";
  const maxPrice = priceRange ? priceFormatter.format(priceRange[1]) : "";

  const eventDateRange = date
    ? `Events from ${formattedStartDate} to ${formattedEndDate}`
    : "";
  const eventPriceRange =
    priceRange && priceRange.length > 1 ? `from ${minPrice} - ${maxPrice}` : "";
  const separator = eventDateRange && eventPriceRange ? ", " : "";

  const eventDetails = `${eventDateRange}${separator}${eventPriceRange}`;

  const filteredEvents = useMemo(() => {
    return initialEvents.data.reduce((accumulator, current) => {
      if (current.status !== "pending") {
        if (
          !accumulator[EventType.ALL].data.find((e) => e.uid === current.uid)
        ) {
          accumulator[EventType.ALL].data.push(current);
        }

        if (!accumulator[current.type]) {
          accumulator[current.type] = {
            data: [],
            name: current.type.toUpperCase(),
            cacheKey: JSON.stringify([
              "/api/events",
              null,
              {
                type: current.type.toLowerCase(),
                status: statusTypes,
              },
            ]),
          };
        }
        if (
          !accumulator[current.type].data.find((e) => e.uid === current.uid)
        ) {
          accumulator[current.type].data.push(current);
        }
      } else {
        if (
          !accumulator[EventType.UPCOMING].data.find(
            (e) => e.uid === current.uid,
          )
        ) {
          accumulator[EventType.UPCOMING].data.push(current);
        }
      }
      return accumulator;
    }, accumulator);
  }, [initialEvents]);

  const defaultSelected = useMemo(() => {
    if (filteredEvents[EventType.ALL].data.length > 0) {
      return EventType.ALL;
    } else {
      if (filteredEvents[EventType.UPCOMING].data.length > 0) {
        setEventType(EventType.UPCOMING);
        return EventType.UPCOMING;
      }
    }
    return EventType.ALL;
  }, [filteredEvents]);

  useEffect(() => {
    const eventDefault = initialEvents;
    eventDefault.data = [];
    if (filteredEvents) {
      Object.keys(filteredEvents).forEach((event) => {
        const eventData = filteredEvents[event as EventType];
        cache.delete(eventData.cacheKey);
        cache.set(eventData.cacheKey, {
          ...cache.get(eventData.cacheKey),
          data: {
            ...eventDefault,
            data: filteredEvents[event as EventType].data,
          },
        });
      });
    }
  }, [cache, filteredEvents, initialEvents]);

  return (
    <section className="relative mb-[100px] lg:mb-[140px]">
      <div className="bg-gradient-mobile lg:bg-gradient absolute z-[-1]"></div>
      <ContentAreaLayout className="relative z-50 flex-col">
        <div className="mb-[28px] flex flex-col lg:mb-[35px] lg:flex-row lg:items-center lg:justify-between">
          <h1 className="mb-[5px] text-20 font-bold text-white lg:mb-0 lg:text-36">
            All Events
          </h1>
          <div>
            {eventDetails && (
              <p className="text-12 leading-none text-grey-400 lg:text-14">
                {eventDetails}
                <Button
                  variant="link"
                  className="ml-[5px] h-auto p-0 !text-12 !text-primary-600 underline hover:opacity-75 lg:!text-14"
                  onClick={() => handleClearFilters()}
                >
                  Clear
                </Button>
              </p>
            )}
          </div>
        </div>
        <div>
          <Tabs
            defaultValue={defaultSelected}
            value={eventType}
            onValueChange={(id) =>
              setEventType(id === EventType.ALL ? undefined : (id as EventType))
            }
          >
            <ScrollArea className="whitespace-nowrap">
              <div className="flex w-max pb-[14px] lg:pb-[28px]">
                <TabsList
                  className="h-full space-x-[8px] !bg-transparent p-0"
                  suppressHydrationWarning
                >
                  {Object.keys(filteredEvents)
                    .filter(
                      (event) =>
                        filteredEvents[event as EventType].data.length > 0,
                    )
                    .sort((a, b) => {
                      if (a === "all") return -1;
                      if (b === "all") return 1;
                      if (a === "upcoming") return 1;
                      if (b === "upcoming") return -1;
                      return 0;
                    })
                    .map((event, index) => (
                      <CustomTabsTrigger
                        value={event}
                        label={filteredEvents[event as EventType].name}
                        key={index}
                      />
                    ))}
                </TabsList>
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </Tabs>
          {isLoading ? (
            <div className="mt-[15px] grid grid-cols-2 gap-x-[14px] gap-y-[28px] md:grid-cols-3 lg:gap-x-[22px] xl:md:grid-cols-4 xl:gap-x-[24px]">
              {[...Array(4)].map((_, index) => (
                <Skeleton
                  key={index}
                  className={`group relative flex min-h-[360px] w-full flex-col overflow-hidden rounded-[12px] border border-grey-550 lg:min-h-[480px] ${index >= 2 ? "hidden md:flex" : ""} ${index === 3 ? "xl:flex" : ""}`}
                />
              ))}
            </div>
          ) : (
            <EventGrid events={data} />
          )}
          {!isLoading && data.length === 0 ? (
            <p className="mt-[15px] text-center">Coming Soon</p>
          ) : (
            false
          )}
        </div>
      </ContentAreaLayout>
    </section>
  );
};

export default ContentSection;
