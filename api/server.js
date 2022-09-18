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

app.get('/services/', (req, res) => {
  res.render('./services', { services: require('./data/services.json').services, title: '🔦 Services' });
});

app.get('/services/:name/', (req, res) => {
  const serviceIndex = require('./data/services.json').services.findIndex(serviceData => serviceData.id.toLowerCase() === req.params.name.toLowerCase());

  if (serviceIndex === -1) {
    res.sendFile(`${__dirname}/error/404.html`);
    return;
  }

  res.render('./servicePage', { serviceData: require('./data/services.json').services[serviceIndex] });
});

app.get('/services/tag/:name/', (req, res) => {
  let filteredServices = [];
  require('./data/services.json').services.forEach(serviceData => {
    if (serviceData.tags.indexOf(req.params.name) !== -1) filteredServices[filteredServices.length] = serviceData;
  });

  if (filteredServices.length === 0) {
    res.sendFile(`${__dirname}/error/404.html`);
    return;
  }

  res.render('./services', { services: filteredServices, title: `<a href="/services">🔦 Services</a> > #${req.params.name}` });
});

app.use((req, res, next) => {
  res.sendFile(`${__dirname}/error/404.html`);
});

let server = app.listen(3000, function(){
  console.log("Node.js is listening to PORT:" + server.address().port);
});