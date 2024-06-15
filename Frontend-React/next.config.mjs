/** @type {import('next').NextConfig} */

const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "d1tkh0shzgk02t.cloudfront.net",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "d1tkh0shzgk02t.cloudfront.netother",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
