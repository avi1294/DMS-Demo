function EmptyState({
  icon = 'fa-folder-open',
  title = 'No Data Found',
  description = 'There are no items to display.',
  actionText = '',
  onAction = null,
  variant = 'light', // 'light', 'primary'
}) {
  return (
    <div className="empty-state text-center py-5">
      <div className={`empty-state-icon mb-4 text-${variant === 'primary' ? 'primary' : 'gray-400'}`}>
        <i className={`fas ${icon} fa-4x`}></i>
      </div>
      <h5 className="empty-state-title text-gray-800 mb-2">{title}</h5>
      <p className="empty-state-description text-gray-600 mb-4">{description}</p>
      {actionText && onAction && (
        <button
          type="button"
          className="btn btn-primary"
          onClick={onAction}
        >
          <i className="fas fa-plus mr-2"></i>
          {actionText}
        </button>
      )}
    </div>
  );
}

export default EmptyState;
