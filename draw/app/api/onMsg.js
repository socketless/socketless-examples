const SocketlessClient = require('socketless-client');
const socketless = new SocketlessClient();

module.exports = async (req, res) => {

  console.log('onMsg', req.query, req.body);
  const imr = socketless.incoming(req);
  const msg = req.body;

  await socketless.sendToTag('default', req.body);

  //res.sendStatus(200);
  res.status(200).send('OK');
}
