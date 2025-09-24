import { draftToHtml } from "@/lib/draftjs";
import { cn } from "@/lib/utils";
import React, { FC } from "react";

interface IDescription {
  text: string;
  className: string;
}
const Description: FC<IDescription> = ({ text, className }) => {
  return (
    <p
      className={cn(
        "transition-height-min-height overflow-hidden text-[12px] font-normal leading-[20.5714286px] text-grey-200 opacity-80 !duration-1000 ease-in-out md:!max-h-[5000px] md:text-[14px] md:leading-[24px]",
        className,
      )}
      dangerouslySetInnerHTML={{
        __html: draftToHtml(JSON.parse(text)),
      }}
    />
  );
};

export default Description;
