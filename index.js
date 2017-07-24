const _ = require('lodash');
const Router = require('router');
const statusCodes = require('./statuscodes.js');

const defaultOptions = {
  init: () => { },
  destruct: () => { },
  ignoreProperties: []
}

const createRequest = (params, options) => ({
  body: _.pickBy(params, (value, key) => !(key.startsWith('__') || _.indexOf(options.ignoreProperties, key) > -1)),
  url: params.__ow_path || '/',
  headers: params.__ow_headers || {},
  method: (params.__ow_method || 'get').toUpperCase(),
  params: {},
  query: params.__ow_query || '',
  wsk: params
});

class Response {
  constructor(resolve, reject, options = {}) {
    this.resolve = resolve;
    this.reject = reject;
    this.options = _.assign({}, { headers: {}, status: 200 }, options);
    this.body = undefined;
  }

  end() {
    this.resolve({
      statusCode: this.options.status,
      headers: this.options.headers,
      body: this.body
    });
  }

  setContentType(value) {
    this.setHeader('Content-Type', value);
  }

  setHeader(name, value) {
    this.options.headers[name] = value;
  }

  header(name, value) {
    this.setHeader(name, value);
    return this;
  }

  status(status) {
    this.options.status = status;
    return this;
  }

  html(html) {
    this.setContentType('text/html');
    this.body = html;
    this.end();
  }

  json(json) {
    this.setContentType('application/json');
    this.body = new Buffer(JSON.stringify(json, null, 2)).toString('base64');
    this.end();
  }

  redirect(location) {
    this.status(302).header('location', location).end();
  }

  send(body) {
    if (_.isString(body)) {
      this.html(body);
    } else {
      this.json(body);
    }
  }

  sendStatus(status) {
    this.status(status).send(statusCodes.default(status));
  }
}

module.exports = (init, customOptions = {}) => (params = {}) => new Promise((resolve, reject) => {
  const options = _.assign({}, defaultOptions, customOptions);
  const app = Router({ mergeParams: true });

  options.init(params);
  init(app);
  app.use((req, res) => res.sendStatus(404));
  const request = createRequest(params, options);
  app(request, new Response(resolve, reject), (error, response) => {
    if (error) {
      reject(error);
    }
  });
  options.destruct(params);
});