import { ImageResponse } from 'next/og'
import { APP_NAME, APP_TAGLINE } from '@/lib/site'

export const runtime = 'edge'
export const alt = APP_NAME
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background:
          'linear-gradient(135deg, #0f172a 0%, #1d4ed8 50%, #7c3aed 100%)',
        color: 'white',
        padding: 48,
      }}
    >
      <div style={{ fontSize: 72, fontWeight: 800 }}>{APP_NAME}</div>
      <div style={{ fontSize: 32, marginTop: 16, opacity: 0.9 }}>
        {APP_TAGLINE}
      </div>
    </div>,
    { ...size }
  )
}
