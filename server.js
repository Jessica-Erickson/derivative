const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.locals.name = 'Derivative';
app.locals.picture = {};

io.on('connection', (socket) => {
  socket.emit('message', `A new user, ${Date.now()}, has connected`);

  socket.on('message', (message) => {

  });

  socket.on('disconnect', () => {

  });
});

app.use( express.json() );
app.use( express.static('public') );

app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), () => {
  console.log(`${app.locals.name} is running on ${app.get('port')}`);
});