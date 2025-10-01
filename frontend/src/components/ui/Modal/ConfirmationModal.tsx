import Modal from './Modal'
import Button from '../Button'

interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description?: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning' | 'info'
  loading?: boolean
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'info',
  loading = false
}: ConfirmationModalProps) {
  const getConfirmButtonVariant = () => {
    switch (variant) {
      case 'danger':
        return 'danger'
      case 'warning':
        return 'primary'
      case 'info':
      default:
        return 'primary'
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      description={description}
      size="sm"
      closeOnOverlayClick={!loading}
    >
      <div className="flex flex-col sm:flex-row sm:justify-end gap-3 mt-6">
        <Button
          variant="secondary"
          onClick={onClose}
          disabled={loading}
          className="sm:order-1"
        >
          {cancelText}
        </Button>
        <Button
          variant={getConfirmButtonVariant()}
          onClick={onConfirm}
          loading={loading}
          className="sm:order-2"
        >
          {confirmText}
        </Button>
      </div>
    </Modal>
  )
}
