"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import IconButton from "../IconButton";
import { useIsMobile } from "@/hooks/use-mobile";
import { MyBookings, Profile } from "@/app/my-account/_components";
import { Dialog } from "@/components/ui/dialog";
import LogoutModal from "@/components/logoutModal";
import { useRouter } from "next/navigation";

type NavItem = {
  icon: string;
  label: string;
  component: string;
};

const navItems: NavItem[] = [
  { icon: "/icons/ticket.svg", label: "My Bookings", component: "bookings" },
  { icon: "/icons/profile.svg", label: "Profile", component: "profile" },
  { icon: "/icons/logout.svg", label: "Logout", component: "logout" },
];

const SidebarLayout: React.FC = () => {
  const searchParams = useSearchParams();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("bookings");
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const tab = searchParams?.get("tab") || "bookings";
    setActiveTab(tab);
  }, [searchParams]);

  const handleNavigation = (component: string) => {
    if (component === "logout") {
      setIsLogoutModalOpen(true);
    } else {
      router.push(`/my-account?tab=${component}`);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "bookings":
        return <MyBookings />;
      case "profile":
        return <Profile />;
      default:
        return <MyBookings />;
    }
  };

  // const MobileNav = () => (
  //   <div className="mb-4 hidden w-full flex-col items-start justify-center rounded-lg border border-[#1f1f1f] bg-[#e50914] p-2 lg:inline-flex">
  //     {navItems.map((item) => (
  //       <div
  //         key={item.label}
  //         className="inline-flex cursor-pointer items-center justify-start gap-3 self-stretch rounded-lg p-3"
  //         onClick={() => handleNavigation(item.component)}
  //       >
  //         <Image src={item.icon} alt={item.label} width={18} height={18} />
  //         <div className="font-['Onest'] text-sm font-medium text-white">
  //           {item.label}
  //         </div>
  //       </div>
  //     ))}
  //   </div>
  // );

  return (
    <>
      <div className="flex justify-center bg-transparent">
        <div className="!container-1240 flex w-full flex-col gap-16 md:flex-row">
          {!isMobile && (
            <nav className="hidden w-64 bg-transparent shadow-md md:block">
              <ul className="space-y-2">
                {navItems.map((item) => (
                  <li key={item.label}>
                    <IconButton
                      icon={item.icon}
                      label={item.label}
                      isActive={activeTab === item.component}
                      onClick={() => handleNavigation(item.component)}
                    />
                  </li>
                ))}
              </ul>
            </nav>
          )}

          <main className="flex-1 bg-transparent shadow-md md:ml-8">
            {/* {isMobile && <MobileNav />} */}
            {renderContent()}
          </main>
        </div>
      </div>
      <Dialog open={isLogoutModalOpen} onOpenChange={setIsLogoutModalOpen}>
        <LogoutModal onClose={() => setIsLogoutModalOpen(false)} />
      </Dialog>
    </>
  );
};

export default SidebarLayout;
