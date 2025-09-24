import { auth } from "@/auth";
import { IApiResponse } from "@/types/response";
import axios, { AxiosError } from "axios";
import { Session } from "next-auth";
import { NextResponse } from "next/server";
enum SubscribeType {
  ALL = "all",
  EVENT = "event",
}
interface ISubscribeRequest {
  phone_no?: string;
  event_id?: string;
  type: SubscribeType;
}
export async function POST(request: Request) {
  try {
    const { phone_no, event_id, type }: ISubscribeRequest =
      await request.json();
    if (type === SubscribeType.EVENT) {
      if (!event_id) {
        throw new Error("Event Id is required");
      }
      const session: Session | null = await auth();
      if (!session || (session && !session.user)) {
        throw new Error("User must login");
      }
      if (session && session.user && session.user.phone_no) {
        await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/subscribe`,
          {
            mobile_no: session.user.phone_no,
            event_id,
            type,
          },
          {
            withXSRFToken: true,
            headers: {
              Authorization: `Bearer ${session.user.token}`,
            },
          },
        );
        return NextResponse.json({ status: "OK" });
      } else {
        throw new Error("Profile must have phone number");
      }
    } else {
      if (!phone_no) {
        throw new Error("Phone no is required");
      }
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/subscribe`,
        {
          mobile_no: phone_no,
          type,
        },
        {
          withXSRFToken: true,
        },
      );
      return NextResponse.json({ status: "OK" });
    }
  } catch (error: unknown) {
    return NextResponse.json(
      {
        message: (error as AxiosError<IApiResponse>)?.response?.data.message
          ? (error as AxiosError<IApiResponse>)?.response?.data.message
          : (error as Error).message,
      },
      { status: 500 },
    );
  }
}
