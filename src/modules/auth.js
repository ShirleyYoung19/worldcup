import { Map } from 'immutable';
import { createSelector } from 'reselect';
import { CALL_API } from 'store/middleware/client';
import jwt from 'jsonwebtoken';


const protocol = 'https';
const apiHost = 'worldcup.kuang1987.me';
const apiProxy = `${protocol}://${apiHost}`;

/*****************************************************************************
 * Selectors
 *****************************************************************************/


export const getLoginWithoutResetAuth = state => state.getIn(['modules', 'auth', 'loginWithoutResetAuth']);

export const getLoginWithoutReset = createSelector(
  getLoginWithoutResetAuth,
  loginWithoutResetAuth => !!loginWithoutResetAuth,
);

export const getToken = state => state.getIn(['modules', 'auth', 'token']);

export const getAuth = state => state.getIn(['modules', 'auth', 'auth']);

export const isLoggedIn = createSelector(
  getAuth,
  auth => !!auth,
);

/*****************************************************************************
 * Types & Action Creators
 *****************************************************************************/

const SET_TOKEN = 'modules/auth/SET_TOKEN';
export const setToken = payload => ({ type: SET_TOKEN, payload });

const SET_AUTH = 'modules/auth/SET_AUTH';
export const setAuth = payload => ({ type: SET_AUTH, payload });

export const SET_LOGIN_WITHOUT_RESET_AUTH = 'modules/auth/SET_LOGIN_WITHOUT_RESET_AUTH';
export const setLoggedInWithoutReset = ({ email } = {}) => (dispatch) => {
  dispatch({ type: SET_LOGIN_WITHOUT_RESET_AUTH, payload: email });
};


export const RESET_PASSWORD_REQUEST = 'modules/auth/RESET_PASSWORD_REQUEST';
export const RESET_PASSWORD_SUCCESS = 'modules/auth/RESET_PASSWORD_SUCCESS';
export const RESET_PASSWORD_FAILURE = 'modules/auth/RESET_PASSWORD_FAILURE';

export const resetPassword = data => ({
  [CALL_API]: {
    types: [RESET_PASSWORD_REQUEST, RESET_PASSWORD_SUCCESS, RESET_PASSWORD_FAILURE],
    promise: client => client.post(`${apiProxy}/api/changePassword/`, {
      data,
    }),
  },
});

export const reset = ({ oldPassword, newPassword, confirm }) => async(dispatch, getState) => {
  const email = getLoginWithoutResetAuth(getState()) || 'test-00@seedlinktech.com';
  try {
    await dispatch(resetPassword({ email, old_password: oldPassword, new_password: newPassword, new_password_confirm: confirm }));
    const token = getToken(getState());
    localStorage.setItem('worldcup', token);
    dispatch(setToken(token));
    dispatch(setAuth(email));
  } catch (error) {
    throw error;
  }
};

export const POST_LOGIN_REQUEST = 'modules/auth/POST_LOGIN_REQUEST';
export const POST_LOGIN_SUCCESS = 'modules/auth/POST_LOGIN_SUCCESS';
export const POST_LOGIN_FAILURE = 'modules/auth/POST_LOGIN_FAILURE';


export const postLogin = ({ email, password }) => ({
  [CALL_API]: {
    types: [POST_LOGIN_REQUEST, POST_LOGIN_SUCCESS, POST_LOGIN_FAILURE],
    promise: client => client.post(`${apiProxy}/api/login/`, {
      data: { email, password },
    }),
  },
});

export const login = ({ email, password }) => async (dispatch, getState) => {
  try {
    await dispatch(postLogin({ email, password }));
    const token = getToken(getState());
    localStorage.setItem('worldcup', token);
    dispatch(setToken(token));
    dispatch(setAuth(email));
  } catch (error) {
    throw error;
  }
};

export const verify = () => (dispatch) => {
  const token = localStorage.getItem('worldcup');
  if (!token) return;

  const { email, exp } = jwt.decode(token);
  if (!email || !exp) return;
  const now = new Date();
  if (now.getTime() / 1000 < exp) {
    dispatch(setToken(token));
    dispatch(setAuth(email));
  }
};

export const logout = () => (dispatch) => {
  window.localStorage.removeItem('worldcup');
  dispatch(setToken());
  dispatch(setAuth());
};


export const initialState = Map({
  auth: undefined,
  token: undefined,
  loginWithoutReset: false,
});

export default (state = initialState, action) => {
  const { type, response, payload } = action;

  switch (type) {
    case POST_LOGIN_SUCCESS:
      return state.merge({ token: response.token });
    case SET_LOGIN_WITHOUT_RESET_AUTH:
      return state.merge({ loginWithoutResetAuth: payload });
    case RESET_PASSWORD_SUCCESS:
      return state.merge({ token: response.token });
    case SET_TOKEN:
      return state.merge({ token: payload });
    case SET_AUTH:
      return state.merge({ auth: payload });

    default:
      return state;
  }
};
