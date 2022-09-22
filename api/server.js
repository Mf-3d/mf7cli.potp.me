const express = require('express');

const app = express();

app.use(`/style`, express.static(`${__dirname}/style`));
app.use(`/js`, express.static(`${__dirname}/js`));
app.use(`/images`, express.static(`${__dirname}/images`));
app.set('view engine', 'ejs');
app.set('views', `${__dirname}/views`);

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/static/home.html`);
});

// サービス類
app.get('/collections/', (req, res) => {
  res.render('./services', { services: require('./data/services.json').services, title: '🔦 Collections' });
});

app.get('/collections/:name/', (req, res) => {
  const serviceIndex = require('./data/services.json').services.findIndex(serviceData => serviceData.id.toLowerCase() === req.params.name.toLowerCase());

  if (serviceIndex === -1) {
    res.sendFile(`${__dirname}/error/404.html`);
    return;
  }

  res.render('./servicePage', { serviceData: require('./data/services.json').services[serviceIndex], title: `<a href="/collections">🔦 Collections</a> > ${req.params.name}` });
});

app.get('/collections/tag/:name/', (req, res) => {
  let filteredServices = [];
  require('./data/services.json').services.forEach(serviceData => {
    if (serviceData.tags.indexOf(req.params.name) !== -1) filteredServices[filteredServices.length] = serviceData;
  });

  if (filteredServices.length === 0) {
    res.sendFile(`${__dirname}/error/404.html`);
    return;
  }

  res.render('./services', { services: filteredServices, title: `<a href="/collections">🔦 Collections</a> > #${req.params.name}` });
});

// ニュース類
app.get('/news/', async (req, res) => {
  const blog = await (require('./lib/promiseRqt'))('https://blog.mf7cli.repl.co/api/blog');
  res.render('./news', { news: JSON.parse(blog), title: '📓 News' });
});

app.get('/news/:id/', async (req, res) => {
  const blog = await (require('./lib/promiseRqt'))('https://blog.mf7cli.repl.co/api/blog');
  
  res.render('./newsArticle', { news: JSON.parse(blog).data[req.params.id], title: `<a href="/news">🔦 📓 News</a> > ${req.params.id}` });
});

app.use((req, res, next) => {
  res.sendFile(`${__dirname}/error/404.html`);
});

let server = app.listen(3000, function(){
  console.log("Node.js is listening to PORT:" + server.address().port);
});