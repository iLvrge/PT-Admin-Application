import React from 'react'
import { isChunkLoadError } from '../../../utils/lazyWithRetry'

/**
 * Catches render errors in the subtree below it.
 *
 * The default fallback is unchanged from this app's original, so the existing
 * in-pane usage (the diagram inside Queries) looks exactly as before.
 * Route-level callers pass a richer `fallback` instead.
 *
 * Two fixes over the previous version:
 *  - state is set in `getDerivedStateFromError`, so the fallback renders on the
 *    error render itself rather than one commit later via `componentDidCatch`.
 *  - the boundary can be reset, so a recoverable error is not permanent.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { error: null, errorInfo: null }
    this.reset = this.reset.bind(this)
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo })

    // Optional reporting hook. Sentry.init is currently commented out in
    // index.js, so nothing is wired by default — pass onError to opt in.
    if (typeof this.props.onError === 'function') {
      try {
        this.props.onError(error, errorInfo)
      } catch (_) {
        /* a failing reporter must not mask the original error */
      }
    }
  }

  componentDidUpdate(prevProps) {
    const { resetKeys } = this.props
    if (!this.state.error || !resetKeys) return

    const prevKeys = prevProps.resetKeys || []
    const changed =
      resetKeys.length !== prevKeys.length ||
      resetKeys.some((key, i) => !Object.is(key, prevKeys[i]))

    if (changed) this.reset()
  }

  reset() {
    this.setState({ error: null, errorInfo: null })
  }

  render() {
    const { error, errorInfo } = this.state
    const { fallback, children } = this.props

    if (!error) return children

    if (typeof fallback === 'function') {
      return fallback({
        error,
        errorInfo,
        reset: this.reset,
        isChunkError: isChunkLoadError(error),
      })
    }
    if (fallback) return fallback

    /*
     * This app's own original fallback, unchanged. The one existing caller -
     * the diagram inside Queries - renders the boundary with no `fallback`
     * prop, so any other wording here would silently alter a screen that is
     * not part of this migration.
     */
    return (
      <div>
        <h2>Something went wrong.</h2>
        <details style={{ whiteSpace: 'pre-wrap' }}>
          {error && error.toString()}
          <br />
          {errorInfo && errorInfo.componentStack}
        </details>
      </div>
    )
  }
}

export default ErrorBoundary
