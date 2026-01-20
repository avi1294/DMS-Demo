import { useState } from 'react'
import { useSidebar } from '../../context/SidebarContext'
import profileImg from '../../assets/img/undraw_profile.svg'
import profile1Img from '../../assets/img/undraw_profile_1.svg'
import profile2Img from '../../assets/img/undraw_profile_2.svg'
import profile3Img from '../../assets/img/undraw_profile_3.svg'

function Topbar({ onLogoutClick }) {
  const { toggleSidebar } = useSidebar()
  const [searchQuery, setSearchQuery] = useState('')
  const [showAlerts, setShowAlerts] = useState(false)
  const [showMessages, setShowMessages] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showSearchMobile, setShowSearchMobile] = useState(false)

  const alerts = [
    {
      id: 1,
      icon: 'fa-file-alt',
      bgColor: 'bg-primary',
      date: 'December 12, 2019',
      message: 'A new monthly report is ready to download!',
      bold: true
    },
    {
      id: 2,
      icon: 'fa-donate',
      bgColor: 'bg-success',
      date: 'December 7, 2019',
      message: '$290.29 has been deposited into your account!'
    },
    {
      id: 3,
      icon: 'fa-exclamation-triangle',
      bgColor: 'bg-warning',
      date: 'December 2, 2019',
      message: 'Spending Alert: We\'ve noticed unusually high spending for your account.'
    }
  ]

  const messages = [
    {
      id: 1,
      image: profile1Img,
      name: 'Emily Fowler',
      time: '58m',
      message: 'Hi there! I am wondering if you can help me with a problem I\'ve been having.',
      status: 'bg-success'
    },
    {
      id: 2,
      image: profile2Img,
      name: 'Jae Chun',
      time: '1d',
      message: 'I have the photos that you ordered last month, how would you like them sent to you?',
      status: ''
    },
    {
      id: 3,
      image: profile3Img,
      name: 'Morgan Alvarez',
      time: '2d',
      message: 'Last month\'s report looks great, I am very happy with the progress so far, keep up the good work!',
      status: 'bg-warning'
    }
  ]

  const closeAllDropdowns = () => {
    setShowAlerts(false)
    setShowMessages(false)
    setShowUserMenu(false)
    setShowSearchMobile(false)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    // Implement search functionality here
    console.log('Searching for:', searchQuery)
  }

  return (
    <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
      {/* Sidebar Toggle (Topbar) */}
      <button
        id="sidebarToggleTop"
        className="btn btn-link d-md-none rounded-circle mr-3"
        onClick={toggleSidebar}
      >
        <i className="fa fa-bars"></i>
      </button>

      {/* Topbar Search */}
      <form
        className="d-none d-sm-inline-block form-inline mr-auto ml-md-3 my-2 my-md-0 mw-100 navbar-search"
        onSubmit={handleSearch}
      >
        <div className="input-group">
          <input
            type="text"
            className="form-control bg-light border-0 small"
            placeholder="Search for..."
            aria-label="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="input-group-append">
            <button className="btn btn-primary" type="submit">
              <i className="fas fa-search fa-sm"></i>
            </button>
          </div>
        </div>
      </form>

      {/* Topbar Navbar */}
      <ul className="navbar-nav ml-auto">
        {/* Nav Item - Search Dropdown (Visible Only XS) */}
        <li className={`nav-item dropdown no-arrow d-sm-none ${showSearchMobile ? 'show' : ''}`}>
          <a
            className="nav-link dropdown-toggle"
            href="#"
            onClick={(e) => {
              e.preventDefault()
              closeAllDropdowns()
              setShowSearchMobile(!showSearchMobile)
            }}
          >
            <i className="fas fa-search fa-fw"></i>
          </a>
          <div className={`dropdown-menu dropdown-menu-right p-3 shadow animated--grow-in ${showSearchMobile ? 'show' : ''}`}>
            <form className="form-inline mr-auto w-100 navbar-search" onSubmit={handleSearch}>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control bg-light border-0 small"
                  placeholder="Search for..."
                  aria-label="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="input-group-append">
                  <button className="btn btn-primary" type="submit">
                    <i className="fas fa-search fa-sm"></i>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </li>

        {/* Nav Item - Alerts */}
        <li className={`nav-item dropdown no-arrow mx-1 ${showAlerts ? 'show' : ''}`}>
          <a
            className="nav-link dropdown-toggle"
            href="#"
            onClick={(e) => {
              e.preventDefault()
              closeAllDropdowns()
              setShowAlerts(!showAlerts)
            }}
          >
            <i className="fas fa-bell fa-fw"></i>
            <span className="badge badge-danger badge-counter">3+</span>
          </a>
          <div className={`dropdown-list dropdown-menu dropdown-menu-right shadow animated--grow-in ${showAlerts ? 'show' : ''}`}>
            <h6 className="dropdown-header">Alerts Center</h6>
            {alerts.map((alert) => (
              <a key={alert.id} className="dropdown-item d-flex align-items-center" href="#">
                <div className="mr-3">
                  <div className={`icon-circle ${alert.bgColor}`}>
                    <i className={`fas ${alert.icon} text-white`}></i>
                  </div>
                </div>
                <div>
                  <div className="small text-gray-500">{alert.date}</div>
                  {alert.bold ? (
                    <span className="font-weight-bold">{alert.message}</span>
                  ) : (
                    alert.message
                  )}
                </div>
              </a>
            ))}
            <a className="dropdown-item text-center small text-gray-500" href="#">
              Show All Alerts
            </a>
          </div>
        </li>

        {/* Nav Item - Messages */}
        <li className={`nav-item dropdown no-arrow mx-1 ${showMessages ? 'show' : ''}`}>
          <a
            className="nav-link dropdown-toggle"
            href="#"
            onClick={(e) => {
              e.preventDefault()
              closeAllDropdowns()
              setShowMessages(!showMessages)
            }}
          >
            <i className="fas fa-envelope fa-fw"></i>
            <span className="badge badge-danger badge-counter">7</span>
          </a>
          <div className={`dropdown-list dropdown-menu dropdown-menu-right shadow animated--grow-in ${showMessages ? 'show' : ''}`}>
            <h6 className="dropdown-header">Message Center</h6>
            {messages.map((msg) => (
              <a key={msg.id} className="dropdown-item d-flex align-items-center" href="#">
                <div className="dropdown-list-image mr-3">
                  <img className="rounded-circle" src={msg.image} alt={msg.name} />
                  {msg.status && <div className={`status-indicator ${msg.status}`}></div>}
                </div>
                <div className={msg.id === 1 ? 'font-weight-bold' : ''}>
                  <div className="text-truncate">{msg.message}</div>
                  <div className="small text-gray-500">{msg.name} · {msg.time}</div>
                </div>
              </a>
            ))}
            <a className="dropdown-item text-center small text-gray-500" href="#">
              Read More Messages
            </a>
          </div>
        </li>

        <div className="topbar-divider d-none d-sm-block"></div>

        {/* Nav Item - User Information */}
        <li className={`nav-item dropdown no-arrow ${showUserMenu ? 'show' : ''}`}>
          <a
            className="nav-link dropdown-toggle"
            href="#"
            onClick={(e) => {
              e.preventDefault()
              closeAllDropdowns()
              setShowUserMenu(!showUserMenu)
            }}
          >
            <span className="mr-2 d-none d-lg-inline text-gray-600 small">Douglas McGee</span>
            <img className="img-profile rounded-circle" src={profileImg} alt="Profile" />
          </a>
          <div className={`dropdown-menu dropdown-menu-right shadow animated--grow-in ${showUserMenu ? 'show' : ''}`}>
            <a className="dropdown-item" href="#">
              <i className="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>
              Profile
            </a>
            <a className="dropdown-item" href="#">
              <i className="fas fa-cogs fa-sm fa-fw mr-2 text-gray-400"></i>
              Settings
            </a>
            <a className="dropdown-item" href="#">
              <i className="fas fa-list fa-sm fa-fw mr-2 text-gray-400"></i>
              Activity Log
            </a>
            <div className="dropdown-divider"></div>
            <a
              className="dropdown-item"
              href="#"
              onClick={(e) => {
                e.preventDefault()
                onLogoutClick()
              }}
            >
              <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
              Logout
            </a>
          </div>
        </li>
      </ul>
    </nav>
  )
}

export default Topbar
