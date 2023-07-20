/** @type {import('next').NextConfig} */
const nextConfig = {
    // experimental: {
    //     serverActions: true,
    // },
    async rewrites() {
        return [
            {
                source: '/api/chart/:path*',
                destination: 'http://api.coinmarketcap.com/:path*',
            },
        ]
    },
}

module.exports = nextConfig
