export type PromoDetails = {
  package_id: number;
  promo_code: string;
  promo_id: number;
  total_amt: number;
  disc_amt: number;
  total_due: number;
};

export type PromoError = {
  promoCode: string;
};
