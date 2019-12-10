const ws = new WebSocket('ws://localhost:4000/');


ws.onmessage = function(event) {
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
  // https://stackoverflow.com/questions/2368784/draw-on-html5-canvas-using-a-mouse
  // https://stackoverflow.com/a/18384343/1839099 thanks Sam Jones
  var canvas = document.querySelector('#paint');
  ctx = canvas.getContext('2d');

  var sketch = document.querySelector('#sketch');
  var sketch_style = getComputedStyle(sketch);
  canvas.width = parseInt(sketch_style.getPropertyValue('width'));
  canvas.height = parseInt(sketch_style.getPropertyValue('height'));

  var mouse = { x: 0, y: 0 }, last_mouse = { x: 0, y: 0 };

  /* Mouse Capturing Work */
  canvas.addEventListener('mousemove', function(e) {
      last_mouse.x = mouse.x;
      last_mouse.y = mouse.y;

      mouse.x = e.pageX - this.offsetLeft;
      mouse.y = e.pageY - this.offsetTop;
  }, false);

  /* Drawing on Paint App */
  ctx.lineWidth = 5;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.strokeStyle = 'black';

  canvas.addEventListener('mousedown', function(e) {
      canvas.addEventListener('mousemove', onPaint, false);
  }, false);

  canvas.addEventListener('mouseup', function() {
      canvas.removeEventListener('mousemove', onPaint, false);
  }, false);

  // This is the only mod for sharing, original commented out.
  var onPaint = function() {
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
