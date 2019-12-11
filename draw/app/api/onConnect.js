const SocketlessClient = require('socketless-client');
const socketless = new SocketlessClient();

module.exports = async (req, res) => {

  console.log('onConnect', req.query, req.body);
  const imr = socketless.incoming(req);
  await imr.addTag('default');

  //res.sendStatus(200);
  res.status(200).send('OK');
}
