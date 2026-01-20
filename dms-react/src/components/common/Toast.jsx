import { useToast } from '../../context/ToastContext';

const toastStyles = {
  success: {
    bg: 'bg-success',
    icon: 'fa-check-circle',
  },
  error: {
    bg: 'bg-danger',
    icon: 'fa-times-circle',
  },
  warning: {
    bg: 'bg-warning',
    icon: 'fa-exclamation-triangle',
  },
  info: {
    bg: 'bg-info',
    icon: 'fa-info-circle',
  },
};

function Toast() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => {
        const style = toastStyles[toast.type] || toastStyles.info;

        return (
          <div
            key={toast.id}
            className={`toast-notification ${style.bg} text-white`}
            role="alert"
          >
            <div className="toast-content">
              <i className={`fas ${style.icon} mr-2`}></i>
              <span className="toast-message">{toast.message}</span>
            </div>
            <button
              type="button"
              className="toast-close"
              onClick={() => removeToast(toast.id)}
              aria-label="Close"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default Toast;
