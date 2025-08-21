import { Component } from 'react'
import type { ReactNode } from 'react'

interface Props { children: ReactNode }
interface State { hasError: boolean; message?: string }

class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message }
  }

  componentDidCatch(error: Error, info: any) {
    // eslint-disable-next-line no-console
    console.error('ErrorBoundary caught', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 16, background: '#fee2e2', color: '#991b1b' }}>
          <strong>Something went wrong.</strong>
          <div>{this.state.message}</div>
        </div>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary


