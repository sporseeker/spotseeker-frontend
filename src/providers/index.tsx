import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/toaster";

const Providers = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();
  return (
    <>
      <SessionProvider session={session}>{children}</SessionProvider>
      <Toaster />
    </>
  );
};

export default Providers;
