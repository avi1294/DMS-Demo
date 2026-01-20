import { useState, useEffect } from 'react'

export function useScrollPosition(threshold = 100) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollDistance = window.scrollY || document.documentElement.scrollTop
      setIsVisible(scrollDistance > threshold)
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Check initial position

    return () => window.removeEventListener('scroll', handleScroll)
  }, [threshold])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return { isVisible, scrollToTop }
}
