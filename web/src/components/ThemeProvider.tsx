import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import type { RootState } from '../store'

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSelector((s: RootState) => s.ui.theme)

  useEffect(() => {
    const root = document.documentElement
    root.setAttribute('data-theme', theme)
    // Hint to the UA for form controls, etc.
    root.style.colorScheme = theme
  }, [theme])

  return <>{children}</>
}

export default ThemeProvider


