const SocketlessServer = require('../../server');
const WebSocket = require('ws');
const express = require('express');
const bodyParser = require('body-parser');

const API_SERVER_PORT=3000;
const SOCKETLESS_WS_URL='ws://localhost:4000/';

new SocketlessServer();

const api = express();
api.listen(API_SERVER_PORT, () => {
  console.log("Listening for serverless API requests on port "
    + API_SERVER_PORT);
});
//api.use(bodyParser.json());
api.post('/api/onMsg', bodyParser.text(), require('./api/onMsg'));
api.get('/api/onConnect', require('./api/onConnect'));

const ws = new WebSocket(SOCKETLESS_WS_URL);
ws.on('open', function open() {
  console.log('client open');

  ws.on('message', data => {
    console.log('browser received: ', data.toString());
  })

  let cmd = { type: 'join', room: 'new2irc' };
  ws.send(JSON.stringify(cmd));

  cmd = { type: 'post', room: 'new2irc', message: 'hi' };
  ws.send(JSON.stringify(cmd));

  setTimeout(() => {
    let cmd = { type: 'post', room: 'new2irc', message: 'hi' };
    ws.send(JSON.stringify(cmd));
  }, 500);


});
