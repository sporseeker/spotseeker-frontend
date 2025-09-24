declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;

const safeFbPixel = (type: string, eventName: string, options: Record<string, unknown> = {}) => {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq(type, eventName, options);
  } else {
    console.warn("fbq is not defined yet");
  }
};

export const fbPixelInit = (pixelId: string, options: Record<string, unknown> = {}) => {
  safeFbPixel("init", pixelId, options);
};

export const fbPixelEvent = (name: string, options: Record<string, unknown> = {}) => {
  safeFbPixel("track", name, options);
};
