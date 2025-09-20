
import type {NextConfig} from 'next';
import withPWA from 'next-pwa';

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'p16-sign-sg.tiktokcdn.com',
        port: '',
        pathname: '/**',
      },
       {
        protocol: 'https',
        hostname: 'p19-sign.tiktokcdn-us.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'p16-sign.tiktokcdn-us.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'p16-sign-va.tiktokcdn.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
        port: '',
        pathname: '/**',
      }
    ],
  },
  serverExternalPackages: ['firebase-admin'],
};

export default withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development'
})(nextConfig as any);
