import SingleEvent from "@/components/event/single-event";
import { IEvent } from "@/types/event/event";
import { IApiResponse } from "@/types/response";

export const revalidate = 5;
export const dynamicParams = true;

async function fetchEvent(id: string): Promise<IEvent | null> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/event/${id}`,
  );
  const apiResponse: IApiResponse<IEvent> | null = await response.json();
  return apiResponse?.data ?? null;
}

interface EventPageProps {
  params: { id: string };
}

export default async function EventPage({ params }: EventPageProps) {
  const event = await fetchEvent(params.id);

  if (!event) {
    return <div>Event not found</div>;
  }
  return <SingleEvent eventData={event} />;
}

export async function generateStaticParams() {
  const statusParams = process.env.NEXT_PUBLIC_STATUS_TYPES?.split(",") || [
    "soldout",
    "closed",
    "postponed",
    "ongoing",
  ];
  const params =
    statusParams.length > 0
      ? `?${statusParams.map((status) => `status[]=${status}`).join("&")}`
      : "";
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/events${params}`,
  );

  const apiResponse: IApiResponse<IEvent> | null = await response.json();
  if (apiResponse && Array.isArray(apiResponse.data)) {
    return apiResponse.data.map((event) => ({ id: event.uid }));
  }
  return [];
}
