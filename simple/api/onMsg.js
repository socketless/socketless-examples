const SocketlessClient = require('socketless-client');
const socketless = new SocketlessClient();

module.exports = (req, res) => {

  console.log('onMsg', req.query, req.body);
  const sid = req.query.sid;
  const msg = req.body;

  req.on('data', data=>console.log(5, data.toString()));

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
