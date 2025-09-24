"use client";
import React, { useMemo, useState } from "react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ImageWrapper from "@/components/image-wrapper";
import { ContentAreaLayout } from "@/components/content-area-layout";
import { usePathname } from "next/navigation";
// import { DateRange } from "react-day-picker";
// import { AutoComplete } from "./autocomplete";
import { cn } from "@/lib/utils";
// import { useFetchEventsQuery } from "@/hooks/api-hooks/fetch.events.query";
import { useSession } from "next-auth/react";
import { Dialog } from "@radix-ui/react-dialog";
import LogoutModal from "./logoutModal";
// import { format } from "date-fns";
import { LogIn } from "lucide-react";
import { useFetchEventsQuery } from "@/hooks/api-hooks/fetch.events.query";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { AutoComplete } from "./autocomplete";

const navItems = [
  { icon: "/icons/ticket.svg", label: "My Bookings", link: "/my-account" },
  {
    icon: "/icons/profile.svg",
    label: "Profile",
    link: "/my-account?tab=profile",
  },
];

const Header = () => {
  const pathname = usePathname();
  const { status } = useSession();
  const [date, setDate] = useState<DateRange | undefined>();
  const [priceRange, setPriceRange] = useState<number[] | undefined>([]);
  const [searchValue, setSearchValue] = useState<string>("");
  const [selectedValue, setSelectedValue] = useState<string>("");
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const isSimplifiedHeader = useMemo(
    () =>
      pathname === "/" ||
      pathname.includes("/auth") ||
      pathname.includes("/password/reset"),
    [pathname],
  );

  const isHome = useMemo(() => pathname === "/", [pathname]);

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

  return (
    <section
      className={cn(
        "relative z-[100] mb-[-92px] pb-[12px] pt-[20px] lg:mb-[-120px] lg:pb-[16px]",
        !isSimplifiedHeader ? "bg-black" : "",
        isHome ? "home bg-transparent pb-0 lg:pb-0" : "",
      )}
    >
      <ContentAreaLayout className="z-50">
        <div className="flex w-full justify-between">
          <Link href="/">
            <ImageWrapper
              src={"/images/header-banner/logo.png"}
              className={cn(
                "h-[60px] w-[133px] lg:h-[100px] lg:w-[219px]",
                !isSimplifiedHeader ? "lg:h-[68px] lg:w-[150px]" : "",
                !isHome ? "lg:h-[68px] lg:w-[150px]" : "",
              )}
              skeleton={false}
            />
          </Link>
          {!isSimplifiedHeader ? (
            <div className="not-home group flex flex-col items-center">
              <AutoComplete
                selectedValue={selectedValue}
                onSelectedValueChange={setSelectedValue}
                searchValue={searchValue}
                onSearchValueChange={setSearchValue}
                items={data}
                emptyMessage="No results found."
                placeholder="Search Events......"
                date={date}
                setDate={setDate}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                isLoading={isLoading}
                isSimplifiedHeader={isSimplifiedHeader}
              />
            </div>
          ) : (
            ""
          )}
          <div
            className={cn(
              "flex justify-end gap-x-[22px] pt-[8px] lg:min-w-[150px] lg:gap-x-[25px] lg:pt-[12px]",
            )}
          >
            {!isSimplifiedHeader && (
              <ImageWrapper
                src={"/images/header-banner/search.svg"}
                className="hidden h-[22px] w-[22px] hover:cursor-pointer hover:opacity-75 lg:hidden lg:h-[25px] lg:w-[25px]"
                skeleton={false}
              />
            )}

            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <button
                  className={cn(
                    buttonVariants({ variant: "ghost" }),
                    "h-[22px] w-auto min-w-0 !p-0 !ring-0 focus-within:!ring-0 hover:cursor-pointer hover:!bg-transparent lg:hover:opacity-75",
                  )}
                  title="User menu"
                  aria-label="User menu"
                >
                  <ImageWrapper
                    src={"/images/header-banner/user.svg"}
                    className="h-[22px] w-[22px] lg:h-[25px] lg:w-[25px]"
                    skeleton={false}
                  />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="!z-[150] !min-w-[220px] !rounded-[8px] border !border-grey-600 !bg-primary-600 !p-[8px]"
                side="bottom"
                align="end"
                sideOffset={10}
              >
                {status !== "authenticated" && (
                  <Link href={"/auth/signin"}>
                    <DropdownMenuItem className="h-[42px] w-full !rounded-[8px] hover:!cursor-pointer hover:!bg-grey-550">
                      <div className="inline-flex cursor-pointer items-center justify-start gap-x-[12px]">
                        <LogIn
                          width={18}
                          height={18}
                          className="text-white"
                          strokeWidth={3}
                        />
                        <div className="text-14 font-medium text-white">
                          Login
                        </div>
                      </div>
                    </DropdownMenuItem>
                  </Link>
                )}
                {navItems.map((item) => (
                  <Link
                    href={
                      status === "authenticated" ? item.link : "/auth/signin"
                    }
                    key={item.label}
                  >
                    <DropdownMenuItem className="h-[42px] w-full !rounded-[8px] hover:!cursor-pointer hover:!bg-grey-550">
                      <div className="inline-flex cursor-pointer items-center justify-start gap-x-[12px]">
                        <Image
                          src={item.icon}
                          alt={item.label}
                          width={18}
                          height={18}
                        />
                        <div className="text-14 font-medium text-white">
                          {item.label}
                        </div>
                      </div>
                    </DropdownMenuItem>
                  </Link>
                ))}
                {status === "authenticated" && (
                  <Link
                    href={"#"}
                    onClick={(e) => {
                      e.preventDefault();
                      setIsLogoutModalOpen(true);
                    }}
                  >
                    <DropdownMenuItem className="h-[42px] w-full !rounded-[8px] hover:!cursor-pointer hover:!bg-grey-550">
                      <div className="inline-flex cursor-pointer items-center justify-start gap-x-[12px]">
                        <Image
                          src={"/icons/logout.svg"}
                          alt={"logout"}
                          width={18}
                          height={18}
                        />
                        <div className="text-14 font-medium text-white">
                          Logout
                        </div>
                      </div>
                    </DropdownMenuItem>
                  </Link>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            {/* ) : (
              <Link href={"/auth/signin"}>
                <ImageWrapper
                  src={"/images/header-banner/user.svg"}
                  className="h-[22px] w-[22px] hover:cursor-pointer hover:opacity-75 lg:h-[25px] lg:w-[25px]"
                  skeleton={false}
                />
              </Link>
            )} */}

            <ImageWrapper
              src={"/images/header-banner/download.svg"}
              className="hidden h-[22px] w-[22px] hover:cursor-pointer hover:opacity-75 lg:h-[25px] lg:w-[25px]"
              skeleton={false}
            />
            <ImageWrapper
              src={"/images/header-banner/hamburger.svg"}
              className="hidden h-[22px] w-[22px] hover:cursor-pointer hover:opacity-75 lg:h-[25px] lg:w-[25px]"
              skeleton={false}
            />
          </div>
        </div>
      </ContentAreaLayout>
      <Dialog open={isLogoutModalOpen} onOpenChange={setIsLogoutModalOpen}>
        <LogoutModal onClose={() => setIsLogoutModalOpen(false)} />
      </Dialog>
    </section>
  );
};
export default Header;
