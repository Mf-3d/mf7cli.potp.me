const express = require('express');

const app = express();

app.use(express.static('style'));
app.use(express.static('js'));
app.use(express.static('images'));

app.get('/', (req, res) => {
  res.sendFile(`./index.html`);
});

app.get('/test', (req, res) => {
  res.sendFile(`./home.html`);
});

app.use((req, res, next) => {
  res.sendFile(`./error/404.html`);
});
let server = app.listen(3000, function(){
  console.log("Node.js is listening to PORT:" + server.address().port);
});