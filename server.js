const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.locals.name = 'Derivative';

let picture = {};
let unsortedPixels = [];

io.on('connection', (socket) => {
  const Pixel = (hex) => {
    this.hex = hex;
    this.adjacent = [];
  }

  socket.on('disconnect', () => {

  });

  socket.on('data', (data) => {
    const imageData = data.data;
    const width = data.width;
    for (var i = 0; i < imageData.length; i += 4) {
      const x = ((i / 4) % width);
      const y = Math.floor((i / 4) / width);
      const coordinates = x + '-' + y;
      const newR = '0' + imageData[i].toStrin(16);
      const newG = '0' + imageData[i + 1].toString(16);
      const newB = '0' + imageData[i + 2].toString(16);
      const hexValue = newR.slice(-2) + newG.slice(-2) + newB.slice(-2);
      const top = x + '-' + (y - 1);
      const right = (x + 1) + '-' + y;
      const bottom = x + '-' + (y + 1);
      const left = (x - 1) + '-' + y;

      picture[coordinates] = new Pixel(hexValue);

      if ((y - 1) >= 0) {
        picture[coordinates].adjacent.push(top);
      }
      if ((x + 1) < width) {
        picture[coordinates].adjacent.push(right);
      }
      if ((y + 1) < height) {
        picture[coordinates].adjacent.push(bottom);
      }
      if ((x - 1) >= 0) {
        picture[coordinates].adjacent.push(left);
      }

      unsortedPixels.push(coordinates);
      console.log(coordinates);
      // socket.emit('received', coordinates);
    }
  });
});

app.use( express.json() );
app.use( express.static('public') );

app.set('port', process.env.PORT || 3000);

http.listen(app.get('port'), () => {
  console.log(`${app.locals.name} is running on ${app.get('port')}`);
});