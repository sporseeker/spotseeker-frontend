import http from "@/lib/http";

export const reSendOTP = () => http.post("/api/auth/mobile/resend");
