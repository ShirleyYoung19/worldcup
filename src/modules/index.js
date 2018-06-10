import { combineReducers } from 'redux-immutable';

import auth from './auth';
import home from './home';

export default combineReducers({
  auth,
  home,
});
