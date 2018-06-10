import * as React from 'react';
import PropTypes from 'prop-types';
import { Provider as ReduxProvider } from 'react-redux';
import { Router, Route } from 'react-router-dom';

import App from 'app';

const Root = ({ history, store }) => (
  <ReduxProvider store={store}>
    <Router history={history}>
      <Route component={App} />
    </Router>
  </ReduxProvider>
);

Root.propTypes = {
  history: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired,
};

Root.defaultProps = {
};


export default Root;
