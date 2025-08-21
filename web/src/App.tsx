import './App.css'
import { Suspense } from 'react'
import ComplexPage from './components/ComplexPage'
import ErrorBoundary from './components/ErrorBoundary'

function App() {
  return (
    <>
      <div style={{ position: 'fixed', top: 8, left: 8, background: '#f59e0b', color: '#111827', padding: '6px 10px', borderRadius: 6, fontWeight: 700, zIndex: 2000 }}>
        App Mounted
      </div>
      <ErrorBoundary>
        <Suspense fallback={<div style={{ padding: 24, fontSize: 18 }}>Loading…</div>}>
          <ComplexPage />
        </Suspense>
      </ErrorBoundary>
    </>
  )
}

export default App
