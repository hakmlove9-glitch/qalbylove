import { AlertCircle } from 'lucide-react'

interface ErrorMessageProps {
  message: string
  onRetry?: () => void
}

export default function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="text-center py-20">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <AlertCircle className="w-8 h-8 text-red-600" />
      </div>
      <h3 className="text-2xl font-bold text-gray-600 mb-2">حدث خطأ ما</h3>
      <p className="text-gray-500 mb-6">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-primary">
          إعادة المحاولة
        </button>
      )}
    </div>
  )
}
