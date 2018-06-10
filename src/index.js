import React from 'react';
import ReactDom from 'react-dom';
import Root from 'Root';

import history from 'history';
import { configureStore } from 'store';

import 'normalize.css';
import 'antd/dist/antd.css';
import 'theme/reset.css';

const store = configureStore();

ReactDom.render(
  <Root store={store} history={history} />,
  document.getElementById('root'),
);
