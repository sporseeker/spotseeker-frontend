import React, { FC } from "react";
import { Button } from "../ui/button";
import { signIn } from "next-auth/react";
import Image from "next/image";

interface ISocialLogin {
  event?: string | null;
  register?: boolean;
}
export const SocialLogin: FC<ISocialLogin> = ({ event, register = false }) => {
  return (
    <>
      <Button
        variant="outline"
        className="flex flex-1 items-center justify-center gap-2 !bg-white !py-[22px] text-[#363636] hover:opacity-75"
        onClick={() =>
          signIn("google", {
            redirectTo:
              (event ? `/event/${event}` : "/") +
              `${register ? "?getting-started=true" : ""}`,
          })
        }
      >
        <div className="relative h-5 w-5">
          <Image
            src="/icons/IconGoogle.svg"
            alt="Google icon"
            width={20}
            height={20}
          />
        </div>
        <span>Google</span>
      </Button>
      <Button
        variant="outline"
        className="flex flex-1 items-center justify-center gap-2 !bg-white !py-[22px] text-[#363636] hover:opacity-75"
        disabled={
          process.env.NEXT_PUBLIC_FACEBOOK_LOGIN &&
          process.env.NEXT_PUBLIC_FACEBOOK_LOGIN === "true"
            ? false
            : true
        }
        onClick={() =>
          signIn("facebook", {
            redirectTo:
              (event ? `/event/${event}` : "/") +
              `${register ? "?getting-started=true" : ""}`,
          })
        }
      >
        <div className="relative h-5 w-5">
          <Image
            src="/icons/IconFacebook.svg"
            alt="Facebook icon"
            width={20}
            height={20}
          />
        </div>
        <span>Facebook</span>
      </Button>
    </>
  );
};

export default SocialLogin;
