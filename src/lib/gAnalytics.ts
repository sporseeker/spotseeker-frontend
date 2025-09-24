declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export const GOOGLE_ANALYTICS_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;

const safeGtag = (type: string, eventName: string, options: object = {}) => {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag(type, eventName, options);
  } else {
    console.warn("gtag is not defined yet");
  }
};

export const gaInit = (name: string, options = {}) => {
  safeGtag("config", name, options);
};

export const gaEvent = (name: string, options = {}) => {
  safeGtag("event", name, options);
};
