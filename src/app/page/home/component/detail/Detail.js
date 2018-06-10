import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Menu } from 'antd';

import * as HomeModule from 'modules/home';
import style from './style.css';
import { STATUS } from './const';

import Match from './match';

class Detail extends React.Component {
  static propTypes = {
    onGoingMatch: PropTypes.arrayOf(PropTypes.object),
    doneMatch: PropTypes.arrayOf(PropTypes.object),
    togoMatch: PropTypes.arrayOf(PropTypes.object),
  }

  static defaultProps = {
    onGoingMatch: [],
    doneMatch: [],
    togoMatch: [],
  }

  state ={
    current: STATUS.TOGO,
  }

  handleMenuClick = (e) => {
    this.setState({
      current: e.key,
    });
  }

  render () {
    const { doneMatch, onGoingMatch, togoMatch } = this.props;
    const { current } = this.state;
    let match;
    if (current === STATUS.ONGOING) match = onGoingMatch;
    if (current === STATUS.DONE) match = doneMatch;
    if (current === STATUS.TOGO) match = togoMatch;
    return (
      <div className={style.page}>
        <Menu
          className={style.header}
          onClick={this.handleMenuClick}
          selectedKeys={[this.state.current]}
          mode="horizontal"
        >
          <Menu.Item key={STATUS.ONGOING}>
            On going
          </Menu.Item>
          <Menu.Item key={STATUS.DONE}>
            Done
          </Menu.Item>
          <Menu.Item key={STATUS.TOGO}>
            To go
          </Menu.Item>
        </Menu>

        <div className={style.body}>
          {match.map(item => (<Match status={current} key={item.matchIndex} match={item} />))}
        </div>
      </div>
    );
  }
}

const mapState = state => ({
  onGoingMatch: HomeModule.onGoingMatch(state),
  doneMatch: HomeModule.doneMatch(state),
  togoMatch: HomeModule.togoMatch(state),
});

export default connect(mapState)(Detail);
