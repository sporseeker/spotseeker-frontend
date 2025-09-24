import { IApiResponse } from "@/types/response";
import { useFetch } from "../https";
import { IEvent } from "@/types/event/event";
import { EventType } from "@/enum/event";
import { useSWRConfig } from "swr";
const statusTypes: string[] = process.env.NEXT_PUBLIC_STATUS_TYPES
  ? (process.env.NEXT_PUBLIC_STATUS_TYPES.split(",") as string[])
  : [];
export const useFetchEventsQuery = (
  fallbackData: IApiResponse<IEvent[]> | null,
  type?: string,
  search?: string,
  enable?: boolean,
  price_min?: number,
  price_max?: number,
  start_date?: string,
  end_date?: string,
) => {
  if (price_min === 0) {
    price_min = 1;
  }
  const { cache } = useSWRConfig();
  const { data, error, isLoading, mutate } = useFetch<IApiResponse<IEvent[]>>(
    "/api/events",
    {
      method: "GET",
      params: {
        ...(type && type !== EventType.UPCOMING ? { type } : {}),
        ...(search ? { search } : {}),
        ...(price_min ? { price_min: price_min === 0 ? 1 : price_min } : {}),
        ...(price_max ? { price_max } : {}),
        ...(start_date ? { start_date } : {}),
        ...(end_date ? { end_date } : {}),
        status: [...(type === EventType.UPCOMING ? ["pending"] : statusTypes)],
      },
    },
    {
      fallbackData: type || !!search ? undefined : (fallbackData ?? undefined),
      enable: enable ?? true,
    },
  );
  return {
    data: data?.data ?? [],
    error,
    isLoading,
    mutate,
    cache,
  };
};
