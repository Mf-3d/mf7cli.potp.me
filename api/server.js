const express = require('express');
const fs = require("node:fs");
const md = require('markdown-it')(
  {
    linkify: true,
    breaks: true
  }
);
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const listFiles = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap(dirent =>
    dirent.isFile() ? [`${dir}/${dirent.name}`] : listFiles(`${dir}/${dirent.name}`)
  )

const app = express();

app.use(`/style`, express.static(`${__dirname}/style`));
app.use(`/js`, express.static(`${__dirname}/js`));
app.use(`/images`, express.static(`${__dirname}/images`));
app.set('view engine', 'ejs');
app.set('views', `${__dirname}/views`);

app.get('/', (req, res) => {
  const page = fs.readFileSync(require("path").join(__dirname, "contents", "index.md"), { encoding: "utf-8" });

  if (!page) {
    res.status(404);

    return;
  }

  let doc = new JSDOM(md.render(page));

  let title;
  if (!doc.window.document.body.firstElementChild) {
    title = "index";
  } else {
    title = doc.window.document.body.firstElementChild.innerHTML;
  }

  res.render(`./page.ejs`, {
    title,
    content: doc.window.document.body.innerHTML
  });
});

app.get("/news/([A-Za-z0-9])*/\:pageId", (req, res) => {
  const pageId = req.url.replace("/news/", "");
  if (pageId.toLowerCase() === "index") {
    res.redirect("/");
    return;
  }

  const page = fs.readFileSync(require("path").join(__dirname, "contents", `${pageId}.md`), { encoding: "utf-8" });

  if (!page) {
    console.log(require("path").join(__dirname, "contents", `${pageId}.md`))
    res.status(404);

    return;
  }

  let doc = new JSDOM(md.render(page));

  let title;
  if (!doc.window.document.body.firstElementChild) {
    title = require("path").basename(pageId, ".md");
  } else {
    title = doc.window.document.body.firstElementChild.innerHTML;
  }

  res.render(`./page.ejs`, {
    title,
    content: doc.window.document.body.innerHTML
  });
});

app.get("/news/:pageId", (req, res) => {
  console.log(req.params.pageId);
  if (req.params.pageId.toLowerCase() === "index") {
    res.redirect("/");
    return;
  }

  const page = fs.readFileSync(require("path").join(__dirname, "contents", `${req.params.pageId}.md`), { encoding: "utf-8" });

  if (!page) {
    console.log(require("path").join(__dirname, "contents", `${req.params.pageId}.md`))
    res.status(404);

    return;
  }

  let doc = new JSDOM(md.render(page));

  let title;
  if (!doc.window.document.body.firstElementChild) {
    title = require("path").basename(req.params.pageId, ".md");
  } else {
    title = doc.window.document.body.firstElementChild.innerHTML;
  }

  res.render(`./page.ejs`, {
    title,
    content: doc.window.document.body.innerHTML
  });
});

app.get('/api/v1/latestNews', (req, res) => {
  let dir = listFiles(`${__dirname}/contents`);
  // let dir = fs.readdirSync(`${__dirname}/contents/`);

  let newsDates = [];

  for (let i = 0; i < dir.length; i++) {
    if (i > 5) break;
    const newsStat = fs.statSync(dir[i], { encoding: "utf-8" });

    if (!newsStat.isDirectory()) {
      const newsDate = newsStat.mtime;
      const newsHtml = md.render(fs.readFileSync(dir[i], { encoding: "utf-8" }));
  
      let doc = new JSDOM(newsHtml);
  
      let title;
      if (!doc.window.document.body.firstElementChild) {
        title = require("path").basename(dir[i], ".md");
      } else {
        title = doc.window.document.body.firstElementChild.innerHTML;
      }
  
      newsDates[newsDates.length] = {
        date: new Date(newsDate.toLocaleString({ timeZone: 'Asia/Tokyo' })),
        fileName: dir[i],
        title,
        link: `/${require("node:path").join("news", require("node:path").dirname(dir[i]).replace(`${__dirname}/contents`, ""), require("node:path").basename(dir[i], ".md"))}`
      }
    }


  }

  let latestNews = newsDates.sort((a, b) => {
    return a.date.getTime() - b.date.getTime()
  });

  res.json(latestNews);
});

app.use((req, res, next) => {
  res.sendFile(`${__dirname}/error/404.html`);
});

let server = app.listen(3000, function(){
  console.log("Node.js is listening to PORT:" + server.address().port);
});