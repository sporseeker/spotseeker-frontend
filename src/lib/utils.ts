import { ICommonEventState } from "@/types/event/event";
import { clsx, type ClassValue } from "clsx";
import { format, parse } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const convertToLKR = (
  amount: number | string,
  minimumFractionDigits = 2,
  maximumFractionDigits = 2,
) => {
  const numericAmount =
    typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(numericAmount)) {
    throw new Error("Invalid amount: cannot convert to a number.");
  }

  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(numericAmount);
};

export const submitForm = (
  action: string,
  method: string,
  data: Record<string, string>,
) => {
  const form = document.createElement("form");
  form.method = method;
  form.action = action;

  Object.keys(data).forEach((key) => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = key;
    input.value = data[key];
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();
};

export const transformEventStates = (
  eventStates: ICommonEventState[],
): Record<string, string | number> => {
  const result: Record<string, string | number> = {};

  eventStates.forEach((event, index) => {
    const position = index + 1;
    result[`item_name_${position}`] = event.name;
    result[`item_number_${position}`] = event.id;
    result[`amount_${position}`] = event.price;
    result[`quantity_${position}`] = event.count;
  });

  return result;
};

export const formatDateTypeOne = (dateString: string) => {
  const date = parse(dateString, "yyyy-MM-dd HH:mm:ss", new Date());
  return format(date, "MMM d, h:mma 'onwards'");
};

type Nullable<T> = {
  [K in keyof T]: T[K] | null;
};

export const removeTopLevelNullValues = <T extends object>(
  obj: Nullable<T>,
): T => {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (value !== null) {
      (acc as T)[key as keyof T] = value as T[keyof T];
    }
    return acc;
  }, {} as T);
};
