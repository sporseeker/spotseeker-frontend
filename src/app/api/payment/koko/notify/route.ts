// app/api/notify/route.ts
import { decrypt } from "@/lib/crypto-utils";
import { NextResponse } from "next/server";
import crypto from "crypto";
import axios from "axios";
import kokoData from "@/temp/private.json";
interface IKokoPaymentQueryParam {
  orderId: string;
  amount: number;
}
export async function POST(request: Request) {
  try {
    const url = new URL(request.url);

    const spsig = decodeURIComponent(url.searchParams.get("spsig") || "");

    const formData = await request.text();
    const params = new URLSearchParams(formData);
    const orderId = params.get("orderId");
    const signature = params.get("signature");
    const status = params.get("status");
    const trnId = params.get("trnId");

    if (!orderId || !signature || !status || !trnId) {
      throw new Error("Missing required parameters");
    }

    const api_key = process.env.KOKO_API_KEY ?? "";

    const kokoPublicKeyPem = Buffer.from(
      kokoData.KOKO_PUBLIC_KEY ?? "",
      "base64",
    ).toString("utf-8");
    // const kokoPublicKeyPem = Buffer.from(
    //   process.env.KOKO_PUBLIC_KEY ?? "",
    //   "base64",
    // ).toString("utf-8");
    const data = JSON.parse(
      decrypt(spsig ?? "", api_key),
    ) as IKokoPaymentQueryParam;
    const dataString = orderId + trnId + status;
    const verifier = crypto.createVerify("RSA-SHA256");
    verifier.update(dataString, "utf8");
    verifier.end();
    const isValid = verifier.verify(kokoPublicKeyPem, signature, "base64");

    if (!isValid) {
      throw new Error("Invalid signature");
    }

    await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/bookings/update`,
      {
        temp_order_id: orderId,
        transaction_ref: trnId,
        requested_amount: data.amount,
        transaction_amount: data.amount,
        status_code: status === "SUCCESS" ? "0" : "-1",
      },
      {
        withXSRFToken: true,
      },
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing payment notification:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
