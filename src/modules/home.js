import { Map } from 'immutable';
import { createSelector } from 'reselect';
import { CALL_GQL } from 'store/middleware/client';

/*****************************************************************************
 * Selectors
 *****************************************************************************/

const combineMatchAndTeam = (matches = [], teams = [], matchGuessRecords = []) => {
  const result = [];
  matches.forEach(({ homeTeam, awayTeam, _id, ...others } = {}) => {
    const { name: homeTeamName, flagUrl: homeTeamFlag } = teams.find(({ _id: id }) => (String(id) === String(homeTeam))) || {};
    const { name: awayTeamName, flagUrl: awayTeamFlag } = teams.find(({ _id: id }) => (String(id) === String(awayTeam))) || {};
    const { guess } = matchGuessRecords.find(({ match } = {}) => String(_id) === String(match)) || {};

    let guessName;
    if (guess) {
      if (String(guess) === String(homeTeam)) {
        guessName = homeTeamName;
      } else if (String(guess) === String(awayTeam)) {
        guessName = awayTeamName;
      } else {
        guessName = guess;
      }
    } else {
      guessName = undefined;
    }


    result.push({
      homeTeam,
      awayTeam,
      _id,
      ...others,
      homeTeamName,
      homeTeamFlag,
      awayTeamName,
      awayTeamFlag,
      guess,
      guessName,
    });
  });

  result.sort((a, b) => a.matchIndex - b.matchIndex);

  return result;
};

export const getUser = state => state.getIn(['modules', 'home', 'user']);
export const getTz = state => state.getIn(['modules', 'home', 'tz']);

export const getTeam = state => state.getIn(['modules', 'home', 'team']);
export const getMatch = state => state.getIn(['modules', 'home', 'match']);

export const onGoingMatch = createSelector(
  getTeam,
  getMatch,
  getUser,
  (teams = [], matches = [], user = {}) => {
    const { matchGuessRecords = [] } = user;
    const filteredMatches = matches.filter(({ started, available } = {}) => !started && available) || [];
    return combineMatchAndTeam(filteredMatches, teams, matchGuessRecords);
  },
);

export const getPlayers = createSelector(
  getTeam,
  (teams = []) => {
    let result = [];
    teams.forEach(({ _id, name, flagUrl, players = [] } = {}) => {
      const teamPlays = players.map((player = {}) => ({ ...player, teamId: _id, teamName: name, flagUrl }));
      result = [...result, ...teamPlays];
    });
    console.log(result);
    return result;
  },
);

export const getGoldenPlayers = createSelector(
  getPlayers,
  getUser,
  (players = [], { goldenPlayerGuessRecord } = {}) => {
    const { name, teamId: team } = players.find(({ _id } = {}) => String(_id) === String(goldenPlayerGuessRecord)) || {};
    return { name, team };
  },

);

export const doneMatch = createSelector(
  getTeam,
  getMatch,
  (teams = [], matches = []) => {
    const filteredMatches = matches.filter(({ started, available } = {}) => started && available) || [];
    return combineMatchAndTeam(filteredMatches, teams);
  },
);

export const togoMatch = createSelector(
  getTeam,
  getMatch,
  (teams = [], matches = []) => {
    const filteredMatches = matches.filter(({ started, available } = {}) => !started && !available) || [];
    return combineMatchAndTeam(filteredMatches, teams);
  },
);

/*****************************************************************************
 * GraphQL
 *****************************************************************************/
const graphqlUser = `{
  User {
  _id
  nickName
  email
  timezone
  matchGuessRecords{
  _id
  match
  guess
  }
  guessScore
  goldenPlayerGuessRecord
}}`;

const graphqlTz = `{
  Tz{
_id
index
value
text
place
offset
}}`;

const graphqlMatch = `{
  Match{
  matchIndex
  homeTeam
  awayTeam
  homeTeamScore
  awayTeamScore
  startTime
  stage
  label
  winner
  available
  endWay
  started
  _id
}
}`;

const graphqlTeam = `{
  Teams{
_id
name
flagUrl
group
groupScore
players{
_id
name
age
goal
pos
}
}
}`;

const graphqlUsersRanking = `{
  UsersRanking {
  nickName
  email
  guessScore
  goldenPlayerGuessRecord
}}`;


/*****************************************************************************
 * Types & Action Creators
 *****************************************************************************/

/** ******* USER ********/

export const QUERY_USER_REQUEST = 'modules/home/QUERY_USER_REQUEST';
export const QUERY_USER_SUCCESS = 'modules/home/QUERY_USER_SUCCESS';
export const QUERY_USER_FAILURE = 'modules/home/QUERY_USER_FAILURE';

