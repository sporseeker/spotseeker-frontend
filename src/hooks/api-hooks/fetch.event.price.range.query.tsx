import { IApiResponse } from "@/types/response";
import { useFetch } from "../https";
import { IEvent } from "@/types/event/event";
import { useMemo } from "react";

const statusTypes: string[] = process.env.NEXT_PUBLIC_STATUS_TYPES
  ? (process.env.NEXT_PUBLIC_STATUS_TYPES.split(",") as string[])
  : [];
export const useFetchEventPriceRangeQuery = () => {
  const { data, error, isLoading } = useFetch<IApiResponse<IEvent[]>>(
    "/api/events",
    {
      method: "GET",
      params: {
        status: statusTypes,
      },
    },
  );
  const minMax = useMemo(
    () =>
      data?.data
        .flatMap((event) => event.ticket_packages)
        .filter((pkg) => Number(pkg.price) > 0)
        .reduce(
          (acc, pkg) => {
            const price = Number(pkg.price);
            acc.minPrice = Math.min(acc.minPrice, price);
            acc.maxPrice = Math.max(acc.maxPrice, price);
            return acc;
          },
          { minPrice: Infinity, maxPrice: -Infinity },
        ),
    [data],
  );

  return {
    data: minMax || { minPrice: 0, maxPrice: 50000 },
    error,
    isLoading,
  };
};
