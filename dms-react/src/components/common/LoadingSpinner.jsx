function LoadingSpinner({
  size = 'md', // 'sm', 'md', 'lg'
  variant = 'primary', // 'primary', 'secondary', 'light', etc.
  text = '',
  fullScreen = false,
  overlay = false,
}) {
  const sizeClasses = {
    sm: 'spinner-border-sm',
    md: '',
    lg: 'spinner-lg',
  };

  const spinnerElement = (
    <div className={`d-flex flex-column align-items-center justify-content-center ${fullScreen ? 'min-vh-100' : ''}`}>
      <div
        className={`spinner-border text-${variant} ${sizeClasses[size]}`}
        role="status"
      >
        <span className="sr-only">Loading...</span>
      </div>
      {text && (
        <p className={`mt-3 mb-0 text-${variant === 'light' ? 'light' : 'muted'}`}>
          {text}
        </p>
      )}
    </div>
  );

  if (overlay) {
    return (
      <div className="loading-overlay">
        {spinnerElement}
      </div>
    );
  }

  return spinnerElement;
}

export default LoadingSpinner;
