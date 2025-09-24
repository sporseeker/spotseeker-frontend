import ImageWrapper from "@/components/image-wrapper";
import React from "react";

const FeaturedBadge = () => {
  return (
    <div className="absolute left-[12px] top-[12px] z-[10] flex min-h-[24px] items-center gap-x-[5px] rounded-[8px] bg-white px-[8px] py-[4px] leading-[1]">
      <ImageWrapper
        src="/icons/sparkle.svg"
        className="h-[14px] w-[14px]"
        skeleton={false}
      />
      <p className="text-12 font-medium text-primary-600">Featured</p>
    </div>
  );
};

export default FeaturedBadge;
