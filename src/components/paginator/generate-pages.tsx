
import { PaginationEllipsis, PaginationLink } from "@/components/ui/pagination";
import { CustomPaginationItem } from "./pagination-item";
import { cn } from "@/lib/utils";

export const generatePaginationLinks = (
  currentPage: number,
  totalPages: number,
  onPageChange: (page: number) => void,
) => {
  const pages: JSX.Element[] = [];
  if (totalPages <= 6) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <CustomPaginationItem key={i}>
          <PaginationLink
            href="#"
            isActive={i === currentPage}
            onClick={() => onPageChange(i)}
            className={cn(
              "[data-status='active']:bg-primary-600 rounded-none data-[status=active]:border-none data-[status=active]:!bg-grey-550 data-[status=active]:!text-grey-100",
              i === currentPage ? "pointer-events-none opacity-50" : undefined,
            )}
          >
            {i}
          </PaginationLink>
        </CustomPaginationItem>,
      );
    }
  } else {
    for (let i = 1; i <= 2; i++) {
      pages.push(
        <CustomPaginationItem key={i}>
          <PaginationLink
            href="#"
            isActive={i === currentPage}
            onClick={() => onPageChange(i)}
            className={cn(
              "[data-status='active']:bg-primary-600 rounded-none data-[status=active]:border-none data-[status=active]:!bg-grey-550 data-[status=active]:!text-grey-100",
              i === currentPage ? "pointer-events-none opacity-50" : undefined,
            )}
          >
            {i}
          </PaginationLink>
        </CustomPaginationItem>,
      );
    }
    if (2 < currentPage && currentPage < totalPages - 1) {
      pages.push(<PaginationEllipsis />);
      pages.push(
        <CustomPaginationItem key={currentPage}>
          <PaginationLink
            href="#"
            isActive={true}
            onClick={() => onPageChange(currentPage)}
            className={cn(
              "[data-status='active']:bg-primary-600 rounded-none data-[status=active]:border-none data-[status=active]:!bg-grey-550 data-[status=active]:!text-grey-100",
              "pointer-events-none opacity-50",
            )}
          >
            {currentPage}
          </PaginationLink>
        </CustomPaginationItem>,
      );
    }
    pages.push(<PaginationEllipsis />);
    for (let i = totalPages - 1; i <= totalPages; i++) {
      pages.push(
        <CustomPaginationItem key={i}>
          <PaginationLink
            href="#"
            onClick={() => onPageChange(i)}
            isActive={i === currentPage}
            className={cn(
              "[data-status='active']:bg-primary-600 rounded-none data-[status=active]:border-none data-[status=active]:!bg-grey-550 data-[status=active]:!text-grey-100",
              i === currentPage ? "pointer-events-none opacity-50" : undefined,
            )}
          >
            {i}
          </PaginationLink>
        </CustomPaginationItem>,
      );
    }
  }
  return pages;
};
