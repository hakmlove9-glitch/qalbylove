import Link from 'next/link'
import { CheckCircle } from 'lucide-react'

interface SubscriptionCardProps {
  plan: {
    id: string
    name: string
    price: number
    duration: number
    durationLabel: string
    features: string[]
    popular?: boolean
  }
}

export default function SubscriptionCard({ plan }: SubscriptionCardProps) {
  return (
    <div className={`card relative ${plan.popular ? 'border-2 border-gold shadow-gold' : ''}`}>
      {plan.popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gold text-white px-4 py-1 rounded-full text-sm font-bold">
          الأكثر شعبية
        </div>
      )}
      <h3 className="text-xl font-bold text-center mb-2">{plan.name}</h3>
      <div className="text-center mb-4">
        <span className="text-4xl font-bold text-primary">{plan.price}</span>
        <span className="text-gray-600"> جنيه</span>
      </div>
      <p className="text-center text-gray-500 mb-6">{plan.durationLabel}</p>
      <ul className="space-y-3 mb-6">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-gold shrink-0" />
            <span className="text-sm">{feature}</span>
          </li>
        ))}
      </ul>
      <Link href={`/subscriptions?plan=${plan.id}`} className={`block text-center ${plan.popular ? 'btn-gold' : 'btn-primary'} w-full`}>
        اشترك الآن
      </Link>
    </div>
  )
}
