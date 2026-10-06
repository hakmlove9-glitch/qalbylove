import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'قلبي لڤ - للزواج الإسلامي',
    short_name: 'قلبي لڤ',
    description: 'موقع قلبي لڤ للزواج الإسلامي في مصر',
    start_url: '/',
    display: 'standalone',
    background_color: '#FFF8F0',
    theme_color: '#800020',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
