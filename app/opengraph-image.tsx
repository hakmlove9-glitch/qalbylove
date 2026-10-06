import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'قلبي لڤ - للزواج الإسلامي'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(to bottom right, #800020, #4a0012)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            fontSize: 80,
            fontWeight: 'bold',
            color: '#D4AF37',
            marginBottom: 20,
          }}
        >
          قلبي لڤ
        </div>
        <div
          style={{
            fontSize: 40,
            color: 'white',
          }}
        >
          للزواج الإسلامي في مصر
        </div>
      </div>
    ),
    size
  )
}
