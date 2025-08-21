import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './store'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/queryClient'
import './index.css'
import App from './App.tsx'

const container = document.getElementById('root')!
const root = createRoot(container)

root.render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </Provider>
  </StrictMode>,
)

if (import.meta.env.DEV) {
  import('./mocks/browser')
    .then(({ worker }) => worker.start({ onUnhandledRequest: 'bypass' }))
    .catch(() => { /* non-blocking in dev */ })
}
