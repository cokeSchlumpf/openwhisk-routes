# openwhisk-routes - Implement routes within your OpenWhisk actions [![dependency status](https://david-dm.org/cokeSchlumpf/openwhisk-routes.svg)](https://david-dm.org/cokeSchlumpf/openwhisk-routes)

This package allows you to implement basic routing within an OpenWhisk web action. 

See also:

* [OpenWhisk actions](https://console.bluemix.net/docs/openwhisk/openwhisk_actions.html#openwhisk_actions)
* [OpenWhisk WebActions](https://console.bluemix.net/docs/openwhisk/openwhisk_webactions.html#openwhisk_webactions)

Example:

```javascript
const routes = require('openwhisk-routes');

exports.main = routes((action) => {
  // Create a plain text response
  action.get('/', (req, res) => res.send('hello world!'));

  // Create a JSON response
  action.get('/json', (req, res) => res.json({ ok: 'get' }));

  // Use path parameters
  action.get('/params/:id', (req, res) => res.json({ id: req.params.id }));
});
```

## Installation

```bash
npm install --save openwhisk-routes
```

## API details

The package exposes one function which accepts another function and returns a valid OpenWhisk action. This function will be invoked during action initialisation and is called with the `action` instance.

```javascript
const routes = require('openwhisk-routes');

exports.main = routes((action) => {
  // Defined your routes
  action.get('/', (request, response, next) => {
    next();
  })
}
```

### Action

`action` is derived from the [routes npm package](https://www.npmjs.com/package/routes).

### Request

Properties:

* `url` - The actual url of the web action call.
* `method` - The HTTP method used to call the web action.
* `params` - The url-params. E.g. `/:id` will be available via `params.id`.
* `query` - The query string of the Url.
* `wsk` - The original OpenWhisk action parameters.

### Response

Methods:

* `header(name, value)` - Add a header to the response.
* `status(statuscode)` - Override the default HTTP response status.

* `html(htmlcontent)` - Send a response with HTML content.
* `json(object)` - Send a response with a JSON object as content.
* `send(text)` - Send a response with plain text content.
* `redirect(location)` - Send a HTTP redirect.