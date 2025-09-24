import { NextResponse } from "next/server";
import crypto from "crypto";
import axios from "axios";
import { IApiResponse } from "@/types/response";
import { IKokoPaymentCreateRequest } from "@/types/event/event-api";
// import { PromoDetails } from "@/types/promo";
import { encrypt } from "@/lib/crypto-utils";
import kokoData from "@/temp/private.json";
interface ICreatePaymentResponse {
  order_id: string;
  total_amount: number;
  currency: "LKR";
}

export async function POST(req: Request) {
  try {
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
      returnUrl,
      cancelUrl,
      responseUrl,
      paymentGateway,
    }: IKokoPaymentCreateRequest = await req.json();
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
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    // Check if the API returned success status
    if (!response?.data?.status) {
      return NextResponse.json(
        {
          message:
            response?.data?.errors ||
            response?.data?.message ||
            "Error creating order",
        },
        { status: 500 },
      );
    }

    if (!response?.data?.data?.order_id) {
      throw new Error("Error creating order");
    }
    const { order_id: orderId, total_amount } = response?.data?.data;
    const api_key = process.env.KOKO_API_KEY ?? "";
    const merchantId = process.env.KOKO_MERCHANT_ID ?? "";
    const pluginName = "customapi";
    const pluginVersion = "1.0.1";
    const currency = "LKR";
    const reference = orderId;

    // Create description with ticket, addon and discount details
    let description = `Payment for event ticket booking: `;
    // Add ticket package details
    if (ticket_package_details && ticket_package_details.length > 0) {
      ticket_package_details.forEach((ticket, index) => {
        description += `ticket Id: ${ticket.package_id} x ${ticket.ticket_count} tickets`;
        if (index < ticket_package_details.length - 1) description += ", ";
      });
    }

    // Add addon details if any
    if (addon_details && addon_details.length > 0) {
      description += ` with addons: `;
      addon_details.forEach((addon, index) => {
        description += `${addon.quantity}x addon #${addon.addon_id}`;
        if (index < addon_details.length - 1) description += ", ";
      });
    }

    // Add discount info if applicable
    // if (discount > 0) {
    //   description += ` (Discount: ${discount} ${currency})`;
    // }
    // const amount = total_amount - discount;
    const amount = total_amount;
    const queryData = encrypt(
      JSON.stringify({ orderId: orderId, amount: amount }),
      api_key,
    );
    const updatedResponseUrl = new URL(responseUrl);
    updatedResponseUrl.searchParams.append("spsig", queryData);

    const dataString =
      merchantId +
      amount +
      currency +
      pluginName +
      pluginVersion +
      returnUrl +
      cancelUrl +
      orderId +
      reference +
      first_name +
      last_name +
      email +
      description +
      api_key +
      updatedResponseUrl.toString();

    // const privateKeyPem = Buffer.from(
    //   process.env.KOKO_PRIVATE_KEY ?? "",
    //   "base64",
    // ).toString("utf-8");

    // const privateKeyPem = Buffer.from(
    //   process.env.KOKO_PRIVATE_KEY ?? "",
    //   "base64",
    // ).toString("utf-8");

    const privateKeyPem = Buffer.from(
      kokoData.KOKO_PRIVATE_KEY ?? "",
      "base64",
    ).toString("utf-8");

    if (!privateKeyPem || !merchantId || !api_key) {
      return NextResponse.json(
        { message: "Missing KOKO credentials" },
        { status: 500 },
      );
    }

    let signature: string;
    try {
      const sign = crypto.createSign("RSA-SHA256");
      sign.update(dataString);
      const signatureBuffer = sign.sign(privateKeyPem);
      signature = signatureBuffer.toString("base64");
    } catch (error) {
      console.error("Signature generation error:", error);
      return NextResponse.json(
        { message: "Error generating signature" },
        { status: 500 },
      );
    }
    const koko_gateway = process.env.KOKO_GATEWAY ?? "";
    const paymentUrl = `https://${koko_gateway === "live" ? "prodapi" : "qaapi"}.paykoko.com/api/merchants/orderCreate`;
    const form = {
      _mId: merchantId,
      api_key,
      _returnUrl: returnUrl,
      _cancelUrl: cancelUrl,
      _responseUrl: updatedResponseUrl.toString(),
      _amount: amount,
      _currency: currency,
      _reference: reference,
      _orderId: orderId,
      _pluginName: pluginName,
      _pluginVersion: pluginVersion,
      _description: description,
      _firstName: first_name,
      _lastName: last_name,
      _email: email,
      _mobileNo: phone_no,
      dataString,
      signature,
    };
    return NextResponse.json(
      { paymentUrl: paymentUrl, data: form },
      { status: 200 },
    );
  } catch (error) {
    console.error("Payment creation error:", error);
    let errorMessage = "Failed to create order";

    if (axios.isAxiosError(error) && error.response?.data) {
      errorMessage =
        error.response.data.errors ||
        error.response.data.message ||
        errorMessage;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
