import React from 'react'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

/**
 * Route-level error fallback.
 *
 * A chunk that failed to download and a component that threw need different
 * offers. React.lazy caches a rejected import, so resetting the boundary does
 * NOT refetch the chunk - for a chunk error the only honest recovery is a
 * reload. A render error can genuinely be retried in place.
 */
const RouteErrorFallback = ({ error, reset, isChunkError }) => {
  const title = isChunkError
    ? 'This screen could not be loaded'
    : 'Something went wrong on this screen'

  const detail = isChunkError
    ? 'The application was updated while this tab was open, or the network dropped. Reloading will pick up the new version.'
    : 'The screen stopped before it finished rendering. You can try again, or reload the page.'

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: 24,
        minHeight: 240,
        textAlign: 'center',
      }}
    >
      <Typography variant="h6">{title}</Typography>
      <Typography variant="body2" style={{ maxWidth: 460, opacity: 0.8 }}>
        {detail}
      </Typography>

      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        <Button variant="contained" color="primary" onClick={() => window.location.reload()}>
          Reload
        </Button>
        {!isChunkError && (
          <Button variant="outlined" onClick={reset}>
            Try again
          </Button>
        )}
      </div>

      {process.env.NODE_ENV !== 'production' && error && (
        <pre style={{ marginTop: 16, maxWidth: '90%', overflow: 'auto', opacity: 0.7, fontSize: 12 }}>
          {String(error.stack || error.message || error)}
        </pre>
      )}
    </div>
  )
}

export default RouteErrorFallback
