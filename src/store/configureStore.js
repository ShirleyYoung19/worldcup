import { Map } from 'immutable';
import { combineReducers } from 'redux-immutable';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

import client from 'client';

import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';

import modulesReducer from 'modules';

import clientMiddleware from 'store/middleware/client';

const middlewares = [thunk, clientMiddleware(client)];

if (__DEVELOPMENT__) {
  middlewares.push(createLogger({
  }));
}

const middleware = applyMiddleware(...middlewares);

const configureStore = (initialState = Map()) => createStore(
  combineReducers({
    modules: modulesReducer,
  }),
  initialState,
  __DEVELOPMENT__ ? composeWithDevTools(middleware) : middleware,
);

export default configureStore;
