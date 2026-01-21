import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSidebar } from '../../context/SidebarContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useData } from '../../context/DataContext';
import profileImg from '../../assets/img/undraw_profile.svg';

function Topbar() {
  const navigate = useNavigate();
  const { toggleSidebar } = useSidebar();
  const { user, logout, isAuthenticated } = useAuth();
  const toast = useToast();
  const { getStats } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [showAlerts, setShowAlerts] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSearchMobile, setShowSearchMobile] = useState(false);

  const navRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setShowAlerts(false);
        setShowMessages(false);
        setShowUserMenu(false);
        setShowSearchMobile(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const stats = getStats();

  // Dynamic alerts based on real data
  const alerts = [
    {
      id: 1,
      icon: 'fa-clock',
      bgColor: 'bg-warning',
      date: 'Just now',
      message: `${stats.pendingDocuments} documents pending verification`,
      bold: true,
    },
    {
      id: 2,
      icon: 'fa-file-alt',
      bgColor: 'bg-primary',
      date: 'Today',
      message: `${stats.totalDocuments} total documents in the system`,
    },
    {
      id: 3,
      icon: 'fa-users',
      bgColor: 'bg-success',
      date: 'Today',
      message: `${stats.activeMembers} active team members`,
    },
  ];

  const closeAllDropdowns = () => {
    setShowAlerts(false);
    setShowMessages(false);
    setShowUserMenu(false);
    setShowSearchMobile(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      toast.info(`Search feature coming soon! Query: "${searchQuery}"`);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('You have been logged out');
    navigate('/login');
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user) return 'U';
    return `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase();
  };

  return (
    <nav ref={navRef} className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
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
              e.preventDefault();
              closeAllDropdowns();
              setShowSearchMobile(!showSearchMobile);
            }}
          >
            <i className="fas fa-search fa-fw"></i>
          </a>
          <div
            className={`dropdown-menu dropdown-menu-right p-3 shadow animated--grow-in ${
              showSearchMobile ? 'show' : ''
            }`}
          >
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
              e.preventDefault();
              closeAllDropdowns();
              setShowAlerts(!showAlerts);
            }}
          >
            <i className="fas fa-bell fa-fw"></i>
            {stats.pendingDocuments > 0 && (
              <span className="badge badge-danger badge-counter">
                {stats.pendingDocuments > 9 ? '9+' : stats.pendingDocuments}
              </span>
            )}
          </a>
          <div
            className={`dropdown-list dropdown-menu dropdown-menu-right shadow animated--grow-in ${
              showAlerts ? 'show' : ''
            }`}
          >
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
            <a
              className="dropdown-item text-center small text-gray-500"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate('/quality-check/verify');
                closeAllDropdowns();
              }}
            >
              View All Pending Documents
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
              e.preventDefault();
              closeAllDropdowns();
              setShowUserMenu(!showUserMenu);
            }}
          >
            <span className="mr-2 d-none d-lg-inline text-gray-600 small">
              {isAuthenticated && user
                ? `${user.firstName} ${user.lastName}`
                : 'Guest User'}
            </span>
            {isAuthenticated && user ? (
              <div
                className="img-profile rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                style={{ width: '32px', height: '32px', fontSize: '0.8rem' }}
              >
                {getUserInitials()}
              </div>
            ) : (
              <img className="img-profile rounded-circle" src={profileImg} alt="Profile" />
            )}
          </a>
          <div
            className={`dropdown-menu dropdown-menu-right shadow animated--grow-in ${
              showUserMenu ? 'show' : ''
            }`}
          >
            {isAuthenticated && user ? (
              <>
                <div className="dropdown-item-text">
                  <div className="font-weight-bold">{user.firstName} {user.lastName}</div>
                  <small className="text-muted">{user.email}</small>
                  <div>
                    <span className="badge badge-primary">{user.role}</span>
                  </div>
                </div>
                <div className="dropdown-divider"></div>
                <a className="dropdown-item" href="#" onClick={(e) => e.preventDefault()}>
                  <i className="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>
                  Profile
                </a>
                <a className="dropdown-item" href="#" onClick={(e) => e.preventDefault()}>
                  <i className="fas fa-cogs fa-sm fa-fw mr-2 text-gray-400"></i>
                  Settings
                </a>
                <div className="dropdown-divider"></div>
                <a
                  className="dropdown-item"
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleLogout();
                  }}
                >
                  <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                  Logout
                </a>
              </>
            ) : (
              <>
                <a
                  className="dropdown-item"
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/login');
                  }}
                >
                  <i className="fas fa-sign-in-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                  Login
                </a>
                <a
                  className="dropdown-item"
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/register');
                  }}
                >
                  <i className="fas fa-user-plus fa-sm fa-fw mr-2 text-gray-400"></i>
                  Register
                </a>
              </>
            )}
          </div>
        </li>
      </ul>
    </nav>
  );
}

export default Topbar;
