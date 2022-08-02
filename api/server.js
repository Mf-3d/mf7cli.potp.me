const express = require('express');

const app = express();

app.use(`${__dirname}/api/style`, express.static('style'));
app.use(`${__dirname}/api/js`, express.static('js'));
app.use(`${__dirname}/api/images`, express.static('images'));

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

app.get('/test', (req, res) => {
  res.sendFile(`${__dirname}/home.html`);
});

app.use((req, res, next) => {
  res.sendFile(`${__dirname}/error/404.html`);
});
let server = app.listen(3000, function(){
  console.log("Node.js is listening to PORT:" + server.address().port);
});