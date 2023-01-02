const express = require("express");
const request = require("request");
const app = express();

const sites = [
  {
    name: "えむえふねっと！",
    url: [
      "https://mf7cli.potp.me",
      // "https://mf7cli.net"
    ]
  },
  {
    name: "Clii for LINE",
    url: [
      "https://clii.mf7cli.ml",
      "https://clii.vercel.app"
    ]
  },
  {
    name: "mf7cli-RSS",
    url: [
      "https://mf7cli-rss.vercel.app"
    ]
  },
  {
    name: "Dataset-Maker for thinkerAI",
    url: [
      "https://dataset-maker.vercel.app"
    ]
  },
  {
    name: "mf7cli-Developments",
    url: [
      "https://mf7cli.tk",
      "https://mf7cli.hide.li"
    ]
  },
  {
    name: "mf7cli.ml",
    url: [
      "https://mf7cli.ml"
    ]
  },
  {
    name: "😟😟.tk",
    url: [
      "https://xn--928ha.tk"
    ]
  },
  {
    name: "kn4655.ml",
    url: [
      "https://kn4655.ml"
    ]
  },
  {
    name: "mf-3d.github.io",
    url: [
      "https://mf-3d.github.io"
    ]
  },
  {
    name: "mf7cli-BBS",
    url: [
      "https://bbs.mf7cli.potp.me"
    ]
  }
];

/** @returns { Promise<{ error: any; body: any; response: request.Response, responseTime: number }> } */
const rqt = (url) => {
  start = new Date();

  return new Promise((resolve, reject)=> {
    request(url, (error, response, body)=> {
      const responseTime = (new Date(new Date() - start)).getMilliseconds();

      resolve({ error, body, response, responseTime });
    });
  });
}

app.use("/style", express.static(`${__dirname}/style`));
app.use("/image", express.static(`${__dirname}/static/image`));
app.use("/files", express.static(`${__dirname}/static/files`));

app.get("/", (req, res) => {
  res.sendFile(`${__dirname}/public/index.html`);
});

app.get("/status", (req, res) => {
  res.sendFile(`${__dirname}/public/status.html`);
});

app.get("/links", (req, res) => {
  res.sendFile(`${__dirname}/public/links.html`);
});

app.get("/lab", (req, res) => {
  res.sendFile(`${__dirname}/public/lab.html`);
});

app.get("/api/v1/background_image/random", (req, res) => {
  const imageList = [ "1.png", "2.png" ];
  let rnd = Math.floor(Math.random() * (imageList.length - 0) + 0);
  res.sendFile(`${__dirname}/static/background_image/${imageList[rnd]}`);
});

app.get("/api/v1/statusCode/get/all", async (req, res) => {
  let status = [];

  for (const i in sites) {
    const urls = sites[i];
    const siteStatus = [];
    for (const i in urls.url) {
      const url = urls.url[i];

      const res = await rqt(url);
      if (res.error) {
        siteStatus[siteStatus.length] = {
          name: urls.name,
          url,
          statusCode: 0,
          ping: res.responseTime
        }
      } else {
        siteStatus[siteStatus.length] = {
          name: urls.name,
          url,
          statusCode: res.response.statusCode,
          ping: res.responseTime
        }
      }
    }

    status[status.length] = siteStatus;
  }

  res.json(status);
});

app.use((req, res, next) => {
  res.sendFile(`${__dirname}/public/404.html`);
});

app.listen(3000, () => {
  console.log("サーバーが起動しました。")
});