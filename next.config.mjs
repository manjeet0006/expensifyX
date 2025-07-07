/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "randomuser.me",
                // pathname: "/**" // ✅ REQUIRED: without this, images won't load
            }
        ]
    },

    experimental: {
        serverActions:{
            bodySizeLimit: "10mb", // Set the body size limit for server actions
        }
    },

};

export default nextConfig;
