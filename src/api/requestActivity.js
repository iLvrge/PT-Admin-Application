import axios from 'axios';

/**
 * Tracks requests that are in flight, so the UI can say what it is waiting for.
 *
 * Several screens here fetch a lot and take a while - the transactions list is
 * 17,291 rows and about 5 MB - and until it lands nothing on screen changes.
 * That is indistinguishable from a dead button, which is exactly how it has
 * been read.
 *
 * Implemented as interceptors on the shared axios rather than a flag threaded
 * through each thunk: there are around 190 call sites, and a per-call flag
 * would cover whichever ones someone remembered.
 */

const listeners = new Set();
let pending = [];

/** Turns a request URL into something worth showing a person. */
const labelFor = (url = '') => {
  const path = String(url).split('?')[0];
  const named = [
    [/\/company\/transactions\//, 'transactions'],
    [/\/company\/law_firms\//, 'law firms'],
    [/\/company\/lawyers\//, 'lawyers'],
    [/\/company\/raw\/assignments\//, 'correspondents'],
    [/\/customers\/\d+\/patents/, 'assets'],
    [/\/customers\/customers\/\d+\/1/, 'inventors'],
    [/\/customers\/customers\/\d+\/3/, 'entities'],
    [/\/customers\/reports/, 'client figures'],
    [/\/customers\/\d+\/reports/, 'client figures'],
    [/\/customers\/\d+\/companies/, 'companies'],
    [/\/admin\/customers$/, 'clients'],
    [/\/users/, 'users'],
    [/\/keywords/, 'keywords'],
    [/\/entities/, 'entities'],
    [/\/reports/, 'reports'],
  ].find(([re]) => re.test(path));
  return named ? named[1] : '';
};

const notify = () => {
  const labels = [...new Set(pending.map((p) => p.label).filter(Boolean))];
  const snapshot = { count: pending.length, labels };
  listeners.forEach((fn) => {
    try {
      fn(snapshot);
    } catch (_) {
      /* a broken listener must not break the request it is reporting on */
    }
  });
};

/** Subscribe to activity changes; returns an unsubscribe. */
export const onRequestActivity = (fn) => {
  listeners.add(fn);
  fn({ count: pending.length, labels: [...new Set(pending.map((p) => p.label).filter(Boolean))] });
  return () => listeners.delete(fn);
};

let nextId = 0;

const clearById = (id) => {
  if (id == null) return;
  const before = pending.length;
  pending = pending.filter((p) => p.id !== id);
  if (pending.length !== before) notify();
};

axios.interceptors.request.use(
  (config) => {
    // eslint-disable-next-line no-param-reassign -- the id has to travel with
    // the request so the response side can find and clear the right entry.
    config.__activityId = ++nextId;
    pending.push({ id: config.__activityId, label: labelFor(config.url), at: Date.now() });

    /*
     * Cancellation has to be handled here, not in the response interceptor.
     *
     * This app cancels in-flight requests in 21 places, and axios 0.19 rejects
     * a cancelled request with a Cancel object carrying only a message - no
     * `config` - so the response side has no id to clear and the entry would
     * stay pending forever. That is what left the bar reading
     * "Loading users... (3 requests)" indefinitely. The token's own promise
     * settles on cancellation, which does give us the hook.
     */
    if (config.cancelToken && config.cancelToken.promise) {
      const id = config.__activityId;
      config.cancelToken.promise.then(() => clearById(id), () => clearById(id));
    }

    notify();
    return config;
  },
  (error) => Promise.reject(error)
);

/*
 * Last-resort sweep. Anything that neither resolved, rejected nor cancelled -
 * a request abandoned by a page teardown, say - is dropped after the axios
 * timeout, so one lost request cannot pin the indicator on for the session.
 */
const maxAge = () => (axios.defaults.timeout || 60000) + 5000;
setInterval(() => {
  // Read the timeout now, not at import: patenTrack.js raises
  // axios.defaults.timeout after importing this module, so a value captured up
  // front would be the 0 default and sweep slow-but-healthy requests away.
  const cutoff = Date.now() - maxAge();
  const before = pending.length;
  pending = pending.filter((p) => p.at > cutoff);
  if (pending.length !== before) notify();
}, 5000);

const clear = (config) => clearById(config && config.__activityId);

axios.interceptors.response.use(
  (response) => {
    clear(response.config);
    return response;
  },
  (error) => {
    // Cleared on failure too, or one dead request pins the indicator on forever.
    clear(error && error.config);
    return Promise.reject(error);
  }
);

export default onRequestActivity;
