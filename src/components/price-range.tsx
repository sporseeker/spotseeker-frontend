"use client";
import * as React from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { Slider } from "./ui/slider";
import { buttonVariants } from "./ui/button";

interface IPriceRange {
  onChange: (value: number[]) => void;
  value: number[] | undefined;
  minPrice: number;
  maxPrice: number;
}

const PriceRange: React.FC<IPriceRange> = ({
  onChange,
  value,
  minPrice,
  maxPrice,
}) => {
  const [open, setIsOpen] = useState(false);
  const [range, setRange] = useState<number[]>([minPrice, maxPrice]);
  React.useEffect(() => {
    setRange([minPrice, maxPrice]);
  }, [minPrice, maxPrice]);

  return (
    <div className="">
      <div className={cn("grid gap-2")}>
        <Popover onOpenChange={setIsOpen} open={open}>
          <PopoverTrigger asChild>
            <div
              className={cn(
                "flex gap-x-[8px] hover:cursor-pointer hover:opacity-75",
              )}
            >
              <div
                className={cn(
                  value && value.length > 0
                    ? 'relative before:absolute before:right-[-5px] before:top-[-5px] before:flex before:h-[10px] before:w-[10px] before:rounded-full before:bg-primary-600 before:content-[""]'
                    : "",
                )}
              >
                <Image
                  className="h-[16px] w-[16px] object-contain group-[.not-home]:!h-[16px] group-[.not-home]:!w-[16px] lg:h-[20px] lg:w-[20px]"
                  src={"/images/home/money.svg"}
                  width={100}
                  height={100}
                  alt="price icon"
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
            <div className="w-[320px] px-[16px] pb-[20px] pt-[30px]">
              <Slider
                max={maxPrice}
                min={minPrice}
                step={1}
                className={cn("w-[100%]")}
                onValueChange={setRange}
                value={range}
              />
              <div className="mt-[30px] flex justify-between">
                <div className="flex h-[34px] min-w-[112px] items-center justify-center rounded-[8px] border border-[#393939] bg-[#1e1e1e] text-14 !text-gray-100">
                  {`${new Intl.NumberFormat("en-US").format(range[0])}LKR`}
                </div>
                <div className="flex h-[34px] min-w-[112px] items-center justify-center rounded-[8px] border border-[#393939] bg-[#1e1e1e] text-14 !text-gray-100">
                  {`${new Intl.NumberFormat("en-US").format(range[1])}LKR`}
                </div>
              </div>
            </div>
            <div className="flex min-h-[58px] items-center justify-between border-t !border-[#434343] px-[16px]">
              <div>
                <button
                  className={cn(
                    buttonVariants({ variant: "link" }),
                    "p-0 !font-semibold !text-grey-100",
                    range[0] === minPrice && range[1] === maxPrice
                      ? "hidden"
                      : "",
                  )}
                  onClick={() => {
                    setRange([minPrice, maxPrice]);
                    onChange([]);
                  }}
                >
                  Clear
                </button>
              </div>

              <button
                className={cn(
                  buttonVariants({ variant: "default" }),
                  "h-[34px] min-w-[72px] rounded-[8px] !bg-primary-600 p-0 !font-semibold !text-grey-100 hover:opacity-75",
                )}
                disabled={!range}
                onClick={() => {
                  setIsOpen(false);
                  onChange(range);
                }}
              >
                Apply
              </button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default PriceRange;
