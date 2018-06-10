import superagent from 'superagent';

const methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

class ApiClient {
  constructor () {
    methods.forEach((method) => {
      this[method.toLowerCase()] = (path, {
        params,
        data,
        responseType,
      } = {}) => {
        const request = superagent(method, path);

        if (params) request.query(params);
        if (data) request.send(data);
        if (responseType) request.responseType(responseType);

        const promise = new Promise((resolve, reject) => {
          request.end((error, { body, clientError, serverError } = {}) => {
            // api request error handle
            // http://visionmedia.github.io/superagent/#error-handling
            // 4xx or 5xx response with super agent are considered an error by default
            if (error && (clientError || serverError)) {
              return reject(error);
            }

            return error ? reject(error) : resolve(body);
          });
        });

        return promise;
      };
    });
  }
}

const client = new ApiClient();
export default client;
