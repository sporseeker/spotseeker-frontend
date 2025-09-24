"use client";
import React, { useEffect, useState } from "react";
import { AutoComplete } from "@/components/autocomplete";
import { ContentAreaLayout } from "@/components/content-area-layout";
import { useFetchEventsQuery } from "@/hooks/api-hooks/fetch.events.query";
import { RootState } from "@/lib/store";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";

import {
  setDate,
  setPriceRange,
  setSearch,
  clearFilters,
} from "@/lib/store/slices/filter-slice";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";

const HomeBannerSection = () => {
  const dispatch = useAppDispatch();
  const { date, priceRange, search } = useAppSelector(
    (state: RootState) => state.filter,
  );
  const [searchValue, setSearchValue] = useState<string>("");
  const [selectedValue, setSelectedValue] = useState<string>("");

  const { data, isLoading } = useFetchEventsQuery(
    null,
    undefined,
    selectedValue,
    !!selectedValue,
    priceRange ? priceRange[0] : undefined,
    priceRange ? priceRange[1] : undefined,
    date?.from ? format(date.from, "yyyy-MM-dd HH:mm:ss") : undefined,
    date?.to ? format(date.to, "yyyy-MM-dd HH:mm:ss") : undefined,
  );

  useEffect(() => {
    if (!search) {
      setSearchValue("");
      setSelectedValue("");
    }
  }, [search]);

  const handleDateChange = (newDate: DateRange | undefined) => {
    dispatch(setDate(newDate));
  };

  const handlePriceRangeChange = (range: number[]) => {
    dispatch(setPriceRange(range));
  };

  const handleSearchChange = (searchTerm: string) => {
    dispatch(setSearch(searchTerm));
  };

  useEffect(() => {
    return () => {
      dispatch(clearFilters());
    };
  }, [dispatch]);

  return (
    <section className="relative mx-auto flex h-[510px] justify-center lg:h-[754px]">
      <div className="relative flex h-[470px] w-full justify-center lg:h-[664px]">
        <div className="absolute z-30 h-[470px] w-full bg-[url('/images/home/banner.png')] bg-cover bg-center bg-no-repeat xs:bg-[url('/images/home/bg.png')] lg:h-[664px]"></div>
        {/* <div className="absolute bottom-[-65px] z-20 h-[176px] w-full max-w-[958px] bg-[radial-gradient(ellipse_at_50%_50%,_rgba(102,_59,_255,_18%)_0%,_rgba(255,_87,_34,_0%)_75%)]"></div> */}
        <ContentAreaLayout className="z-40 max-w-[1440px] justify-center pt-[130px] lg:pt-[170px]">
          <div>
            <h1 className="mb-[20px] max-w-[800px] text-center text-28 font-extrabold leading-1-21 tracking-[-0.28px] text-white lg:mb-[40px] lg:text-56 lg:leading-1-21 lg:tracking-[-0.56px]">
              Reserve your spot in just a few clicks!
            </h1>
            <div className="flex flex-col items-center justify-center">
              <AutoComplete
                selectedValue={selectedValue}
                onSelectedValueChange={setSelectedValue}
                searchValue={searchValue}
                onSearchValueChange={setSearchValue}
                items={data}
                emptyMessage="No results found."
                placeholder="Search Events......"
                date={date}
                setDate={handleDateChange}
                priceRange={priceRange}
                setPriceRange={handlePriceRangeChange}
                isLoading={isLoading}
                onSearchButtonClick={() => {
                  handleSearchChange(selectedValue);
                }}
              />
            </div>
          </div>
        </ContentAreaLayout>
        <div className="absolute bottom-[-5px] z-50 h-[20px] w-[1440px] bg-[url('/images/home/red-line-mobile.png')] bg-contain bg-center bg-no-repeat xs:h-[36px] xs:bg-[url('/images/home/line.png')]"></div>
        <div className="absolute bottom-[-90px] z-50 h-[100px] w-[1440px] bg-[url('/images/home/blue-mobile.png')] bg-contain bg-center bg-no-repeat xs:bottom-[-100px] xs:h-[128px] xs:bg-[url('/images/home/blue-desktop.png')] sm:bottom-[-125px] sm:h-[155px]"></div>
      </div>
    </section>
  );
};

export default HomeBannerSection;
