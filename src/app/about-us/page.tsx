import { ContentAreaLayout } from "@/components/content-area-layout";
import ImageWrapper from "@/components/image-wrapper";
import React from "react";
const AboutUsPage = () => {
  return (
    <section className="mt-[110px] lg:mt-[136px]">
      <div className="relative h-[250px] w-full md:h-[350px] lg:h-[450px] xl:h-[600px]">
        <ImageWrapper
          src="/images/about-us/about-us.jpeg"
          className="absolute left-1/2 top-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 transform"
          imageElementClassName="object-cover"
          skeleton={false}
        />
        <span className="absolute left-0 top-0 h-full w-full bg-black/[80%]"></span>
        <p className="absolute left-1/2 top-1/2 w-full max-w-[650px] -translate-x-1/2 -translate-y-1/2 transform px-5 text-center text-28 font-semibold leading-[40px] text-grey-100 md:px-3 lg:max-w-[940px] lg:text-[48px] lg:leading-[60px]">
          Sri Lanka&apos;s most modern & advanced event ticket booking platform
        </p>
      </div>
      <ContentAreaLayout className="relative z-50 flex justify-center lg:mt-[-30px]">
        <div className="mb-[65px] mt-[20px] max-w-[800px] rounded-[12px] border border-white/[12%] bg-[linear-gradient(111deg,_#192145_12%,_#200e16_100%)] px-[20px] py-[40px] lg:mb-[200px] lg:mt-0 lg:px-[32px] lg:py-[60px]">
          <div className="mb-[45px] flex justify-center lg:mb-[48px]">
            <ImageWrapper
              src="/images/about-us/profile.jpeg"
              className="h-[140px] w-[140px] rounded-full border border-grey-550 lg:h-[200px] lg:w-[200px]"
              imageElementClassName="object-cover"
              skeleton={false}
            />
          </div>
          <div className="space-y-[20px] [&>p]:text-center [&>p]:text-14 [&>p]:leading-[1.71] [&>p]:text-grey-200 [&>p]:lg:text-16 [&>p]:lg:leading-[1.75]">
            <p>
              Spotseeker.lk is Sri Lanka&apos;s most modern and advanced event
              ticket booking platform, offering access to music, sports, art,
              theatre, and more.
            </p>
            <p>
              Founded by a visionary 19-year-old entrepreneur, Spotseeker.lk has
              transformed from a late-night idea into a robust e-commerce
              platform dedicated to enhancing your live event experiences.
            </p>
            <p>
              Booking tickets has never been easier. Our intuitive interface
              ensures a seamless journey from browsing to booking, putting your
              favorite events just a few clicks away.
            </p>
            <p>
              The progress has been overwhelming, yet we believe there is so
              much more to grow.
            </p>
          </div>
        </div>
      </ContentAreaLayout>
    </section>
  );
};

export default AboutUsPage;
