'use client'

import Modal from '@/components/shared/Modal'

interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  loading?: boolean
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'تأكيد',
  cancelText = 'إلغاء',
  loading = false,
}: ConfirmDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <p className="text-gray-600 mb-6">{message}</p>
      <div className="flex gap-4">
        <button onClick={onConfirm} disabled={loading} className="btn-primary flex-1 disabled:opacity-50">
          {loading ? 'جارٍ التنفيذ...' : confirmText}
        </button>
        <button onClick={onClose} disabled={loading} className="btn-outline flex-1 disabled:opacity-50">
          {cancelText}
        </button>
      </div>
    </Modal>
  )
}
