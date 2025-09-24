import { RawAxiosRequestConfig, RawAxiosRequestHeaders } from "axios";
import http from "./http";
export type RespondError = { status: number | string; message: string };

export type RequestConfig<TPayload> = RawAxiosRequestConfig & {
  type?: "csv" | "multipart";
  token?: string;
  payload?: TPayload;
  headers?: RawAxiosRequestHeaders;
  path?: IReplacementPath[];
};
interface IReplacementPath {
  name: string;
  value: string;
}
const objectToFormData = <T>(
  obj: T,
  formData = new FormData(),
  parentKey = "",
) => {
  for (const key in obj) {
    if (Object.hasOwnProperty.call(obj, key)) {
      const value = obj[key];
      const computedKey = parentKey ? `${parentKey}[${key}]` : key;

      if (
        typeof value === "object" &&
        !Array.isArray(value) &&
        !(value instanceof FileList)
      ) {
        if (value instanceof File) {
          // Convert File to Blob
          const blob = new Blob([value], { type: value.type });
          formData.append(computedKey, blob, value.name);
        } else {
          objectToFormData(value, formData, computedKey);
        }
      } else if (value instanceof FileList) {
        for (let i = 0; i < value.length; i++) {
          formData.append(computedKey, value[i]);
        }
      } else if (Array.isArray(value)) {
        value.forEach((item, index) => {
          const arrayKey = `${computedKey}[${index}]`;
          if (typeof item === "object") {
            if (item instanceof File) {
              // Convert File to Blob
              const blob = new Blob([item], { type: item.type });
              formData.append(computedKey, blob, item.name);
            } else {
              objectToFormData(item, formData, arrayKey);
            }
          } else {
            formData.append(arrayKey, item);
          }
        });
      } else {
        formData.append(computedKey, value as string);
      }
    }
  }

  return formData;
};
const replacePlaceholders = (
  path: string,
  replacements: IReplacementPath[],
): string => {
  return replacements.reduce((result, { name, value }) => {
    const placeholder = `:${name}`;
    return result.replace(new RegExp(placeholder, "g"), value);
  }, path);
};

export default async function request<TData = unknown, TPayload = unknown>(
  url: string,
  config?: RequestConfig<TPayload>,
) {
  const formData = typeof window !== "undefined" && new FormData();
  const {
    type,
    payload,
    method = "POST",
    headers = {},
    path = "",
    ...rest
  } = config || {};

  switch (type) {
    case "csv":
      rest.responseType = "blob";
      headers["Accept"] = "application/csv";
      break;

    case "multipart":
      headers["Content-Type"] = "multipart/form-data";
      if (formData && payload) {
        objectToFormData<TPayload>(payload, formData);
      }
      break;

    default:
      headers["Content-Type"] = "application/json";
  }
  return http<TData>({
    url: path ? replacePlaceholders(url, path) : url,
    method,
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    headers: { ...headers },
    withCredentials: true,
    [method !== "GET" ? "data" : "params"]:
      type === "multipart" ? formData : payload,
    ...rest,
  })
    .then(({ data }) => data)
    .catch(({ code, message, response }) => {
      return Promise.reject({
        statusText: response.data.status || "",
        status: response.status || code,
        message: response.data.message || message,
        errors: response.data.errors || null,
      });
    });
}
