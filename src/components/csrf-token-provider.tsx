"use client";
import axios from "axios";
import React, { useEffect } from "react";

const CSRFToken = () => {
  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/sanctum/csrf-cookie`,
        );
      } catch (err) {
        console.error("Error fetching CSRF token:", err);
      }
    };
    fetchCsrfToken();
  }, []);
  return <></>;
};

export default CSRFToken;
