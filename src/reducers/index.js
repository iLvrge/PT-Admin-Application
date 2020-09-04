import { combineReducers } from 'redux';
import authReducer from './authReducer';
import patenTrackReducer from './patenTrackReducer';
/*import * as types from '../actions/actionTypes';
import initialState from './initialState';*/

const rootReducer = combineReducers({
  auth: authReducer,
  patenTrack: patenTrackReducer
});

export default rootReducer;

/*export default (state, action) =>
  rootReducer(action.type === types.SIGN_OUT_SUCCESS ? initialState.auth : state, action);*/

/*export default rootReducer;*/