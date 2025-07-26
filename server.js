const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

let ads = [];
let currentId = 1;

// ✅ نشر إعلان جديد
app.post('/api/ads', (req, res) => {
  const ad = req.body;
  ad.id = currentId++;
  ads.push(ad);
  res.status(201).json(ad);
});

// ✅ جلب كل الإعلانات
app.get('/api/ads', (req, res) => {
  res.json(ads);
});

// ✅ جلب إعلان حسب ID
app.get('/api/ads/:id', (req, res) => {
  const adId = parseInt(req.params.id);
  const ad = ads.find(a => a.id === adId);
  if (ad) {
    res.json(ad);
  } else {
    res.status(404).json({ message: 'الإعلان غير موجود' });
  }
});

// ✅ تحديث إعلان
app.put('/api/ads/:id', (req, res) => {
  const adId = parseInt(req.params.id);
  const index = ads.findIndex(a => a.id === adId);

  if (index !== -1) {
    ads[index] = { ...ads[index], ...req.body, id: adId };
    res.json(ads[index]);
  } else {
    res.status(404).json({ message: 'الإعلان غير موجود' });
  }
});

// ✅ حذف إعلان
app.delete('/api/ads/:id', (req, res) => {
  const adId = parseInt(req.params.id);
  const index = ads.findIndex(ad => ad.id === adId);

  if (index !== -1) {
    ads.splice(index, 1);
    res.status(204).send(); // حذف ناجح بدون محتوى
  } else {
    res.status(404).json({ message: 'الإعلان غير موجود' });
  }
});

// ✅ تشغيل الخادم
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
