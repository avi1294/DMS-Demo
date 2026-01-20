import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const SidebarContext = createContext(null)

export function SidebarProvider({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [openMenus, setOpenMenus] = useState({})
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)

      // Auto-collapse on small screens
      if (window.innerWidth < 480 && !isCollapsed) {
        setIsCollapsed(true)
        setOpenMenus({})
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isCollapsed])

  const toggleSidebar = useCallback(() => {
    setIsCollapsed(prev => {
      // Close all open menus when collapsing
      if (!prev) {
        setOpenMenus({})
      }
      return !prev
    })
  }, [])

  const toggleMenu = useCallback((menuId) => {
    setOpenMenus(prev => ({
      ...prev,
      [menuId]: !prev[menuId]
    }))
  }, [])

  const closeAllMenus = useCallback(() => {
    setOpenMenus({})
  }, [])

  const value = {
    isCollapsed,
    openMenus,
    isMobile,
    toggleSidebar,
    toggleMenu,
    closeAllMenus
  }

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider')
  }
  return context
}
