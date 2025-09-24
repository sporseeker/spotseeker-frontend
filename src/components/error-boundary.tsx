"use client";
import ErrorPage from "@/app/error/page";
import { ErrorBoundary } from "react-error-boundary";
const CustomErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  return <ErrorBoundary fallback={<ErrorPage />}>{children}</ErrorBoundary>;
};

export default CustomErrorBoundary;
