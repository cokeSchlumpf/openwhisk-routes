const routes = require('./index');

const action = routes((action) => {
  action.get('/test', (req, res) => {
    console.log(res);
    res.status(204).json({ ok: 'get' });
  });
  action.get('/test/:id', (req, res) => res.send(`The id is ${req.params.id}`));
});

action({ __ow_method: 'get', __ow_path: '/test' })
  .then(result => {
    console.log(result);
  })
  .catch(error => {
    console.log(error);
  });