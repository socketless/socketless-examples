const SocketlessClient = require('socketless-client');
const socketless = new SocketlessClient();

module.exports = (req, res) => {

  console.log('onMsg', req.query, req.body);
  const imr = socketless.incoming(req);
  imr.addTag('default');
  res.sendStatus(200);
  
}
