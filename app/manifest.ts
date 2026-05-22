import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Aqua Blue - فروشگاه تخصصی ماهی و آکواریوم',
    short_name: 'Aqua Blue',
    description: 'فروشگاه آنلاین ماهی، آکواریوم و لوازم جانبی',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#3B82F6',
    icons: [
      {
        src: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    orientation: 'portrait',
    categories: ['shopping', 'pet', 'aquarium'],
    lang: 'fa',
    dir: 'rtl',
  };
}