const SocketlessClient = require('socketless-client');
const socketless = new SocketlessClient();

module.exports = (req, res) => {

  console.log('onMsg', req.query, req.body);
  const imr = socketless.incoming(req);
  const msg = JSON.parse(req.body);

  switch (msg.type) {
    case 'nick':
      //socketless.setSocketData({ nick: msg.nick });
      break;

    case 'join':
      imr.setMessageData('sid', 'abc')
      imr.addTag(msg.room);
      // send existing joins?
      break;

    case 'post':
      socketless.sendToTag(msg.room, msg.message);
      break;

  }

  res.sendStatus(200);
  /*
  res.json({
    body: req.body,
    query: req.query,
    cookies: req.cookies
  });
  */
}
