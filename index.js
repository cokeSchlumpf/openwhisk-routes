const _ = require('lodash');
const Router = require('router');

const defaultOptions = {
  init: () => {},
  destruct: () => {},
  ignoreProperties: []
}

const createRequest = (params, options) => ({
  body: _.pickBy(params, (value, key) => key.startsWith('__') || _.indexOf(options.ignoreProperties, key) > -1),
  url: params.__ow_path || '/',
  method: (params.__ow_method || 'get').toUpperCase(),
  params: {},
  query: params.__ow_query || '',
  wsk: params
});

const end = (contenttype, body) => (resolve, reject, options = {}) => resolve({
  statusCode: options.status || 200,
  headers: Object.assign({}, options.headers || {}, { 'Content-Type': contenttype }),
  body: body
});

const createResponse = (resolve, reject, options = {}) => ({
  header: (name, value) => createResponse(resolve, reject, Object.assign({}, options, { headers: Object.assign({}, options.headers, { [name]: value }) })),
  status: (status) => createResponse(resolve, reject, Object.assign({}, options, { status })),
  
  html: (html) => end('text/html', html)(resolve, reject, options),
  json: (json) => end('application/json', new Buffer(JSON.stringify(json, null, 2)).toString('base64'))(resolve, reject, options),
  send: (text) => end('text/plain', text)(resolve, reject, options),
  sendStatus: (status) => end('application/json')(resolve, reject, Object.assign({}, options, { status })),
  redirect: (location) => createResponse(resolve, reject, { headers: { location }, statusCode: 302 }),
  ok: () => end('text/plain')(resolve, reject, options)
});

module.exports = (init, customOptions = {}) => (params = {}) => new Promise((resolve, reject) => {
  const options = _.assign({}, defaultOptions, customOptions);
  const app = Router({ mergeParams: true });

  options.init();
  init(app);
  app.use((req, res) => res.status(404).send('Not found'));
  app(createRequest(params), createResponse(resolve, reject, {}), (error, response) => { })
  options.destruct();
});