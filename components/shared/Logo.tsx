import Link from 'next/link'
import { Heart } from 'lucide-react'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  light?: boolean
}

export default function Logo({ size = 'md', light = false }: LogoProps) {
  const sizes = {
    sm: { container: 'w-8 h-8', icon: 'w-4 h-4', text: 'text-lg' },
    md: { container: 'w-10 h-10', icon: 'w-6 h-6', text: 'text-2xl' },
    lg: { container: 'w-14 h-14', icon: 'w-8 h-8', text: 'text-3xl' },
  }

  const s = sizes[size]

  return (
    <Link href="/" className="flex items-center gap-2">
      <div className={`${s.container} bg-primary rounded-full flex items-center justify-center`}>
        <Heart className={`${s.icon} text-gold`} />
      </div>
      <span className={`${s.text} font-bold font-cairo ${light ? 'text-white' : 'text-primary'}`}>
        قلبي لڤ
      </span>
    </Link>
  )
}
