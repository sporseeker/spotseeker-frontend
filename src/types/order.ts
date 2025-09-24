import { IEvent } from "./event/event";
import { IAddonDetail, ITicketPackageDetail } from "./event/event-api";
export enum BookingStatus {
  PENDING = "pending",
  COMPLETE = "complete",
  CANCELLED = "cancelled",
}
export interface OrderResponse {
  user: User;
  orders: Order[];
  totalAmount: number;
  rewards: number;
  attendedEvents: number;
  e_ticket_url: string;
}

export interface User {
  name: string;
  email: string;
  joinedAt: string;
  updatedAt: string;
  phoneNo: string;
  nic: string;
}

export interface Order {
  id: number;
  booking_date: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  user_id: number;
  event_id: number;
  tot_amount: number;
  payment_status: "pending" | "complete" | "cancelled";
  payment_ref_no: string | null;
  order_id: string;
  transaction_date_time: string;
  comment: string | null;
  tot_ticket_count: number;
  booking_status: "pending" | "complete" | "cancelled";
  e_ticket_url: string | null;
  tot_verified_ticket_count: number;
  verified_by: string | null;
  verified_at: string | null;
  rewards: number;
  event: IEvent;
  packages: ITicketPackageDetail[];
  addons: IAddonDetail[];
}
