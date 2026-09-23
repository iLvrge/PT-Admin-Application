import { applyMiddleware, createStore } from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';

import rootReducer from '../index';

import jwt_decode from 'jwt-decode';
import { loginSuccess, getCookie } from "../../actions/authActions";
import { isLiveToken, clearSession } from "../../api/session";

const store = createStore(
  rootReducer,
  applyMiddleware(thunk, logger)
);

let token = localStorage.getItem('admin_token');

if(token == null) {
	token = getCookie('admin_token');
}

/*
 * An expired token used to count as a session: the store dispatched
 * loginSuccess for any token that existed, so the console rendered its
 * signed-in shell and then every request came back 401 into a page with
 * nothing to show. Check the expiry the token itself carries, and treat a
 * spent one as no session at all.
 */
if (token && isLiveToken(token)) {
  const decoded_token = jwt_decode(token);
  store.dispatch(loginSuccess(decoded_token));
} else if (token) {
  clearSession();
}
export default store;