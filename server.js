const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// فتح الاتصال بقاعدة البيانات
const db = new sqlite3.Database('./database.sqlite', (err) => {
  if (err) {
    console.error('❌ فشل في الاتصال بقاعدة البيانات:', err.message);
  } else {
    console.log('✅ تم الاتصال بقاعدة بيانات SQLite');
  }
});

// إنشاء الجدول إذا لم يكن موجودًا
db.run(`
  CREATE TABLE IF NOT EXISTS ads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    location TEXT NOT NULL,
    price REAL NOT NULL,
    images TEXT NOT NULL, -- سيتم تخزين الصور كسلسلة JSON
    phone TEXT NOT NULL,
    category TEXT NOT NULL
  )
`);

// جلب كل الإعلانات
app.get('/api/ads', (req, res) => {
  db.all('SELECT * FROM ads', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      const ads = rows.map(ad => ({
        ...ad,
        images: JSON.parse(ad.images)
      }));
      res.json(ads);
    }
  });
});

// إنشاء إعلان جديد
app.post('/api/ads', (req, res) => {
  const { title, description, location, price, images, phone, category } = req.body;
  const imagesJson = JSON.stringify(images);

  db.run(
    `INSERT INTO ads (title, description, location, price, images, phone, category)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [title, description, location, price, imagesJson, phone, category],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(201).json({ id: this.lastID });
      }
    }
  );
});

// تعديل إعلان
app.put('/api/ads/:id', (req, res) => {
  const { id } = req.params;
  const { title, description, location, price, images, phone, category } = req.body;
  const imagesJson = JSON.stringify(images);

  db.run(
    `UPDATE ads SET title=?, description=?, location=?, price=?, images=?, phone=?, category=? WHERE id=?`,
    [title, description, location, price, imagesJson, phone, category, id],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json({ updated: this.changes });
      }
    }
  );
});

// حذف إعلان
app.delete('/api/ads/:id', (req, res) => {
  const { id } = req.params;
  db.run(`DELETE FROM ads WHERE id=?`, [id], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      if (this.changes === 0) {
        res.status(404).json({ error: 'الإعلان غير موجود' });
      } else {
        res.status(200).json({ message: 'تم الحذف بنجاح' }); // ✅ أفضل من 204
      }
    }
  });
});

// بدء الخادم
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
