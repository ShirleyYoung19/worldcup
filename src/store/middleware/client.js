export const CALL_API = 'Call API';
export const CALL_GQL = 'Call GQL';

const API_METHODS = ['get', 'post', 'put', 'patch', 'delete'];
const GQL_METHODS = ['query', 'mutation'];

const protocol = 'https';
const apiHost = 'worldcup-2018.corp.seedlinktech.com';
const apiProxy = `${protocol}://${apiHost}`;


export default function clientMiddleware (client) {
  const apiClient = API_METHODS.reduce((result, method) => ({
    ...result,
    [method]: (path, params) => (
      client[method](path, params)
    ),
  }), {});


  const gqlClient = GQL_METHODS.reduce((result, method) => ({
    ...result,
    [method]: (gql, args) => (
      client.post(`${apiProxy}/graphql`, {
        data: {
          query: `${method} ${gql}`,
          ...args,
        },
      })
    ),
  }), {});

  return ({ dispatch, getState }) => next => (action) => {
    const callAPI = action[CALL_API];
    const callGQL = action[CALL_GQL];

    const finalCall = callAPI || callGQL;
    if (!finalCall) return next(action);

    const {
      types,
      promise,
      shouldRequest = () => true,
    } = finalCall;

    if (!promise || !types) return next(action);

    if (
      !Array.isArray(types) ||
      types.length !== 3 ||
      !types.every(type => typeof type === 'string')
    ) {
      throw new Error('Expected an array of three string types.');
    }

    if (!promise || !typeof promise === 'function') {
      throw new Error('Expected promise to be a function.');
    }

    const actionWith = (data) => {
      const finalAction = { ...action, ...data };
      delete finalAction[CALL_API];
      delete finalAction[CALL_GQL];
      return finalAction;
    };

    const [REQUEST, SUCCESS, FAILURE] = types;

    // stop request
    if (!shouldRequest(getState())) return Promise.resolve(dispatch(actionWith({ type: SUCCESS })));

    const actionPromise = promise(callGQL ? gqlClient : apiClient);
    dispatch(actionWith({ type: REQUEST }));

    return actionPromise.then(
      (response) => {
        if (callGQL && response.errors) throw response.errors;

        return dispatch(actionWith({
          type: SUCCESS,
          response,
        }));
      },
    ).catch(
      (error) => {
        dispatch(actionWith({
          type: FAILURE,
          error,
        }));
        throw (error);
      },
    );
  };
}
