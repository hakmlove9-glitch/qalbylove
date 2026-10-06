import Link from 'next/link'
import { Heart } from 'lucide-react'
import UserAvatar from './UserAvatar'

interface ProfileCardProps {
  profile: any
  onFavorite?: (userId: string) => void
  isFavorite?: boolean
}

export default function ProfileCard({ profile, onFavorite, isFavorite }: ProfileCardProps) {
  return (
    <div className="card hover:shadow-gold transition-all">
      <div className="flex items-center gap-4 mb-4">
        <UserAvatar name={profile.full_name} size="lg" avatarUrl={profile.avatar_url} />
        <div>
          <h3 className="font-bold text-lg">{profile.full_name}</h3>
          <p className="text-sm text-gray-500">{profile.governorate}</p>
        </div>
      </div>

      <div className="space-y-2 text-sm text-gray-600 mb-4">
        <p>🎂 العمر: {calculateAge(profile.birth_date)} سنة</p>
        <p>💼 المهنة: {profile.job}</p>
        <p>🎓 التعليم: {profile.education}</p>
        <p>🕌 الالتزام: {profile.religious_level}</p>
      </div>

      <div className="flex gap-2">
        <Link href={`/profile/${profile.id}`} className="btn-primary flex-1 text-center text-sm">
          عرض الملف
        </Link>
        {onFavorite && (
          <button
            onClick={() => onFavorite(profile.user_id)}
            className={`p-2 rounded-xl transition-colors ${isFavorite ? 'bg-gold text-white' : 'btn-outline'}`}
            title={isFavorite ? 'إزالة من المفضلة' : 'أضف إلى المفضلة'}
          >
            <Heart className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  )
}

function calculateAge(birthDate: string) {
  const today = new Date()
  const birth = new Date(birthDate)
  let age = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  return age
}
