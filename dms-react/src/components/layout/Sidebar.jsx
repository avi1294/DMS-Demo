import { NavLink, useLocation } from 'react-router-dom'
import { useSidebar } from '../../context/SidebarContext'
import dmsLogo from '../../assets/img/dmslogo.png'

const menuItems = [
  {
    type: 'link',
    path: '/',
    icon: 'fa-tachometer-alt',
    label: 'Dashboard'
  },
  { type: 'divider' },
  { type: 'heading', label: 'Peoples' },
  {
    type: 'collapse',
    id: 'members',
    icon: 'fa-users',
    label: 'Members',
    items: [
      { path: '/members/add', label: 'Add Members' },
      { path: '/members', label: 'Manage Members' }
    ]
  },
  { type: 'divider' },
  { type: 'heading', label: 'Data Entry' },
  {
    type: 'collapse',
    id: 'dataEntry',
    icon: 'fa-pen',
    label: 'Data Entry',
    items: [
      { path: '/data-entry/add', label: 'Add Data' },
      { path: '/data-entry/view', label: 'View Data' },
      { path: '/data-entry/define-fields', label: 'Define Fields' }
    ]
  },
  { type: 'divider' },
  { type: 'heading', label: 'Scanning' },
  {
    type: 'collapse',
    id: 'scanning',
    icon: 'fa-qrcode',
    label: 'Scan Documents',
    items: [
      { path: '/scanning/scan-docs', label: 'Scan Document' },
      { path: '/scanning/reject-hold', label: 'Rejected / Hold' }
    ]
  },
  { type: 'divider' },
  { type: 'heading', label: 'Quality Check' },
  {
    type: 'collapse',
    id: 'qualityCheck',
    icon: 'fa-check-square',
    label: 'Quality Check',
    items: [
      { path: '/quality-check/verify', label: 'Verify Document' },
      { path: '/scanning/reject-hold', label: 'Rejected / Hold' }
    ]
  },
  { type: 'divider' },
  {
    type: 'link',
    path: '/guests',
    icon: 'fa-user',
    label: 'Guest and Administrative View'
  }
]

function Sidebar() {
  const { isCollapsed, openMenus, toggleSidebar, toggleMenu } = useSidebar()
  const location = useLocation()

  const isActiveLink = (path) => {
    return location.pathname === path
  }

  const isActiveCollapse = (items) => {
    return items.some(item => location.pathname === item.path)
  }

  const renderMenuItem = (item, index) => {
    if (item.type === 'divider') {
      return <hr key={index} className="sidebar-divider mt-2" />
    }

    if (item.type === 'heading') {
      return (
        <div key={index} className="sidebar-heading">
          {item.label}
        </div>
      )
    }

    if (item.type === 'link') {
      return (
        <li key={index} className={`nav-item ${isActiveLink(item.path) ? 'active' : ''}`}>
          <NavLink className="nav-link" to={item.path}>
            <i className={`fas fa-fw ${item.icon}`}></i>
            <span>{item.label}</span>
          </NavLink>
        </li>
      )
    }

    if (item.type === 'collapse') {
      const isActive = isActiveCollapse(item.items)
      const isOpen = openMenus[item.id] || isActive

      return (
        <li key={index} className={`nav-item ${isActive ? 'active' : ''}`}>
          <a
            className={`nav-link ${!isOpen ? 'collapsed' : ''}`}
            href="#"
            onClick={(e) => {
              e.preventDefault()
              toggleMenu(item.id)
            }}
            aria-expanded={isOpen}
          >
            <i className={`fas fa-fw ${item.icon}`}></i>
            <span>{item.label}</span>
          </a>
          <div className={`collapse ${isOpen ? 'show' : ''}`}>
            <div className="bg-white py-2 collapse-inner rounded">
              <h6 className="collapse-header">{item.label} Actions:</h6>
              {item.items.map((subItem, subIndex) => (
                <NavLink
                  key={subIndex}
                  className={({ isActive }) => `collapse-item ${isActive ? 'active' : ''}`}
                  to={subItem.path}
                >
                  {subItem.label}
                </NavLink>
              ))}
            </div>
          </div>
        </li>
      )
    }

    return null
  }

  return (
    <ul
      className={`navbar-nav bg-gradient-primary sidebar sidebar-dark accordion ${isCollapsed ? 'toggled' : ''}`}
      id="accordionSidebar"
    >
      {/* Sidebar - Brand */}
      <NavLink className="sidebar-brand d-flex align-items-center justify-content-center" to="/">
        <img src={dmsLogo} height="50px" width="90" alt="logo" />
        <div className="sidebar-brand-text mx-3">Document Management System</div>
      </NavLink>

      {/* Divider */}
      <hr className="sidebar-divider my-0" />

      {/* Menu Items */}
      {menuItems.map((item, index) => renderMenuItem(item, index))}

      {/* Sidebar Toggler */}
      <div className="text-center d-none d-md-inline">
        <button
          className="rounded-circle border-0"
          id="sidebarToggle"
          onClick={toggleSidebar}
        ></button>
      </div>
    </ul>
  )
}

export default Sidebar
