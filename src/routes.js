import React, { Suspense } from 'react';
import {Switch, Route} from 'react-router-dom';

import lazyWithRetry from './utils/lazyWithRetry';
import ErrorBoundary from './components/common/ErrorBoundary';
import RouteFallback from './components/common/RouteFallback';
import RouteErrorFallback from './components/common/RouteErrorFallback';

/*
 * Route-level split points. Each becomes its own chunk, fetched on navigation,
 * so the sign-in screen no longer downloads the dashboard and the query screens
 * along with it.
 *
 * lazyWithRetry rather than React.lazy: code splitting turns a dropped
 * connection into a blank screen, and a deploy that replaces the hashed
 * filenames breaks every tab still open on the old index.html. It waits for the
 * network to return, retries with backoff, and reloads once for a chunk that is
 * genuinely gone.
 */
const DashBoard = lazyWithRetry(() => import("./components/DashBoard/DashBoard"), 'DashBoard');
const Queries = lazyWithRetry(() => import("./components/Queries"), 'Queries');
const Auth = lazyWithRetry(() => import("./components/auth"), 'Auth');

/**
 * Wraps a lazily-loaded route so that:
 *  - Suspense shows a loader while the chunk downloads
 *  - ErrorBoundary catches both a failed chunk fetch and a render error inside it
 *
 * The boundary sits OUTSIDE Suspense so it can catch the rejected import.
 *
 * `...rest` is forwarded onto the page because react-router hands its route
 * props (match, location, history) to whatever element it renders - which here
 * is this wrapper, not the page. Without the forward, a page reading
 * `match.params.token` (as the reset screen does) would get undefined.
 */
const RouteBoundary = ({ children, ...rest }) => (
  <ErrorBoundary fallback={(state) => <RouteErrorFallback {...state} />}>
    <Suspense fallback={<RouteFallback />}>
      {React.isValidElement(children) ? React.cloneElement(children, rest) : children}
    </Suspense>
  </ErrorBoundary>
);

export default (<Switch>
  <Route path="/dashboard" render={(props) => <RouteBoundary {...props}><DashBoard/></RouteBoundary>}/>
  <Route path="/queries" render={(props) => <RouteBoundary {...props}><Queries/></RouteBoundary>}/>
  <Route path="/reset/:token" render={(props) => <RouteBoundary {...props}><Auth/></RouteBoundary>}/>
  <Route path="/" render={(props) => <RouteBoundary {...props}><Auth/></RouteBoundary>}/>
</Switch>);
