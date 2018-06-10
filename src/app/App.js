import * as React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';

import * as Page from 'app/page';
import * as AuthModule from 'modules/auth';

class App extends React.Component {
  static propTypes = {
    loginWithoutReset: PropTypes.bool.isRequired,
    verify: PropTypes.func.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
  }

  componentDidMount () {
    this.verify();
  }

  verify = () => {
    this.props.verify();
  }

  renderHome = (routerProps) => {
    const { isLoggedIn, loginWithoutReset } = this.props;

    if (isLoggedIn) {
      return (<Page.Home {...routerProps} />);
    } else if (loginWithoutReset) {
      return (<Redirect to="/reset/" />);
    }
    return (<Redirect to="/login/" />);
  }

  render () {
    const { loginWithoutReset } = this.props;
    return (
      <Switch>
        <Route exact path="/login/" component={Page.Login} />

        <Route
          exact
          path="/reset/"
          render={routerProps => (
            loginWithoutReset
              ? <Page.Reset {...routerProps} />
              : <Redirect to="/" />
          )}
        />

        <Redirect exact from="/" to="/home/" />

        <Route
          exact
          path="/home/"
          render={this.renderHome}
        />
      </Switch>
    );
  }
}

const mapState = state => ({
  loginWithoutReset: AuthModule.getLoginWithoutReset(state),
  isLoggedIn: AuthModule.isLoggedIn(state),
});
//
//
const mapDispatch = ({
  verify: AuthModule.verify,
});

export default connect(mapState, mapDispatch)(App);
