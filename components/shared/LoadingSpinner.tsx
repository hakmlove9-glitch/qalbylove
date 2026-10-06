import { Heart } from 'lucide-react'

export default function LoadingSpinner({ text = 'جارٍ التحميل...' }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center animate-pulse mb-4">
        <Heart className="w-8 h-8 text-gold" />
      </div>
      <p className="text-lg text-primary font-semibold">{text}</p>
    </div>
  )
}
