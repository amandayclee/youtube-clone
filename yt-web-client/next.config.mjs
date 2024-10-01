/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'storage.googleapis.com',
          port: '',
          pathname: '/ycleee-yt-thumbnails/**',
        },
      ],
    },
  };
  
  export default nextConfig;
  