const routes = require('./index')

const action = routes((action) => {
  action.get('/test', (req, res) => res.status(204).json({ ok: 'get' }));
  action.get('/test/:id', (req, res) => res.send(`The id is ${req.params.id}`));
});

action({
  __ow_method: 'get',
  __ow_path: '/test'
}).then(result => {
  console.log(JSON.stringify(result));
});

action({
  __ow_method: 'get',
  __ow_path: '/test/12'
}).then(result => {
  console.log(JSON.stringify(result));
});