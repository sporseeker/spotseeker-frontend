import useSWR, { SWRConfiguration, useSWRConfig } from "swr";
import useSWRMutation, { SWRMutationConfiguration } from "swr/mutation";
import request, { RequestConfig, RespondError } from "../lib/request";

export const useFetch = <TData = unknown, TPayload = unknown>(
  url: string,
  config: RequestConfig<TPayload> = {},
  {
    enable = true,
    ...options
  }: SWRConfiguration<TData, RespondError> & {
    enable?: boolean;
  } = {},
) => {
  const key = enable
    ? JSON.stringify([url, config.payload, config.params])
    : null;

  const fetcher = useSWR(key, () => request<TData, TPayload>(url, config), {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    ...options,
  });

  return {
    ...fetcher,
    isError: !!fetcher.error,
  };
};

export const useMutate = <TData = unknown, TPayload = unknown>(
  url: string,
  config: RequestConfig<TPayload> = {},
  options: SWRMutationConfiguration<TData, RespondError> = {},
) => {
  const { cache } = useSWRConfig();
  const { trigger, ...rest } = useSWRMutation(
    url,
    (url: string, { arg }: { arg: RequestConfig<TPayload> }) => {
      return request<TData, TPayload>(url, {
        method: "POST",
        ...config,
        ...arg,
      });
    },
    options,
  );

  return {
    ...rest,
    cache,
    mutate: trigger,
    isError: !!rest.error,
  };
};
