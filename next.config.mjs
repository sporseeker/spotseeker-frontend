/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'spotseeker.s3.ap-south-1.amazonaws.com',
            },
        ],
    },
    reactStrictMode: false,
};

export default nextConfig;
