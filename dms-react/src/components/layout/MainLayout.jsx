import { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { useSidebar } from '../../context/SidebarContext'
import { useScrollPosition } from '../../hooks/useScrollPosition'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import Footer from './Footer'
import Modal from '../common/Modal'

function MainLayout() {
  const { isCollapsed } = useSidebar()
  const { isVisible, scrollToTop } = useScrollPosition()
  const navigate = useNavigate()
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  const handleLogout = () => {
    setShowLogoutModal(false)
    navigate('/login')
  }

  return (
    <div id="wrapper">
      <Sidebar />

      <div id="content-wrapper" className="d-flex flex-column">
        <div id="content">
          <Topbar onLogoutClick={() => setShowLogoutModal(true)} />

          <Outlet />
        </div>

        <Footer />
      </div>

      {/* Scroll to Top Button */}
      {isVisible && (
        <a className="scroll-to-top rounded bg-primary" onClick={scrollToTop} style={{ cursor: 'pointer' }}>
          <i className="fas fa-angle-up"></i>
        </a>
      )}

      {/* Logout Modal */}
      <Modal
        show={showLogoutModal}
        title="Ready to Leave?"
        onClose={() => setShowLogoutModal(false)}
        footer={
          <>
            <button
              className="btn btn-secondary"
              type="button"
              onClick={() => setShowLogoutModal(false)}
            >
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleLogout}>
              Logout
            </button>
          </>
        }
      >
        Select "Logout" below if you are ready to end your current session.
      </Modal>
    </div>
  )
}

export default MainLayout
