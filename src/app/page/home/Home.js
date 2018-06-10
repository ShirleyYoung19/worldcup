import * as React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import * as HomeModule from 'modules/home';
import Header from './component/header';
import Detail from './component/detail';
import style from './style.css';


class Home extends React.Component {
  static propTypes = {
    init: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    // tz: PropTypes.shapeOf().isRequired,
  }

  static defaultProps = {

  }

  componentDidMount () {
    this.props.init();
  }

  render () {
    const { user = {} } = this.props;
    return (
      <div className={style.page}>
        <Header />
        <Detail />
      </div>
    );
  }
}
const mapState = state => ({
  user: HomeModule.getUser(state),
});

const mapDispath = ({
  init: HomeModule.init,
});

export default connect(mapState, mapDispath)(Home);
