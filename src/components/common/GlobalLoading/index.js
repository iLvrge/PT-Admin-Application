import './index.css';
import React, { useEffect, useState } from 'react';
import LinearProgress from '@mui/material/LinearProgress';
import { onRequestActivity } from '../../../api/requestActivity';

/**
 * A bar across the top while any request is in flight, naming what it is
 * waiting for.
 *
 * Deliberately not a blocking overlay: most of these screens keep something
 * useful on display while more arrives, and covering it would trade one
 * complaint for another. The point is only to answer "is anything happening",
 * which until now had no answer at all on the slower screens.
 */
const GlobalLoading = () => {
  const [activity, setActivity] = useState({ count: 0, labels: [] });

  useEffect(() => onRequestActivity(setActivity), []);

  if (!activity.count) return null;

  const { labels } = activity;
  const what = labels.length === 0
    ? ''
    : labels.length === 1
      ? labels[0]
      : `${labels.slice(0, -1).join(', ')} and ${labels[labels.length - 1]}`;

  return (
    <div className="pt-global-loading" role="status" aria-live="polite">
      <LinearProgress className="pt-global-loading-bar" />
      <span className="pt-global-loading-label">
        {what ? `Loading ${what}…` : 'Loading…'}
        {activity.count > 1 ? ` (${activity.count} requests)` : ''}
      </span>
    </div>
  );
};

export default GlobalLoading;
