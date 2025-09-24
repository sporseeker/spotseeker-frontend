import { CheckoutFailure } from "@/components/checkout/checkout-failure";
import { CheckoutSuccess } from "@/components/checkout/checkout-success";
import { PaymentResponseType } from "@/enum/payment";
import { IEvent } from "@/types/event/event";
import { IApiResponse } from "@/types/response";

export const revalidate = 60;
export const dynamicParams = true;

async function fetchEvent(id: string): Promise<IEvent | null> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/event/${id}`,
    {
      next: { revalidate: 60 },
    },
  );
  const apiResponse: IApiResponse<IEvent> | null = await response.json();
  return apiResponse?.data ?? null;
}

interface CheckoutResponsePageProps {
  params: { id: string; type: PaymentResponseType };
  searchParams: { order_id?: string; orderId?: string; status?: string };
}

function isPaymentSuccessful(
  type: PaymentResponseType,
  status?: string,
): boolean {
  return (
    type === PaymentResponseType.SUCCESS ||
    (type === PaymentResponseType.KOKO_SUCCESS && status === "SUCCESS")
  );
}

export default async function CheckoutResponsePage({
  params,
  searchParams,
}: CheckoutResponsePageProps) {
  const event = await fetchEvent(params.id);

  if (!event) {
    return <div>Event not found</div>;
  }

  return isPaymentSuccessful(params?.type, searchParams?.status) ? (
    <CheckoutSuccess
      event={event}
      orderId={searchParams.order_id || searchParams.orderId || ""}
    />
  ) : (
    <CheckoutFailure event={event} />
  );
}
