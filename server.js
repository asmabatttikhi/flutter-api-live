const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

let ads = [];

app.get('/api/ads', (req, res) => {
  res.json(ads);
});

app.post('/api/ads', (req, res) => {
  const ad = req.body;
  ad.id = ads.length + 1;
  ads.push(ad);
  res.status(201).json(ad);
});

app.get('/', (req, res) => {
  res.send('API يعمل 🎉');
});

app.listen(port, () => {
  console.log(`API شغال على http://localhost:${port}`);
});
