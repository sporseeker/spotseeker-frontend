/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || "https://spotseeker.lk",
  generateRobotsTxt: true,
  additionalPaths: async () => {
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
    const apiResponse = await response.json();

    if (apiResponse && Array.isArray(apiResponse.data)) {
      return apiResponse.data.map((event) => ({
        loc: `/event/${event.uid}`,
        lastmod: new Date().toISOString(),
      }));
    }

    return [];
  },
};
