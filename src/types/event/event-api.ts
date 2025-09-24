import { IAddon } from "../addon";
import { IEventPaymentGateway } from "./event";

export interface ITicketPackageDetail {
  package_id: number;
  ticket_count: number;
  package_name: string;
}

export interface IAddonDetail {
  id: number;
  sale_id: number;
  addon_id: number;
  quantity: number;
  addon: IAddon;
}
export interface ITicketAddonDetail {
  quantity: number;
  addon_id: string;
}
export interface IPaymentCreateRequest {
  event_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_no: string;
  nic: string;
  promo_code?: string;
  ticket_package_details: ITicketPackageDetail[];
  addon_details: ITicketAddonDetail[];
  paymentGateway: IEventPaymentGateway;
}

export interface IPaymentCreateResponse {
  currency: string;
  hash: string;
  order_id: string;
  total_amount: string;
}

export interface IKokoPaymentCreateRequest extends IPaymentCreateRequest {
  returnUrl: string;
  cancelUrl: string;
  responseUrl: string;
}
export interface IKokoPaymentCreateResponse {
  paymentUrl: string;
  data: Record<string, string>;
}
