export enum EventType {
  ALL = "all",
  CONCERTS = "concerts",
  EDM = "edm",
  TAMIL_DJ = "tamil dj",
  CLUB = "club",
  HALLOWEEN = "halloween",
  ROTARACT = "rotaract",
  UPCOMING = "upcoming",
  AIR_EXPERIENCE = "air experience",
}
export enum PaymentMethod {
  CARD = "card",
  KOKO = "koko",
}

export const PAYMENT_METHOD_ID = {
  [PaymentMethod.CARD]: "70470dcb-752a-4278-a4bb-26df4f4a41e9",
  [PaymentMethod.KOKO]: "9e96e295-f26a-46e5-896d-831d6f112b06",
};
