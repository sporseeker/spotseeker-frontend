import type { Metadata, Viewport } from "next";
import { Onest } from "next/font/google";
import "./globals.css";
import MainLayout from "@/components/layout";
import { cn } from "@/lib/utils";
import { ToastProvider } from "@/contexts/ToastContext";
import { SWRProvider } from "./swr-provider";
import StoreProvider from "./store-provider";
import Providers from "@/providers";
import CustomErrorBoundary from "@/components/error-boundary";
import CSRFToken from "@/components/csrf-token-provider";
import Script from "next/script";

const onest = Onest({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "spotseeker.lk - Sri Lanka's Top Event Ticketing Platform",
  description:
    "Sri Lanka's most modern and advanced event ticket booking platform, offering access to music, sports, art, theatre, and more.",
  openGraph: {
    type: "website",
    url: "https://www.spotseeker.lk/",
    title: "spotseeker.lk - Sri Lanka's Top Event Ticketing Platform",
    description:
      "Sri Lanka's most modern and advanced event ticket booking platform, offering access to music, sports, art, theatre, and more.",
    images: [
      {
        url: "https://spotseeker.s3.ap-south-1.amazonaws.com/public/logo-dark.jpg",
        width: 800,
        height: 600,
        alt: "Spotseeker.lk Logo",
      },
    ],
    locale: "en_US",
    siteName: "Spotseeker.lk",
  },
  twitter: {
    card: "summary_large_image",
    site: "https://www.spotseeker.lk/",
    title: "spotseeker.lk - Sri Lanka's Top Event Ticketing Platform",
    description:
      "Sri Lanka's most modern and advanced event ticket booking platform, offering access to music, sports, art, theatre, and more.",
    images: [
      {
        url: "https://spotseeker.s3.ap-south-1.amazonaws.com/public/logo-dark.jpg",
      },
    ],
  },

  robots: {
    index: process.env.NEXT_PUBLIC_ROBOT_INDEX === "true",
    follow: process.env.NEXT_PUBLIC_ROBOT_INDEX === "true",
  },
  keywords: [
    "Sri Lankan concerts",
    "live music",
    "ticket booking",
    "events",
    "Spotseeker.lk",
    "concerts in Sri Lanka",
  ],
};
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const GOOGLE_ANALYTICS_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS || "";

  return (
    <html lang="en" className="overflow-x-hidden">
      <head>
        {/* Google Analytics */}
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_ID}`}
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GOOGLE_ANALYTICS_ID}', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />

        {/* Facebook Pixel */}
        <Script
          id="metapixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
                            !function(f,b,e,v,n,t,s){
                                if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                                n.queue=[];t=b.createElement(e);t.async=!0;
                                t.src=v;s=b.getElementsByTagName(e)[0];
                                s.parentNode.insertBefore(t,s)}(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');`,
          }}
        />
      </head>
      <body
        className={cn(
          `body relative mx-auto min-h-screen overflow-x-hidden bg-black antialiased`,
          onest.className,
        )}
      >

        {/* Google Tag Manager (noscript) */}
                    <noscript>
                        <iframe
                            src={`https://www.googletagmanager.com/ns.html?id=${GOOGLE_ANALYTICS_ID}`}
                            height="0"
                            width="0"
                            style={{ display: "none", visibility: "hidden" }}
                        ></iframe>
                    </noscript>

                    {/* FB Pixel (noscript) */}
                    <noscript>
                        <iframe
                            src="https://www.facebook.com/tr?id=1216689519703670&ev=PageView&noscript=1"
                            height="0"
                            width="0"
                            style={{ display: "none", visibility: "hidden" }}
                        ></iframe>
                    </noscript>
        <Providers>
          <ToastProvider>
            <SWRProvider>
              <StoreProvider>
                <CustomErrorBoundary>
                  <MainLayout>{children}</MainLayout>
                  <CSRFToken />
                </CustomErrorBoundary>
              </StoreProvider>
            </SWRProvider>
          </ToastProvider>
        </Providers>
      </body>
    </html>
  );
}
