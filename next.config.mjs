/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "randomuser.me",
                // pathname: "/api/portraits/**", // ✅ Allow avatars
            }
        ]
    },

    experimental: {
        serverActions:{
            bodySizeLimit: "10mb", // Set the body size limit for server actions
        },
        staleTimes:{
            dynamic:30,
        }
    },

    serverExternalPackages: ['pdfkit', 'exceljs'],
};

export default nextConfig;
