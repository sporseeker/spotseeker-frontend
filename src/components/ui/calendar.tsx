"use client";

import * as React from "react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  showOutsideDays = true,

  ...props
}: CalendarProps) {
  return (
    <DayPicker
      mt-2={showOutsideDays}
      className={cn("bg-transparent", className)}
      classNames={{
        months:
          "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 relative",
        month: "space-y-4 !ml-0 !mt-0",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        month_grid: "w-full border-collapse space-y-1 !m-[20px]",
        weekdays: "flex",
        weekday:
          "text-neutral-500 rounded-md w-9 font-normal text-[0.8rem] dark:text-neutral-400",
        week: "flex w-full mt-0",

        day: "h-[40px] w-[40px] text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-neutral-100/50 [&:has([aria-selected])]:bg-neutral-100 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20 dark:[&:has([aria-selected].day-outside)]:bg-neutral-800/50 dark:[&:has([aria-selected])]:bg-neutral-800",
        day_button: cn(
          buttonVariants({ variant: "ghost" }),
          "h-[40px] w-[40px] p-0 font-semi-bold aria-selected:opacity-100 z-[10] group-[.day-range-start]:bg-primary-600 group-[.day-range-start]:rounded-full group-[.day-range-end]:bg-primary-600 group-[.day-range-end]:rounded-full rounded-full hover:bg-white/[24%] hover:text-white text-grey-100 font-onset",
        ),
        range_end:
          "group day-range-end rounded-r-[40px] bg-transparent border-none !bg-[#434343]",
        range_start:
          "group day-range-start !rounded-l-[40px] bg-transparent border-none !bg-[#434343]",
        selected: "!text-white bg-[#434343]",
        today: "bg-primary-900 border border-primary-600 rounded-full",
        outside:
          "day-outside text-neutral-500 opacity-50 aria-selected:bg-neutral-100/50 aria-selected:text-neutral-500 aria-selected:opacity-30 ",
        disabled: "text-neutral-500 opacity-50 dark:text-neutral-400",
        range_middle:
          "aria-selected:bg-[#434343] aria-selected:text-neutral-900  aria-selected:rounded-[0] aria-selected:border-none",
        hidden: "invisible",
      }}
      footer
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
