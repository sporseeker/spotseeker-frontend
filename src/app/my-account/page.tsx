import { Suspense } from "react";
import SidebarLayout from "@/components/layout/sidebar-layout";
import SectionLoading from "@/components/section-loading";

const MyAccountPage = () => {
  return (
    <main className="w-full justify-center px-4 pb-20 pt-[120px] md:px-0 lg:pt-[150px]">
      <Suspense fallback={<SectionLoading />}>
        <SidebarLayout />
      </Suspense>
    </main>
  );
};

export default MyAccountPage;
