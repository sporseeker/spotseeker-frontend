import React, { FC, ReactNode } from "react";
import { ContentAreaLayout } from "../content-area-layout";
import Image from "next/image";
interface IAuthWrapper {
  children: ReactNode;
}
const AuthWrapper: FC<IAuthWrapper> = ({ children }) => {
  return (
    <section className="relative min-h-screen pt-[120px]">
      <Image
        src="/images/auth/auth-banner.png"
        alt="Auth Background"
        layout="fill"
        objectFit="cover"
        quality={100}
        priority
      />
      <ContentAreaLayout className="flex justify-center">
        <div className="my-[16px] mb-[30px] flex h-full w-full max-w-[420px]">
          <div className="z-10 w-full flex-grow-0 flex-col items-start justify-start rounded-xl border border-neutral-800 bg-[#181818]/90 px-[20px] py-[28px] shadow-lg lg:p-[40px]">
            {children}
          </div>
        </div>
      </ContentAreaLayout>
    </section>
  );
};

export default AuthWrapper;
