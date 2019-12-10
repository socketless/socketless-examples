const SocketlessServer = require('../../server');

const express = require('express');
const bodyParser = require('body-parser');
const handler = require('serve-handler');

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
api.get('*', handler);