export const queryUser = () => ({
  [CALL_GQL]: {
    types: [QUERY_USER_REQUEST, QUERY_USER_SUCCESS, QUERY_USER_FAILURE],
    promise: client => client.query(graphqlUser),
  },
});

/** ******* Timezone ********/
export const QUERY_TZ_REQUEST = 'modules/home/QUERY_TZ_REQUEST';
export const QUERY_TZ_SUCCESS = 'modules/home/QUERY_TZ_SUCCESS';
export const QUERY_TZ_FAILURE = 'modules/home/QUERY_TZ_FAILURE';

export const queryTZ = () => ({
  [CALL_GQL]: {
    types: [QUERY_TZ_REQUEST, QUERY_TZ_SUCCESS, QUERY_TZ_FAILURE],
    promise: client => client.query(graphqlTz),
  },
});

/** ******* Matches ********/
export const QUERY_MATCH_REQUEST = 'modules/home/QUERY_MATCH_REQUEST';
export const QUERY_MATCH_SUCCESS = 'modules/home/QUERY_MATCH_SUCCESS';
export const QUERY_MATCH_FAILURE = 'modules/home/QUERY_MATCH_FAILURE';

export const queryMatch = () => ({
  [CALL_GQL]: {
    types: [QUERY_MATCH_REQUEST, QUERY_MATCH_SUCCESS, QUERY_MATCH_FAILURE],
    promise: client => client.query(graphqlMatch),
  },
});

/** ******* Teams ********/
export const QUERY_TEAM_REQUEST = 'modules/home/QUERY_TEAM_REQUEST';
export const QUERY_TEAM_SUCCESS = 'modules/home/QUERY_TEAM_SUCCESS';
export const QUERY_TEAM_FAILURE = 'modules/home/QUERY_TEAM_FAILURE';

export const queryTeam = () => ({
  [CALL_GQL]: {
    types: [QUERY_TEAM_REQUEST, QUERY_TEAM_SUCCESS, QUERY_TEAM_FAILURE],
    promise: client => client.query(graphqlTeam),
  },
});

export const POST_USER_REQUEST = 'modules/home/POST_USER_REQUEST';
export const POST_USER_SUCCESS = 'modules/home/POST_USER_SUCCESS';
export const POST_USER_FAILURE = 'modules/home/POST_USER_FAILURE';

export const postUserKey = (key, value) => ({
  [CALL_GQL]: {
    types: [POST_USER_REQUEST, POST_USER_SUCCESS, POST_USER_FAILURE],
    promise: client => client.mutation(
      `{
        User(
          data:{
            ${key}: "${value}"
          }
        ) {
          ${key}
        }
      }`,
    ),
  },
});

export const postUser = (key, value) => async (dispatch) => {
  await dispatch(postUserKey(key, value));
  dispatch(queryUser());
};

export const POST_GUESS_RECORD_REQUEST = 'modules/home/POST_GUESS_RECORD_REQUEST';
export const POST_GUESS_RECORD_SUCCESS = 'modules/home/POST_GUESS_RECORD_SUCCESS';
export const POST_GUESS_RECORD_FAILURE = 'modules/home/POST_GUESS_RECORD_FAILURE';

export const postUserGuess = (id, guess) => ({
  [CALL_GQL]: {
    types: [POST_GUESS_RECORD_REQUEST, POST_GUESS_RECORD_SUCCESS, POST_GUESS_RECORD_FAILURE],
    promise: client => client.mutation(
      `{
        User(
          data:{
            matchGuessRecord: {
              match: "${id}",
              guess: "${guess}"
            }
          }
        ) {
          matchGuessRecords{
            match
            guess
          }
        }
      }`,
    ),
  },
});

export const postUserGuessRecord = (id, guess) => async(dispatch) => {
  await dispatch(postUserGuess(id, guess));
  dispatch(queryUser());
};


export const init = () => (dispatch) => {
  dispatch(queryUser());
  dispatch(queryTZ());
  dispatch(queryMatch());
  dispatch(queryTeam());
};

/*****************************************************************************
  * Reducer
  *****************************************************************************/

const initialState = Map({
  user: {},
  tz: [],
});

export default (state = initialState, action) => {
  const { type, response } = action;
  switch (type) {
    case QUERY_USER_SUCCESS:
      return state.setIn(['user'], response.data.User);
    case QUERY_TZ_SUCCESS:
      return state.setIn(['tz'], response.data.Tz);
    case QUERY_MATCH_SUCCESS:
      return state.setIn(['match'], response.data.Match);
    case QUERY_TEAM_SUCCESS:
      return state.setIn(['team'], response.data.Teams);
    default:
      return state;
  }
};
