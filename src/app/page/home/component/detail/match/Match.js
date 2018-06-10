import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classnames from 'classnames';

import * as HomeModule from 'modules/home';
import style from './style.css';
import { STATUS } from '../const';

class Match extends React.Component {
  static propTypes = {
    status: PropTypes.oneOf([
      STATUS.ONGOING,
      STATUS.DONE,
      STATUS.TOGO,
    ]).isRequired,
    match: PropTypes.object.isRequired,
  }

  static defaultProps = {

  }

  componentDidMount () {

  }

  render () {
    const { status, match = {} } = this.props;
    const {
      matchIndex,
      stage,
      label,
      startTime,
      homeTeam,
      homeTeamName,
      homeTeamFlag,
      homeTeamScore,
      awayTeam,
      awayTeamName,
      awayTeamFlag,
      awayTeamScore,
      endWay,
    } = match;

    return (
      <div className={classnames(style.match, { [style[status]]: status })}>
        <div className={style.top}>
          <div title={matchIndex} className={style.index}>
            {matchIndex}
          </div>
          <div title={`${stage.toUpperCase()} ${label}`} className={style.stage}>
            {`${stage.toUpperCase()} ${label}`}
          </div>
          <div title={startTime} className={style.time}>
            {startTime}
          </div>
        </div>
        <div className={style.bottom}>
          <div className={style.home}>
            {
              homeTeam ?
                <div className={style.info}>
                  <img className={style.flag} src={homeTeamFlag} alt="home team country flag" />
                  <span>{homeTeamName}</span>
                </div>
                :
                '-'
            }
          </div>
          <div className={style.score}>
            {
              status === STATUS.DONE
                ? (
                  <div className={style.result}>
                    {`${homeTeamScore} : ${awayTeamScore}`}
                    <div className={style.type}>
                      {endWay}
                    </div>
                  </div>
                )
                :
                (<span className={style.vs}>VS</span>)
            }
          </div>

          <div className={style.away}>
            {
              awayTeam ?
                <div className={style.info}>
                  <img className={style.flag} src={awayTeamFlag} alt="home team country flag" />
                  <span>{awayTeamName}</span>
                </div>
                :
                '-'
            }
          </div>
        </div>
      </div>
    );
  }
}

export default Match;
