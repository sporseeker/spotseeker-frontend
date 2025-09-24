import {
  Pagination,
  PaginationContent,
  PaginationLink,
} from "@/components/ui/pagination";
import { generatePaginationLinks } from "./generate-pages";
import { CustomPaginationItem } from "./pagination-item";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

type PaginatorProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (pageNumber: number) => void;
  showPreviousNext: boolean;
};

export default function Paginator({
  currentPage,
  totalPages,
  onPageChange,
  showPreviousNext,
}: PaginatorProps) {
  return (
    <Pagination>
      <PaginationContent className="gap-x-[6px]">
        {showPreviousNext && totalPages ? (
          <CustomPaginationItem>
            <PaginationLink
              href="#"
              onClick={() => onPageChange(currentPage - 1)}
              tabIndex={currentPage <= 1 ? -1 : undefined}
              className={cn(
                currentPage - 1 < 1
                  ? "pointer-events-none opacity-50"
                  : undefined,
                "[data-status='active']:bg-primary-600",
              )}
            >
              <ChevronLeft className="h-[16px] w-[16px]" />
            </PaginationLink>
          </CustomPaginationItem>
        ) : null}
        {generatePaginationLinks(currentPage, totalPages, onPageChange)}
        {showPreviousNext && totalPages ? (
          <CustomPaginationItem>
            <PaginationLink
              href="#"
              onClick={() => onPageChange(currentPage + 1)}
              tabIndex={currentPage <= 1 ? -1 : undefined}
              className={cn(
                currentPage > totalPages - 1
                  ? "pointer-events-none opacity-50"
                  : undefined,
                "[data-status='active']:bg-primary-600",
              )}
            >
              <ChevronRight className="h-[16px] w-[16px]" />
            </PaginationLink>
          </CustomPaginationItem>
        ) : null}
      </PaginationContent>
    </Pagination>
  );
}
