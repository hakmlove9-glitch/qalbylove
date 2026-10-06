'use client'

import { Toaster } from 'react-hot-toast'

export default function Toast() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        style: {
          background: '#800020',
          color: '#fff',
          borderRadius: '12px',
          padding: '16px',
          fontSize: '16px',
        },
        success: {
          iconTheme: {
            primary: '#D4AF37',
            secondary: '#fff',
          },
        },
        error: {
          style: {
            background: '#dc2626',
          },
        },
      }}
    />
  )
}
