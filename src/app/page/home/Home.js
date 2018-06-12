import * as React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import * as HomeModule from 'modules/home';
import { Select } from 'antd';
import Header from './component/header';
import Detail from './component/detail';
import style from './style.css';

const { Option } = Select;


class Home extends React.Component {
  static propTypes = {
    init: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    postUser: PropTypes.func.isRequired,
    getGoldenPlayer: PropTypes.object,
    userRankList: PropTypes.arrayOf(PropTypes.object),
    playerRankList: PropTypes.arrayOf(PropTypes.object),
    teams: PropTypes.arrayOf(PropTypes.object),
    loading: PropTypes.bool,
    loaded: PropTypes.bool,
  }

  static defaultProps = {
    getGoldenPlayer: {},
    teams: [],
    userRankList: [],
    playerRankList: [],
    loading: undefined,
    loaded: undefined,
  }

  state = {
    country: undefined,
  }

  componentDidMount () {
    this.props.init();
  }

  handleCountryChange = (country) => {
    this.setState({
      country,
    });
  }

  handlePlayerChange = (player) => {
    this.props.postUser('goldenPlayerGuessRecord', player);
  }

  render () {
    const { user: { guessScore } = {}, teams = [], getGoldenPlayer, userRankList = [], playerRankList = [], loading, loaded } = this.props;

    const { country } = this.state;

    const { players = [] } = teams.find(({ _id } = {}) => String(_id) === String(country)) || {};

    if (loading === true && loaded === false) return (<div className={style.loadingContainer}><div className={style.img} /></div>);
    if (loading === false && loaded === false) return (<div className={style.errorContainer}><div className={style.error}>Something went wrong, you can try to find Kevin for help! </div></div>);
    return (
      <div className={style.page}>
        <Header />
        <div className={style.container}>
          <div className={style.detail}>
            <Detail />
          </div>

          <div className={style.chart}>
            <div className={style.score}>
              <div className={style.header}>
              Your Score
              </div>
              <div className={style.total}>
                { guessScore }
              </div>
            </div>

            <div className={style.golden}>
              <div className={style.header}>
              Your Golden Player
              </div>
              <div className={style.team}>
                <Select
                  className={style.country}
                  placeholder="Select country"
                  onChange={this.handleCountryChange}
                  value={country || getGoldenPlayer.team}
                >
                  {teams.map(({ _id, name, flagUrl }) => (
                    <Option className={style.countryOption} value={_id} key={_id}>
                      <img className={style.flag} src={flagUrl} alt="flag" />
                      <span>{name}</span>
                    </Option>
                  ))}
                </Select>
                <Select
                  className={style.player}
                  placeholder="Select player"
                  onChange={this.handlePlayerChange}
                  value={getGoldenPlayer.name}
                >
                  { players.map(({ _id, name }) => (
                    <Option className={style.playerOption} value={_id} key={_id}>
                      <span>{name}</span>
                    </Option>
                  ))}
                </Select>
              </div>
            </div>

            <div className={style.rank}>
              <div className={style.header}>
            Ranking
              </div>
              <div className={style.tableContainer}>
                <table className={style.table}>
                  <tbody>
                    {userRankList.map(({ nickName, email, guessScore: score } = {}, index) => (
                      <tr>
                        <td className={style.index}>{index + 1}</td>
                        <td className={style.name} title={nickName || email}>{nickName || email}</td>
                        <td className={style.guessScore}>{score}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className={style.goal}>
              <div className={style.header}>
            Player Goals Ranking
              </div>
              <div className={style.tableContainer}>
                <table className={style.table}>
                  <tbody>
                    {playerRankList.map(({ flagUrl, name, goal } = {}, index) => (
                      <tr>
                        <td className={style.index}>{index + 1}</td>
                        <td className={style.name} title={name}><img alt="flag" src={flagUrl} /> {name}</td>
                        <td className={style.goalScore}>{goal}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
const mapState = state => ({
  user: HomeModule.getUser(state),
  teams: HomeModule.getTeam(state),
  getGoldenPlayer: HomeModule.getGoldenPlayers(state),
  userRankList: HomeModule.getUserRankSorted(state),
  playerRankList: HomeModule.getPlayerRankSorted(state),
  loading: HomeModule.getLoading(state),
  loaded: HomeModule.getLoaded(state),
});

const mapDispath = ({
  init: HomeModule.init,
  postUser: HomeModule.postUser,
});

export default connect(mapState, mapDispath)(Home);
