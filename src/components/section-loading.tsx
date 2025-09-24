import React from "react";
import { ContentAreaLayout } from "./content-area-layout";
import { Skeleton } from "./ui/skeleton";

const SectionLoading = () => {
  return (
    <section>
      <ContentAreaLayout className="static h-full flex-col items-end">
        <div className="mb-[100px] mt-[80px] grid h-full w-full grid-cols-1 pt-[24px] lg:mt-[120px] lg:grid-cols-[36%_1fr] lg:gap-x-[40px] lg:pt-[35px]">
          <Skeleton className="h-[200px] w-full lg:h-[500px]" />
          <Skeleton className="h-[150px] w-full lg:h-[500px]" />
        </div>
      </ContentAreaLayout>
    </section>
  );
};

export default SectionLoading;
