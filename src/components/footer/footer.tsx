import React from "react";
import Link from "next/link";

import ImageWrapper from "@/components/image-wrapper";
import { Separator } from "@/components/ui/separator";
import { FooterBottom } from "./footer-bottom";
import { ContentAreaLayout } from "@/components/content-area-layout";
import Subscription from "./subscription";
import FooterLoginItem from "./footer-login-item";

const Footer = () => {
  return (
    <div id="footer-all">
      <footer className="footer bg-grey-650 pb-[50px] pt-[36px] lg:pb-[90px] lg:pt-[60px] xl:pb-[120px]">
        <ContentAreaLayout>
          <div className="grid w-full grid-cols-1 lg:grid-cols-[435px_1fr_380px]">
            <div className="mb-[60px] max-w-[430px] lg:col-start-1 lg:col-end-3 lg:row-start-1 lg:row-end-2 lg:mb-0">
              <Link href="/">
                <ImageWrapper
                  src={"/images/footer/logo.png"}
                  className="mb-[20px] h-[68px] w-[147px] lg:h-[100px] lg:w-[216px]"
                  skeleton={false}
                />
              </Link>
              <p className="text-14 leading-1-43 text-grey-350 lg:text-16 lg:leading-1-63">
                Sri Lanka&apos;s most modern and advanced event ticket booking
                platform, offering access to music, sports, art, theatre, and
                more.
              </p>
            </div>

            <div className="mb-[60px] lg:col-start-3 lg:col-end-4 lg:row-start-3 lg:row-end-4 lg:mb-0">
              <p className="mb-[8px] text-14 text-grey-250 lg:text-16">
                Subscribe for announcements!
              </p>
              <Subscription />
            </div>
            <div className="mb-[40px] flex flex-row lg:col-start-3 lg:col-end-4 lg:row-start-1 lg:row-end-2 lg:mb-0 lg:justify-between">
              <div className="basis-[50%] lg:basis-auto">
                <p className="mb-[16px] text-14 text-grey-250 lg:mb-[24px] lg:text-16">
                  Account
                </p>
                <ul className="flex flex-col gap-y-[16px] text-14 text-grey-400 lg:gap-y-[24px] lg:text-16">
                  <li className="cursor-pointer hover:opacity-75">
                    <Link href={"/my-account"}>My Bookings</Link>
                  </li>
                  <li className="cursor-pointer hover:opacity-75">
                    <Link href={"/my-account?tab=profile"}>Profile</Link>
                  </li>
                  <li className="cursor-pointer hover:opacity-75">
                    <FooterLoginItem />
                  </li>
                </ul>
              </div>
              <div className="basis-[50%] lg:basis-auto">
                <p className="mb-[16px] text-14 text-grey-250 lg:mb-[24px] lg:text-16">
                  Customer care
                </p>
                <ul className="flex flex-col gap-y-[16px] text-14 text-grey-400 lg:gap-y-[24px] lg:text-16">
                  <li className="cursor-pointer hover:opacity-75">
                    <Link href={"/about-us  "}>About Us</Link>
                  </li>
                  <li className="cursor-pointer hover:opacity-75">
                    <Link href={"/privacy"}>Privacy Policy</Link>
                  </li>
                  <li className="cursor-pointer hover:opacity-75">
                    <Link href={"/terms"}>Terms & Conditions</Link>
                  </li>
                </ul>
              </div>
            </div>
            <Separator className="mb-[32px] !h-[1px] w-full !bg-white opacity-10 lg:col-start-1 lg:col-end-4 lg:row-start-2 lg:row-end-3 lg:my-[40px]"></Separator>
            <div className="mb-[32px] lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4 lg:mb-0">
              <p className="mb-[12px] text-14 text-grey-250 lg:mb-[8px] lg:text-16">
                Contact us
              </p>
              <div className="flex flex-col gap-y-[16px] lg:flex-row lg:gap-x-[40px]">
                <div className="flex items-center gap-x-[8px]">
                  <ImageWrapper
                    src={"/images/footer/call.svg"}
                    className="h-[26px] w-[26px] lg:h-[32px] lg:w-[32px]"
                    skeleton={false}
                  />
                  <Link href="tel:+94761133880">
                    <p className="text-14 leading-none text-grey-150 hover:opacity-75 lg:text-16">
                      +94 76 11 33 880
                    </p>
                  </Link>
                </div>
                <div className="flex items-center gap-x-[8px]">
                  <ImageWrapper
                    src={"/images/footer/email.svg"}
                    className="h-[26px] w-[26px] lg:h-[32px] lg:w-[32px]"
                    skeleton={false}
                  />
                  <Link href="mailto:spotseeker.lk@gmail.com">
                    <p className="text-14 leading-none text-grey-150 hover:opacity-75 lg:text-16">
                      spotseeker.lk@gmail.com
                    </p>
                  </Link>
                </div>
              </div>
            </div>
            <div className="lg:col-start-1 lg:col-end-4 lg:row-start-4 lg:row-end-5 lg:mt-[30px] lg:flex lg:justify-center xl:col-start-2 xl:col-end-3 xl:row-start-3 xl:row-end-4 xl:mt-0">
              <div>
                <p className="mb-[12px] text-14 text-grey-250 lg:mb-[8px] lg:text-16">
                  Stay updated
                </p>
                <div className="flex gap-x-[12px]">
                  <Link href="https://www.facebook.com/profile.php?id=61563284987218&mibextid=LQQJ4d">
                    <div className="flex h-[36px] w-[36px] items-center justify-center rounded-full bg-white hover:opacity-75">
                      <ImageWrapper
                        src={"/images/footer/fb.svg"}
                        className="h-[20px] w-[20px]"
                        skeleton={false}
                      />
                    </div>
                  </Link>
                  <Link href="https://www.instagram.com/spotseeker.lk?igsh=MW44anVmbzFpYW5jdA==">
                    <div className="flex h-[36px] w-[36px] items-center justify-center rounded-full bg-white hover:opacity-75">
                      <ImageWrapper
                        src={"/images/footer/insta.svg"}
                        className="h-[20px] w-[20px]"
                        skeleton={false}
                      />
                    </div>
                  </Link>
                  <Link href="https://www.tiktok.com/@spotseeker.lk?_t=8r5rizCE1zE&_r=1">
                    <div className="flex h-[36px] w-[36px] items-center justify-center rounded-full bg-white hover:opacity-75">
                      <ImageWrapper
                        src={"/images/footer/tiktok.svg"}
                        className="h-[20px] w-[20px]"
                        skeleton={false}
                      />
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </ContentAreaLayout>
      </footer>
      <FooterBottom />
    </div>
  );
};

export default Footer;
