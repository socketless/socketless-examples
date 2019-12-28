const PING_INTERVAL=2000;

const isProd = document.location.href === "https://draw.socketless.org/";
const url = isProd ? 'wss://sls.draw.socketless.org/' : 'ws://localhost:4000/';
const ws = new WebSocket(url);
let statusBox, statusText;
let lastPing, pingCheck;

function ping() {
  lastPing = Date.now();
  ws.send('SLS PING ' + lastPing);
  pingCheck = setInterval(checkPing, 500);
}

function checkPing() {
  const now = Date.now();
  const diff = now - lastPing;

  if (diff > 5000) {
    ws.close();
    ws.onclose();
  } else if (diff > 1000) {
    statusText.innerText = "Connected, latency: >" + Math.floor(diff/1000) + 's';
  }
}

ws.onopen = function() {
  if (!statusBox) return;
  statusBox.style.background = 'green';
  statusText.innerText = 'Connected';
  ping();
}

ws.onclose = function() {
  statusBox.style.background = 'red';
  statusText.innerText = 'Disconnected';
  clearInterval(pingCheck);
}

ws.onmessage = function(event) {
  if (event.data.substr(0, 9) === 'SLS PONG ') {
    const pingTime = parseInt(event.data.substr(9));
    const latency = Date.now() - pingTime;

    statusText.innerText = "Connected, latency: " + latency + "ms";
    clearInterval(pingCheck);
    setTimeout(ping, PING_INTERVAL);
    return;
  }

  const msg = JSON.parse(event.data);

  if (msg.type === 'paint') {
    ctx.beginPath();
    ctx.moveTo(msg.moveTo[0], msg.moveTo[1]);
    ctx.lineTo(msg.lineTo[0], msg.lineTo[1]);
    ctx.closePath();
    ctx.stroke();
  }
}

let ctx;
window.onload = function() {
  statusBox = document.getElementById('statusBox');
  statusText = document.getElementById('statusText');
  if (ws.readyState === 1)
    ws.onopen();

  // Loosely based on
  // https://stackoverflow.com/questions/2368784/draw-on-html5-canvas-using-a-mouse
  // https://stackoverflow.com/a/18384343/1839099 thanks Sam Jones
  var canvas = document.querySelector('#paint');
  ctx = canvas.getContext('2d');

  var sketch = document.querySelector('#sketch');
  var sketch_style = getComputedStyle(sketch);
  canvas.width = parseInt(sketch_style.getPropertyValue('width'));
  canvas.height = parseInt(sketch_style.getPropertyValue('height'));

  var mouse = { x: 0, y: 0 }, last_mouse = { x: 0, y: 0 };
  var isDrawing = false;

  /* Drawing on Paint App */
  ctx.lineWidth = 5;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.strokeStyle = 'black';

  function setDrawing(value) {
    return function(e) { e.preventDefault(); isDrawing = value; if (!value) mouse.x = mouse.y = null; }
  }

  function onMove(event) {
    if (!isDrawing)
      return;

    if (event.touches)
      event.preventDefault(); // don't scroll

    last_mouse.x = mouse.x;
    last_mouse.y = mouse.y;

    mouse.x = (event.touches ? event.touches[0] : event).pageX - this.offsetLeft;
    mouse.y = (event.touches ? event.touches[0] : event).pageY - this.offsetTop;

    if (last_mouse.x && last_mouse.y)
      paint();
  }

  canvas.addEventListener('mousedown', setDrawing(true), false);
  canvas.addEventListener('mouseup', setDrawing(false), false);
  canvas.addEventListener('mousemove', onMove, false);

  canvas.addEventListener('touchstart', setDrawing(true), false);
  canvas.addEventListener('touchend', setDrawing(false), false);
  canvas.addEventListener('touchmove', onMove, false);

  // This is the only mod for sharing, original commented out.
  var paint = function() {
    /*
      ctx.beginPath();
      ctx.moveTo(last_mouse.x, last_mouse.y);
      ctx.lineTo(mouse.x, mouse.y);
      ctx.closePath();
      ctx.stroke();
    */

    ws.send(JSON.stringify({
      type: 'paint',
      moveTo: [ last_mouse.x, last_mouse.y ],
      lineTo: [ mouse.x, mouse.y ]
    }));
  };
}
