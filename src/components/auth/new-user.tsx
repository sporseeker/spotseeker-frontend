"use client";
import { useToast } from "@/contexts/ToastContext";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const NewUser = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { showToast } = useToast();
  useEffect(() => {
    const val = searchParams?.get("getting-started");
    if (!!val && pathname !== "/auth/verify") {
      showToast(
        "Welcome Aboard!",
        "Let's connect you to the events of your dreams.",
        () => {
          const currentUrl = new URL(window.location.href);
          currentUrl.searchParams.delete("getting-started");
          router.replace(currentUrl.pathname + currentUrl.search);
        },
      );
    }
  }, [searchParams, pathname]);
  return <></>;
};

export default NewUser;
