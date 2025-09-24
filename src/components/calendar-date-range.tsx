"use client";
import * as React from "react";
import { format, parse, isValid } from "date-fns";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import Image from "next/image";

interface ICalendarDateRange {
  onChange: (date: DateRange | undefined) => void;
  value: DateRange | undefined;
}

const CalendarDateRange: React.FC<ICalendarDateRange> = ({
  onChange,
  value,
}) => {
  const [date, setDate] = React.useState<DateRange | undefined>(
    value ?? undefined,
  );
  const [open, setIsOpen] = useState(false);

  return (
    <div className="">
      <div className={cn("grid gap-2")}>
        <Popover onOpenChange={setIsOpen} open={open}>
          <PopoverTrigger asChild>
            <div className="flex gap-x-[6px] hover:cursor-pointer hover:opacity-75">
              <div
                className={cn(
                  value
                    ? 'relative before:absolute before:right-[-5px] before:top-[-5px] before:flex before:h-[10px] before:w-[10px] before:rounded-full before:bg-primary-600 before:content-[""]'
                    : "",
                )}
              >
                <Image
                  className="h-[16px] w-[16px] object-contain group-[.not-home]:!h-[16px] group-[.not-home]:!w-[16px] lg:h-[20px] lg:w-[20px]"
                  src={"/images/home/calendar.svg"}
                  width={100}
                  height={100}
                  alt="calender icon"
                />
              </div>

              <Image
                src={"/images/home/dropdown.svg"}
                width={10}
                height={8}
                alt="dropdown icon"
                className="h-auto w-auto opacity-60"
              />
            </div>
          </PopoverTrigger>
          <PopoverContent
            className="!z-[100] w-auto rounded-[12px] !border !border-[#434343] !bg-grey-550 p-0"
            align="start"
          >
            <Calendar
              mode="range"
              // defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={1}
              hideWeekdays={true}
              showOutsideDays={false}
              components={{
                MonthCaption: ({ children }) => {
                  return (
                    <div className="flex min-h-[52px] items-center justify-between border-b !border-[#434343] px-[22px]">
                      <div>{children}</div>
                      <button
                        className={cn(
                          buttonVariants({ variant: "ghost" }),
                          "flex h-7 w-7 justify-end !bg-transparent p-0 !text-grey-100 opacity-50 hover:opacity-100",
                        )}
                        onClick={() => setIsOpen(false)}
                      >
                        <X width="18px" height="18px" />
                      </button>
                    </div>
                  );
                },
                CaptionLabel: ({ children }) => {
                  const parsedDate = parse(
                    children as string,
                    "MMMM yyyy",
                    new Date(),
                  );

                  return (
                    <p className="w-[105px] text-center text-14 font-semibold leading-[19.6px] text-grey-100">
                      {isValid(parsedDate) && children != undefined
                        ? format(parsedDate, "MMM yyyy")
                        : ""}
                    </p>
                  );
                },
                Nav: ({ onPreviousClick, onNextClick }) => {
                  return (
                    <div className="flex items-center justify-between">
                      <button
                        onClick={onPreviousClick}
                        className={cn(
                          buttonVariants({ variant: "ghost" }),
                          "absolute left-[10px] top-[11px] h-7 w-7 !bg-transparent p-0 !text-grey-100 opacity-50 hover:opacity-100 focus-visible:ring-0",
                        )}
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button
                        onClick={onNextClick}
                        className={cn(
                          buttonVariants({ variant: "ghost" }),
                          "absolute left-[110px] top-[11px] h-7 w-7 !bg-transparent p-0 !text-grey-100 opacity-50 hover:opacity-100",
                        )}
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </div>
                  );
                },
                Footer: () => (
                  <div className="flex min-h-[58px] items-center justify-between border-t !border-[#434343] px-[22px]">
                    <div>
                      <button
                        className={cn(
                          buttonVariants({ variant: "link" }),
                          !date ? "hidden" : "",
                          "p-0 font-semibold !text-grey-100",
                        )}
                        onClick={() => {
                          setDate(undefined);
                          onChange(undefined);
                        }}
                      >
                        Clear
                      </button>
                    </div>
                    <button
                      className={cn(
                        buttonVariants({ variant: "default" }),
                        "h-[34px] min-w-[72px] rounded-[8px] !bg-primary-600 p-0 font-bold !text-grey-100 hover:opacity-75",
                      )}
                      disabled={!date}
                      onClick={() => {
                        onChange(date);
                        setIsOpen(false);
                      }}
                    >
                      Apply
                    </button>
                  </div>
                ),
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default CalendarDateRange;
