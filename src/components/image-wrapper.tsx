"use client";
import React, { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export interface IImageWrapper {
  className?: string;
  imageElementClassName?: string;
  skeletonElementClassName?: string;
  skeleton?: boolean;
  src: string;
  alt?: string;
}
const ImageWrapper: React.FC<IImageWrapper> = ({
  className,
  src,
  alt = "",
  imageElementClassName,
  skeletonElementClassName,
  skeleton = true,
}) => {
  const [isImageLoading, setImageLoading] = useState(true);
  return (
    <figure className={cn("relative overflow-hidden", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes="100%"
        className={cn("h-full w-full object-contain", imageElementClassName)}
        onLoad={() => setImageLoading(false)}
      />
      {isImageLoading && skeleton && (
        <Skeleton className={cn("h-full w-full", skeletonElementClassName)} />
      )}
    </figure>
  );
};

export default ImageWrapper;
