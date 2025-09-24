import http from "@/lib/http";
import { IApiResponse } from "@/types/response";
import { UserResponseType } from "@/types/user";
import axios from "axios";

export const userLogin = async (email: string, password: string) => {
  return axios.post<IApiResponse<UserResponseType>>(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/login`,
    {
      email,
      password,
    },
  );
};

export interface IUserRegistration {
  name: string;
  email: string;
  phone_no: string;
  password: string;
  password_confirmation: string;
}
export const userRegister = async (value: IUserRegistration) => {
  return axios.post(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/register`,
    {
      ...value,
      verification_method: "mobile",
    },
    {
      withXSRFToken: true,
    },
  );
};

export const userLogout = async () => {
  return http.post("/api/auth/logout");
};
