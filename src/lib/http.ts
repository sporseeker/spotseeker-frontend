import { auth } from "@/auth";
import axios, { AxiosResponse, AxiosError } from "axios";
import { Session } from "next-auth";
import { getSession, signOut } from "next-auth/react";

axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;

const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  withCredentials: true,
  withXSRFToken: true,
});

let cachedToken: string | null = null;
let tokenFetchPromise: Promise<string> | null = null;

const getToken = async (): Promise<string> => {
  if (cachedToken) return cachedToken;

  if (!tokenFetchPromise) {
    tokenFetchPromise = getSession().then((session) => {
      const token = (session as Session)?.user?.token || "";
      cachedToken = token;
      tokenFetchPromise = null;
      return token;
    });
  }

  return tokenFetchPromise;
};

http.interceptors.request.use(
  async (config) => {
    try {
      let token = "";

      if (typeof window === "undefined") {
        const userSession = await auth();
        token = userSession?.user?.token ?? "";
      } else {
        token = (await getToken()) ?? "";
      }

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Error retrieving token:", error);
      throw new Error("Error retrieving token");
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

http.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    if (error.response && error.response.status === 401) {
      cachedToken = null;
      await signOut({ redirectTo: "/auth/signin" });
    }
    return Promise.reject(error);
  },
);

export default http;
