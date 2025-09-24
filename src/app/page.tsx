import HomeBanner from "@/components/home/banner/banner";
import ContentSection from "@/components/home/content/content";

export const revalidate = 10;

export default async function Home() {
  const initialEvents = await fetchEvents();
  return (
    <>
      <HomeBanner />
      <ContentSection initialEvents={initialEvents} />
    </>
  );
}
async function fetchEvents() {
  const statusParams = ["soldout", "closed", "postponed", "ongoing", "pending"];
  const params =
    statusParams.length > 0
      ? `?${statusParams.map((status) => `status[]=${status}`).join("&")}`
      : "";
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/events${params}`,
    {
      next: { revalidate: 10 },
    },
  );
  return response.json();
}
