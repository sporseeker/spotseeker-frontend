// interface IEventPackage {
//   id: number;
//   sale_id: number;
//   package_id: number;
//   ticket_count: number;
//   seat_nos: string;
//   promo_id: number;
// }

// interface Addon {
//   [key: string]: any;
// }

export interface IBookingDetails {
  id: number;
  order_id: string;
  payment_ref_no: string;
  cust_name: string;
  cust_email: string;
  cust_phone: string;
  cust_nic: string;
  event_name: string;
  event_id: number;
  event_venue: string;
  event_thumb_img: string;
  // packages: EventPackage[];
  tot_amount: number;
  tot_tickets: number;
  date: string;
  status: string;
  book_status: string;
  ticket_url: string;
  //   addons: Addon[];
}
