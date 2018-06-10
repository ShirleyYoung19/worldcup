import { Map } from 'immutable';
import { createSelector } from 'reselect';
import { CALL_GQL } from 'store/middleware/client';

/*****************************************************************************
 * Selectors
 *****************************************************************************/
export const getUser = state => state.getIn(['modules', 'home', 'user']);
export const getTz = state => state.getIn(['modules', 'home', 'tz']);

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

const graphqlUsersRanking = `{
  UsersRanking {
  nickName
  email
  guessScore
  goldenPlayerGuessRecord
}}`;

const graphqlTeams = `{
  Teams {
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
}}`;

/*****************************************************************************
 * Types & Action Creators
 *****************************************************************************/

export const QUERY_USER_REQUEST = 'modules/home/QUERY_USER_REQUEST';
export const QUERY_USER_SUCCESS = 'modules/home/QUERY_USER_SUCCESS';
export const QUERY_USER_FAILURE = 'modules/home/QUERY_USER_FAILURE';

export const queryUser = () => ({
  [CALL_GQL]: {
    types: [QUERY_USER_REQUEST, QUERY_USER_SUCCESS, QUERY_USER_FAILURE],
    promise: client => client.query(graphqlUser),
  },
});

export const QUERY_TZ_REQUEST = 'modules/home/QUERY_TZ_REQUEST';
export const QUERY_TZ_SUCCESS = 'modules/home/QUERY_TZ_SUCCESS';
export const QUERY_TZ_FAILURE = 'modules/home/QUERY_TZ_FAILURE';

export const queryTZ = () => ({
  [CALL_GQL]: {
    types: [QUERY_TZ_REQUEST, QUERY_TZ_SUCCESS, QUERY_TZ_FAILURE],
    promise: client => client.query(graphqlTz),
  },
});

export const POST_USER_NICKNAME_REQUEST = 'modules/home/POST_USER_NICKNAME_REQUEST';
export const POST_USER_NICKNAME_SUCCESS = 'modules/home/POST_USER_NICKNAME_SUCCESS';
export const POST_USER_NICKNAME_FAILURE = 'modules/home/POST_USER_NICKNAME_FAILURE';

export const postUserKey = (key, value) => ({
  [CALL_GQL]: {
    types: [POST_USER_NICKNAME_REQUEST, POST_USER_NICKNAME_SUCCESS, POST_USER_NICKNAME_FAILURE],
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
    default:
      return state;
  }
};
