/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'spotseeker.s3.ap-south-1.amazonaws.com',
            },
            // {
            //     protocol: 'https',
            //     hostname: 'spotseeker-copilot-bucket.s3.ap-south-1.amazonaws.com',
            // }, 
        ],
    },
    reactStrictMode: false,
};

export default nextConfig;


