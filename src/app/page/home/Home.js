import * as React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import * as HomeModule from 'modules/home';
import Header from './component/header';
import style from './style.css';


class Home extends React.Component {
  static propTypes = {
    queryUser: PropTypes.func.isRequired,
    queryTZ: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    // tz: PropTypes.shapeOf().isRequired,
  }

  static defaultProps = {

  }

  componentDidMount () {
    this.props.queryUser();
    this.props.queryTZ();
  }

  render () {
    const { user = {}, tz = [] } = this.props;
    return (<div className={style.page}><Header user={user} tz={tz} /></div>);
  }
}
const mapState = state => ({
  user: HomeModule.getUser(state),
  tz: HomeModule.getTz(state),
});

const mapDispath = ({
  queryUser: HomeModule.queryUser,
  queryTZ: HomeModule.queryTZ,
});

export default connect(mapState, mapDispath)(Home);
