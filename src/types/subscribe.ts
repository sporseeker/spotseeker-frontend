export enum SubscribeType {
  ALL = "all",
  EVENT = "event",
}
export interface ISubscribeRequest {
  phone_no?: string;
  event_id?: string;
  type: SubscribeType;
}
