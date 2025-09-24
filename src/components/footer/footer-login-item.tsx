"use client";
import { toast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";

const FooterLoginItem = () => {
  const { status } = useSession();
  if (status === "authenticated") {
    return (
      <button
        onClick={() =>
          toast({
            title: "",
            description: "You are already logged into your account.",
          })
        }
      >
        Login
      </button>
    );
  }

  return <Link href="/auth/signin">Login</Link>;
};

export default FooterLoginItem;
