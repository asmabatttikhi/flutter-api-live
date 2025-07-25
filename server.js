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


// تحديث إعلان
app.put('/api/ads/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const updatedAd = req.body;

  const index = ads.findIndex((ad) => ad.id === id);
  if (index !== -1) {
    ads[index] = { ...ads[index], ...updatedAd };
    res.json(ads[index]);
  } else {
    res.status(404).json({ message: 'الإعلان غير موجود' });
  }
});

// حذف إعلان
app.delete('/api/ads/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = ads.findIndex((ad) => ad.id === id);
  if (index !== -1) {
    ads.splice(index, 1);
    res.status(204).send(); // No Content
  } else {
    res.status(404).json({ message: 'الإعلان غير موجود' });
  }
});


app.listen(port, () => {
  console.log(`API شغال على http://localhost:${port}`);
});
