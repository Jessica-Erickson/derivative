const express = require('express');
const app = express();

app.locals.name = 'Derivative';

app.use( express.json() );
app.use( express.static('public') );

app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), () => {
  console.log(`${app.locals.name} is running on ${app.get('port')}`);
});