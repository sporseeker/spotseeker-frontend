// app/api/notify/route.ts
import { NextResponse } from "next/server";
import crypto from "crypto";
import axios from "axios";

interface PaymentNotification {
  merchant_id: string;
  order_id: string;
  payment_id: string;
  payhere_amount: string;
  payhere_currency: string;
  status_code: string;
  md5sig: string;
  custom_1?: string;
  custom_2?: string;
  method?: string;
  status_message?: string;
  card_holder_name?: string;
  card_no?: string;
  card_expiry?: string;
}

export async function POST(request: Request) {
  try {
    const textData = await request.text();
    const params = new URLSearchParams(textData);
    const notification: PaymentNotification = Object.fromEntries(
      params.entries(),
    ) as unknown as PaymentNotification;

    const {
      merchant_id,
      order_id,
      payhere_amount,
      payhere_currency,
      status_code,
      md5sig,
      payment_id,
    } = notification;

    const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET!;

    const localMd5Sig = crypto
      .createHash("md5")
      .update(
        `${merchant_id}${order_id}${payhere_amount}${payhere_currency}${status_code}${crypto
          .createHash("md5")
          .update(merchantSecret)
          .digest("hex")
          .toUpperCase()}`,
      )
      .digest("hex")
      .toUpperCase();

    if (md5sig !== localMd5Sig) {
      console.error("Invalid signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }
    if (status_code === "2") {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/bookings/update`,
        {
          temp_order_id: order_id,
          transaction_ref: payment_id,
          requested_amount: payhere_amount,
          transaction_amount: payhere_amount,
          status_code: "0",
        },
        {
          withXSRFToken: true,
        },
      );
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false });
  } catch (error) {
    console.error("Error processing payment notification:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
