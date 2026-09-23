import axios from 'axios';
import { problemType } from './problem';

/**
 * End the session when the API says the token is no longer good.
 *
 * The console decided it was signed in purely from `admin_token` being present
 * in localStorage, and nothing anywhere removed it. So once the token expired
 * the store still reported a session, every screen rendered, every request came
 * back 401, and nobody was listening — the dashboard sat empty with no error
 * and no way back to the sign-in form short of clearing site data by hand.
 *
 * Two halves, and both are needed:
 *   - this interceptor, for a token that expires while the console is open;
 *   - hasLiveSession() below, for one that expired between visits, which the
 *     store checks at boot so the app never renders a signed-in shell it
 *     cannot fill.
 */

const TOKEN = 'admin_token';

/** Forget the session, wherever it is kept. */
export const clearSession = () => {
  try {
    localStorage.removeItem(TOKEN);
  } catch (_) {
    /* private mode, blocked storage — the cookie below still goes */
  }
  const expiry = 'Thu, 01 Jan 1970 00:00:00 GMT';
  document.cookie = `${TOKEN}=;expires=${expiry};path=/`;
  document.cookie = `${TOKEN}=;expires=${expiry};path=/;domain=.patentrack.com`;
};

/**
 * Is this token still worth sending?
 *
 * `exp` is seconds since the epoch. A malformed token counts as no session:
 * it cannot authenticate anything, so the sign-in form is the honest answer.
 */
export const isLiveToken = (token) => {
  if (!token) return false;
  try {
    const [, payload] = String(token).split('.');
    const claims = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    if (!claims || typeof claims.exp !== 'number') return true; // no expiry claimed
    return claims.exp * 1000 > Date.now();
  } catch (_) {
    return false;
  }
};

/** The sign-in form lives at the root route. */
const toSignIn = () => {
  if (window.location.pathname === '/') return;
  window.location.replace('/');
};

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error && error.response && error.response.status;
    // The API answers 401 for a missing, malformed or expired token, and says
    // which through the problem document's `type`. Either way the session is
    // over; a 403 is a permissions answer and leaves it alone.
    if (status === 401) {
      const type = problemType(error);
      if (!type || type === 'invalid-token') {
        clearSession();
        toSignIn();
      }
    }
    return Promise.reject(error);
  }
);

export default clearSession;
