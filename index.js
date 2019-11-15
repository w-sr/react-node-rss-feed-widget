
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const metascraper = require('metascraper')([
  require('metascraper-author')(),
  require('metascraper-date')(),
  require('metascraper-description')(),
  require('metascraper-image')(),
  require('metascraper-logo')(),
  require('metascraper-clearbit')(),
  require('metascraper-publisher')(),
  require('metascraper-title')(),
  require('metascraper-url')()
]);

const got = require('got');

let Parser = require('rss-parser');
let parser = new Parser();

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/api/feed', async function (req, res) {
  const reqUrl = req.body.url;

  try {
    let feed = await parser.parseURL(reqUrl);

    const metaDataList1 = feed.items.map(async (item) => {
      const { body: html, url } = await got(item.link)
      const metadata = await metascraper({ html, url })
      return metadata;
    })
    const metaDataList = await Promise.all([...metaDataList1]);
    res.send({
      data: metaDataList,
      status: 'success',
      url: reqUrl
    })
  }
  catch (error) {
    res.send({
      status: 'failed',
      url: reqUrl
    })
  }
})

if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'client/build')));

  // Handle React routing, return all requests to React app
  app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

console.log("process.env.PORT", port)
app.listen(port, () => console.log(`Listening on port ${port}`));