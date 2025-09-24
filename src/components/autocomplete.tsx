import { cn } from "@/lib/utils";
import { debounce } from "lodash";
import { Command as CommandPrimitive } from "cmdk";
import { Search } from "lucide-react";
import { Dispatch, useCallback, useState } from "react";
import Image from "next/image";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "./ui/custom-command";
import { Input } from "./ui/input";
import { Popover, PopoverAnchor, PopoverContent } from "./ui/popover";
import { Skeleton } from "./ui/skeleton";
import CalendarDateRange from "./calendar-date-range";
import PriceRange from "./price-range";
import { DateRange } from "react-day-picker";
import { Button } from "./ui/button";
import { format, parse } from "date-fns";
import { IEvent } from "@/types/event/event";
import { useRouter } from "next/navigation";
import { useFetchEventPriceRangeQuery } from "@/hooks/api-hooks/fetch.event.price.range.query";

type Props = {
  selectedValue: string;
  onSelectedValueChange: (value: string) => void;
  searchValue: string;
  onSearchValueChange: (value: string) => void;
  items: IEvent[];
  isLoading?: boolean;
  emptyMessage?: string;
  placeholder?: string;
  date: DateRange | undefined;
  setDate: Dispatch<DateRange | undefined>;
  priceRange: number[] | undefined;
  setPriceRange: (range: number[]) => void;
  onSearchButtonClick?: () => void;
  isSimplifiedHeader?: boolean;
};

export function AutoComplete({
  onSelectedValueChange,
  searchValue,
  onSearchValueChange,
  items,
  isLoading,
  emptyMessage = "No items.",
  placeholder = "Search...",
  date,
  setDate,
  priceRange,
  setPriceRange,
  onSearchButtonClick,
  isSimplifiedHeader = true,
}: Props) {
  const [open, setOpen] = useState(false);

  const performSearch = async (query: string): Promise<void> => {
    onSelectedValueChange(query);
  };

  const debouncedSearch = useCallback(
    debounce((query: string) => performSearch(query), 300), // Adjust delay as needed
    [],
  );
  const router = useRouter();
  const { data: defaultMinMax } = useFetchEventPriceRangeQuery();

  return (
    <div className="flex w-full items-center">
      <Popover open={open} onOpenChange={setOpen}>
        <Command shouldFilter={false}>
          <PopoverAnchor asChild>
            <div
              className={cn(
                "flex w-[350px] overflow-hidden rounded-[8px] border border-white/20 group-[.not-home]:hidden group-[.not-home]:max-w-[500px] md:w-[560px] group-[.not-home]:lg:flex",
                open ? "border-primary-900" : "",
              )}
            >
              {isSimplifiedHeader && (
                <>
                  <div className="flex min-w-[104px] items-center justify-center gap-x-[12px] border-r !border-white/20 !bg-black/80 px-[12px] group-[.not-home]:!h-[42px] group-[.not-home]:!min-w-[104px] group-[.not-home]:!px-[12px] lg:h-[56px] lg:min-w-[122px] lg:gap-x-[16px] lg:px-[16px]">
                    <CalendarDateRange
                      onChange={setDate}
                      value={date}
                      key="CalendarDateRange"
                    />
                    <PriceRange
                      onChange={setPriceRange}
                      value={priceRange}
                      minPrice={defaultMinMax.minPrice}
                      maxPrice={defaultMinMax.maxPrice}
                      key="PriceRange"
                    />
                  </div>
                </>
              )}
              <CommandPrimitive.Input
                asChild
                value={searchValue}
                onValueChange={(s) => {
                  debouncedSearch(s);
                  onSearchValueChange(s);
                }}
                onKeyDown={(e: { key: string }) => setOpen(e.key !== "Escape")}
                onMouseDown={() => setOpen((open) => !!searchValue && !open)}
              >
                <Input
                  placeholder={placeholder}
                  className="h-[46px] w-full !rounded-none border-none !bg-black/40 !text-14 !text-grey-100 placeholder:!text-14 hover:!ring-0 focus:!ring-0 group-[.not-home]:!h-[42px] lg:h-[56px] lg:!text-18 lg:placeholder:!text-18 group-[.not-home]:lg:!text-14 group-[.not-home]:lg:placeholder:!text-14"
                />
              </CommandPrimitive.Input>

              <Button
                variant="ghost"
                className="h-[46px] min-w-[52px] !rounded-l-none border-none !bg-primary-600 !text-grey-100 hover:!bg-primary-600 hover:opacity-75 disabled:!opacity-100 group-[.not-home]:!h-[42px] lg:h-[56px] lg:min-w-[64px]"
                disabled={!onSearchButtonClick}
                onClick={() => {
                  if (onSearchButtonClick) {
                    onSearchButtonClick();
                  }
                }}
              >
                <Search className="h-[15px] w-[15px] lg:h-[24px] lg:w-[24px]" />
              </Button>
            </div>
          </PopoverAnchor>
          {!open && <CommandList aria-hidden="true" className="hidden" />}
          <PopoverContent
            asChild
            onOpenAutoFocus={(e) => e.preventDefault()}
            onInteractOutside={(e) => {
              if (
                e.target instanceof Element &&
                e.target.hasAttribute("cmdk-input")
              ) {
                e.preventDefault();
              }
            }}
            align="end"
            className="z-[100] !p-[8px]"
          >
            <CommandList className="w-[--radix-popover-trigger-width] p-0">
              {isLoading && (
                <CommandPrimitive.Loading>
                  <div className="p-1">
                    <Skeleton className="h-[60px] w-full" />
                  </div>
                </CommandPrimitive.Loading>
              )}
              {items.length > 0 && !isLoading ? (
                <CommandGroup>
                  {items.map((option) => (
                    <CommandItem
                      key={option.uid}
                      onMouseDown={(e) => e.preventDefault()}
                      className="rounded-[8px] p-[8px] hover:cursor-pointer hover:bg-grey-600"
                    >
                      <div
                        className="flex gap-x-[15px] hover:cursor-pointer"
                        onClick={() => {
                          router.push(`/event/${option.uid}`);
                        }}
                      >
                        <Image
                          className="rounded-[6px] object-cover"
                          src={option.thumbnail_img}
                          width={48}
                          height={40}
                          alt=""
                        />
                        <div>
                          <p className="text-14 font-semibold text-white">
                            {option.name}
                          </p>
                          <p className="text-14 text-[#8c8c8c]">
                            {`${format(parse(option.start_date, "yyyy-MM-dd HH:mm:ss", new Date()), "MMM d • h:mmaaa")} onwards`}
                          </p>
                        </div>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              ) : null}
              {!isLoading ? (
                <CommandEmpty className="flex min-h-[56px] items-center justify-center text-center text-grey-100">
                  {emptyMessage ?? "No items."}
                </CommandEmpty>
              ) : null}
            </CommandList>
          </PopoverContent>
        </Command>
      </Popover>
    </div>
  );
}
