import { NavLink, Outlet } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toggleTheme } from '../store'
import type { RootState } from '../store'

function Layout() {
  const dispatch = useDispatch()
  const theme = useSelector((s: RootState) => s.ui.theme)
  return (
    <div style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }} data-theme={theme}>
      <header style={{ padding: '12px 16px', borderBottom: '1px solid #e5e7eb' }}>
        <nav style={{ display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: 12 }}>
          <NavLink to="/" style={({ isActive }) => ({ fontWeight: isActive ? 700 : 500 })}>Home</NavLink>
          <NavLink to="/about" style={({ isActive }) => ({ fontWeight: isActive ? 700 : 500 })}>About</NavLink>
          <NavLink to="/dashboard" style={({ isActive }) => ({ fontWeight: isActive ? 700 : 500 })}>Dashboard</NavLink>
          </div>
          <button onClick={() => dispatch(toggleTheme())}>Toggle theme: {theme}</button>
        </nav>
      </header>
      <main style={{ flex: 1, padding: 24 }}>
        <Outlet />
      </main>
      <footer style={{ padding: '12px 16px', borderTop: '1px solid #e5e7eb', color: '#6b7280' }}>
        onepage – The most complex single page application EVER
      </footer>
    </div>
  )
}

export default Layout


