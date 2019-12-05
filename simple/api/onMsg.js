const SocketlessClient = require('socketless-client');
const socketless = new SocketlessClient();

module.exports = (req, res) => {

  console.log('onMsg', req.body);
  const sid = req.body.sid;
  const msg = JSON.parse(req.body.data);

  switch (msg.type) {
    case 'nick':
      socketless.setSocketData({ nick: msg.nick });
      break;

    case 'join':
      socketless.addTag(sid, msg.room);
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
