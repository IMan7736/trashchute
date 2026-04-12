/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/bored/:path*',
        destination: 'https://bored-api.appbrewery.com/:path*',
      },
    ];
  },
};

export default nextConfig;