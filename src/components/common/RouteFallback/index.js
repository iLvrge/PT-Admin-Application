import React from 'react'
import CircularProgress from '@mui/material/CircularProgress'

/**
 * Suspense fallback for a route chunk that is still downloading.
 * Fills the routing area so the layout does not collapse while it loads.
 */
const RouteFallback = () => (
  <div
    style={{
      width: '100%',
      height: '100%',
      minHeight: 240,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <CircularProgress />
  </div>
)

export default RouteFallback
