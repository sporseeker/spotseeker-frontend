import React from "react";

import ImageWrapper from "@/components/image-wrapper";
import { ContentAreaLayout } from "@/components/content-area-layout";

export const FooterBottom = () => {
  return (
    <section className="relative bg-white">
      <ContentAreaLayout className="z-50 flex-col items-center justify-center pb-4 pt-4 md:justify-between lg:flex-row-reverse lg:justify-between">
        <ImageWrapper
          src={"/images/footer/payment-gateways.png"}
          className="h-[21px] w-[359px] md:h-[43px] md:w-[646px]"
          skeleton={false}
        />
        <p className="pt-2.5 text-[10px] leading-none text-grey-450 lg:flex lg:pt-0 lg:text-14">
          &copy; Copyright {new Date().getFullYear()} - Spotseeker
        </p>
      </ContentAreaLayout>
    </section>
  );
};
