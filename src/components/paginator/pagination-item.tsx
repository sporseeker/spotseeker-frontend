import { FC, ReactNode } from "react";
import { PaginationItem } from "../ui/pagination";

interface ICustomPaginationItem {
  children: ReactNode;
}
export const CustomPaginationItem: FC<ICustomPaginationItem> = ({
  children,
}) => (
  <PaginationItem className="flex h-[32px] w-[32px] overflow-hidden rounded-[4px] border border-grey-550 [&>a]:h-full [&>a]:w-full [&>a]:text-grey-400">
    {children}
  </PaginationItem>
);
