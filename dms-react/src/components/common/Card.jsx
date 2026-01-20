function Card({ title, children, className = '', headerClassName = '', bodyClassName = '', dropdown }) {
  return (
    <div className={`card shadow mb-4 ${className}`}>
      {title && (
        <div className={`card-header py-3 d-flex flex-row align-items-center justify-content-between ${headerClassName}`}>
          <h6 className="m-0 font-weight-bold text-primary">{title}</h6>
          {dropdown}
        </div>
      )}
      <div className={`card-body ${bodyClassName}`}>
        {children}
      </div>
    </div>
  )
}

function CardDropdown({ children }) {
  return (
    <div className="dropdown no-arrow">
      <a
        className="dropdown-toggle"
        href="#"
        role="button"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
      >
        <i className="fas fa-ellipsis-v fa-sm fa-fw text-gray-400"></i>
      </a>
      <div className="dropdown-menu dropdown-menu-right shadow animated--fade-in">
        {children}
      </div>
    </div>
  )
}

export { Card, CardDropdown }
export default Card
