"use client";
import React, { createContext, useState, useContext, ReactNode } from "react";
import { CustomToast } from "@/components/CustomToast";

interface ToastContextType {
  showToast: (title: string, description: string, onClose?: () => void) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [toast, setToast] = useState<{
    title: string;
    description: string;
    onClose?: () => void;
  } | null>(null);

  const showToast = (
    title: string,
    description: string,
    onClose?: () => void,
  ) => {
    setToast({ title, description, onClose });
  };

  const handleCloseToast = () => {
    const close = toast?.onClose;
    setToast(null);
    if (close) {
      close();
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <CustomToast
          title={toast.title}
          description={toast.description}
          onClose={handleCloseToast}
        />
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
