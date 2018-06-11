import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { Select } from 'antd';

import * as HomeModule from 'modules/home';
import style from './style.css';
import { STATUS } from '../const';

const { Option } = Select;

class Match extends React.Component {
  static propTypes = {
    status: PropTypes.oneOf([
      STATUS.ONGOING,
      STATUS.DONE,
      STATUS.TOGO,
    ]).isRequired,
    match: PropTypes.object.isRequired,
    postUserGuessRecord: PropTypes.func.isRequired,
  }

  static defaultProps = {

  }

  componentDidMount () {

  }

  handleChange = id => (value) => {
    this.props.postUserGuessRecord(id, value);
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
      winner,
      guess,
      _id,
      guessName,
    } = match;

    const doneRender = (
      <div className={style.right}>
        <div className={style.winner}>
          <div className={style.title}>
            Winner
          </div>
          <div className={style.team}>
            {winner}
          </div>
        </div>
        <div className={style.guess}>
          <div className={style.title}>
            Guess
          </div>
          <div className={style.team}>
            {guessName}
          </div>
        </div>

      </div>
    );

    const onGoingRender = (
      <div className={style.right}>
        <Select
          className={style.select}
          placeholder="Please guess"
          onChange={this.handleChange(_id)}
          value={guess}
        >
          <Option value={homeTeam}>{homeTeamName}</Option>
          <Option value={awayTeam}>{awayTeamName}</Option>
          {stage === 'group' && (<Option value="draw">Draw</Option>)}
        </Select>
      </div>
    );

    return (
      <div className={classnames(style.match, { [style[status]]: status })}>
        <div className={style.left}>
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
                    <img className={style.flag} src={homeTeamFlag} alt="flag" />
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
                    <img className={style.flag} src={awayTeamFlag} alt="flag" />
                    <span>{awayTeamName}</span>
                  </div>
                  :
                  '-'
              }
            </div>
          </div>
        </div>
        {status === STATUS.ONGOING && onGoingRender}
        {status === STATUS.DONE && doneRender}
      </div>
    );
  }
}

const mapDispath = ({
  postUserGuessRecord: HomeModule.postUserGuessRecord,
});

export default connect(null, mapDispath)(Match);
