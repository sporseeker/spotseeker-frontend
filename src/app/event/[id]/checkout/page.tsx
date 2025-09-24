import Checkout from "@/components/checkout/checkout";
import React, { FC } from "react";
interface CheckoutPageProps {
  params: { id: string };
}
const CheckoutPage: FC<CheckoutPageProps> = ({ params }) => {
  return <Checkout eventId={params.id} />;
};

export default CheckoutPage;
