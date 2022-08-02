const express = require('express');

const app = express();

app.use(express.static('style'));
app.use(express.static('js'));
app.use(express.static('images'));

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/../index.html`);
});

app.get('/test', (req, res) => {
  res.sendFile(`${__dirname}/../home.html`);
});

app.use((req, res, next) => {
  res.sendFile(`${__dirname}/error/404.html`);
});

app.listen(3000, () => {
  console.log('サーバーが起動しました。');
});