const chai = require('chai');
const routes = require('../index');

const expect = chai.expect;

const action = routes((action) => {
  action.get('/test-status-json', (req, res) => res.status(204).json({ ok: 'get' }));
  action.get('/test-status-sendjson', (req, res) => res.status(204).send({ ok: 'get' }));
  action.get('/test-html', (req, res) => res.html('Hello World!'));
  action.get('/test-sendhtml', (req, res) => res.send('Hello World!'));

  action.get('/testhtml', (req, res) => res.send('Hallo Freunde!'));
  action.get('/test/:id', (req, res) => res.send(`The id is ${req.params.id}`));
});

describe('openwhisk-routes', () => {
  describe('#status(), #json(), #send() and #html()', () => {
    it('/test-status-json should response with a JSON with HTTP status 204', (done) => {
      action({ __ow_method: 'get', __ow_path: '/test-status-json' })
        .then(result => {
          expect(result.headers['Content-Type']).to.equal('application/json');
          expect(result.statusCode).to.equal(204);
          expect(result.body).not.to.be.empty;
        }).then(done, done);
    });

    it('/test-status-sendjson should response with a JSON with HTTP status 204', (done) => {
      action({ __ow_method: 'get', __ow_path: '/test-status-sendjson' })
        .then(result => {
          expect(result.headers['Content-Type']).to.equal('application/json');
          expect(result.statusCode).to.equal(204);
          expect(result.body).not.to.be.empty;
        }).then(done, done);
    });

    it('/test-html should response with a text/html document with HTTP status 200', (done) => {
      action({ __ow_method: 'get', __ow_path: '/test-html' })
        .then(result => {
          expect(result.headers['Content-Type']).to.equal('text/html');
          expect(result.statusCode).to.equal(200);
          expect(result.body).to.equal('Hello World!')
        }).then(done, done);
    });

    it('/test-sendhtml should response with a text/html document with HTTP status 200', (done) => {
      action({ __ow_method: 'get', __ow_path: '/test-sendhtml' })
        .then(result => {
          expect(result.headers['Content-Type']).to.equal('text/html');
          expect(result.statusCode).to.equal(200);
          expect(result.body).to.equal('Hello World!')
        }).then(done, done);
    });

    it('/not-existing should response with a text/html document with HTTP status 404', (done) => {
      action({ __ow_method: 'get', __ow_path: '/not-existing' })
        .then(result => {
          expect(result.headers['Content-Type']).to.equal('text/html');
          expect(result.statusCode).to.equal(404);
          expect(result.body).to.equal('Not Found')
        }).then(done, done);
    });
  });
});

/*



action({
  __ow_method: 'get',
  __ow_path: '/test/12'
}).then(result => {
  console.log(JSON.stringify(result));
});
*/