import { EventType } from "@/enum/event";
import { IAddon } from "../addon";

export interface IEvent {
  id: number;
  uid: string;
  name: string;
  description: string;
  type: EventType;
  sub_type: string;
  organizer: string;
  manager: IManager;
  start_date: string;
  end_date: string;
  status: string;
  thumbnail_img: string;
  banner_img: string;
  featured: boolean;
  event_facebook: string;
  event_instagram: string;
  event_location: string;
  venue: IVenue;
  message: string | null;
  free_seating: boolean;
  handling_cost: number;
  handling_cost_perc: boolean;
  currency: string;
  promo: boolean;
  ticket_packages: ITicketPackage[];
  trailer_url: string;
  addons: IAddon[];
  payment_gateways: IEventPaymentGateway[];
  addons_feature: 0 | 1;
  analytics: IEventAnalytics;
}
export interface IEventBlock {
  key: string;
  text: string;
  type: string;
  depth: number;
  inlineStyleRanges: IInlineStyleRange[];
  entityRanges: IEntityRange[];
  data: Record<string, unknown>;
}

export interface IInlineStyleRange {
  offset: number;
  length: number;
  style: string;
}

export interface IEntityRange {
  offset: number;
  length: number;
  key: number;
}

export interface IManager {
  name: string;
}

export interface IVenue {
  id: number;
  name: string;
  desc: string;
  seating_capacity: number;
  seat_map: string;
  location_url: string;
}

export interface ITicketPackage {
  id: number;
  name: string;
  price: string;
  desc: string;
  sold_out: boolean;
  active: boolean;
  seating_range: string[];
  reserved_seats: string[];
  available_seats: string[];
  free_seating: boolean;
  promo: boolean;
  promo_code?: string;
  status: string;
  promo_auto_apply?: boolean;
  max_tickets_can_buy: number;
}

export interface ICommonEventState {
  id: number;
  count: number;
  name: string;
  price: string;
}
export interface IEventPaymentGateway {
  id: string;
  name: string;
  logo: string;
  commission_rate: number;
  apply_handling_fee: boolean;
  active: boolean;
}

export interface IEventAnalytics {
  facebook?: string;
  google?: string;
}
