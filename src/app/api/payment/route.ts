import { NextResponse } from "next/server";
import crypto from "crypto";
import { IPaymentCreateRequest } from "@/types/event/event-api";
import axios, { AxiosError } from "axios";
import { IApiResponse } from "@/types/response";
// import { PromoDetails } from "@/types/promo";
// import { auth } from "@/auth";
// import { Session } from "next-auth";
interface ICreatePaymentResponse {
  order_id: string;
  total_amount: number;
  currency: "LKR";
}
export async function POST(request: Request) {
  try {
    // const session: Session | null = await auth();
    const {
      event_id,
      first_name,
      last_name,
      email,
      phone_no,
      ticket_package_details,
      addon_details,
      nic,
      promo_code,
      paymentGateway,
    }: IPaymentCreateRequest = await request.json();

    const merchantId = process.env.NEXT_PUBLIC_PAYHERE_MERCHANT_ID ?? "";
    const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET ?? "";
    // let discount = 0;

    // if (promo_code && ticket_package_details[0]) {
    //   const data = await axios.post<IApiResponse<PromoDetails>>(
    //     `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/promotions/check`,
    //     {
    //       promo_code: promo_code,
    //       ticket_package_details: [ticket_package_details[0]],
    //       email,
    //       event_id,
    //     },
    //     {
    //       withXSRFToken: true,
    //     },
    //   );
    //   if (data.data.data) {
    //     discount = data.data.data.disc_amt;
    //   }
    // }

    const response = await axios.post<IApiResponse<ICreatePaymentResponse>>(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/bookings`,
      {
        event_id,
        first_name,
        last_name,
        email,
        phone_no,
        nic,
        ticket_package_details,
        addons: addon_details,
        payment_provider: paymentGateway.id,
        promo_code,
      },
      {
        withXSRFToken: true,
      },
      // {
      //   headers: {
      //     Authorization: `Bearer ${session.user.token}`,
      //   },
      // },
    );

    if (!response?.data?.data?.order_id) {
      throw new Error("Error creating payment");
    }

    const orderData = response?.data?.data;
    // const amountFormatted = (orderData.total_amount - discount)
    const amountFormatted = orderData.total_amount
      .toLocaleString("en-us", { minimumFractionDigits: 2 })
      .replaceAll(",", "");
    const hash = crypto
      .createHash("md5")
      .update(
        merchantId +
          orderData.order_id +
          amountFormatted +
          orderData.currency +
          crypto
            .createHash("md5")
            .update(merchantSecret)
            .digest("hex")
            .toUpperCase(),
      )
      .digest("hex")
      .toUpperCase();

    const paymentData = {
      order_id: orderData.order_id,
      hash,
      currency: orderData.currency,
      total_amount: orderData.total_amount.toString(),
      // total_amount: (orderData.total_amount - discount).toString(),
    };

    return NextResponse.json(paymentData);
  } catch (error: unknown) {
    const errorMsg = (error as AxiosError<IApiResponse>)?.response?.data;
    const defaultError = errorMsg?.message
      ? errorMsg.message
      : "Error occurred";

    return NextResponse.json(
      { error: errorMsg ? errorMsg.errors : defaultError },
      { status: 500 },
    );
  }
}
