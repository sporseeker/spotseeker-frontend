import { IApiResponse } from "@/types/response";
import { useFetch } from "../https";
import { OrderResponse } from "@/types/order";

export const useFetchOrdersQuery = () => {
  const { data, error, isLoading, mutate } = useFetch<
    IApiResponse<OrderResponse>
  >(
    "/api/user/orders",
    {
      method: "GET",
    },
    {
      revalidateOnMount: true,
      revalidateIfStale: true,
    },
  );

  return {
    data: data?.data,
    error,
    isLoading,
    mutate,
  };
};
