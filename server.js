const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// إنشاء قاعدة البيانات
const db = new sqlite3.Database('./ads.db');

// إنشاء جدول الإعلانات إذا لم يكن موجوداً
db.run(`CREATE TABLE IF NOT EXISTS ads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT,
  description TEXT,
  location TEXT,
  price REAL,
  images TEXT, -- سيتم تخزينها كـ JSON string
  phone TEXT,
  category TEXT
)`);

// ✅ Get all ads
app.get('/api/ads', (req, res) => {
  db.all('SELECT * FROM ads', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    const ads = rows.map(row => ({
      ...row,
      images: JSON.parse(row.images)
    }));
    res.json(ads);
  });
});

// ✅ Post new ad
app.post('/api/ads', (req, res) => {
  const { title, description, location, price, images, phone, category } = req.body;
  db.run(
    `INSERT INTO ads (title, description, location, price, images, phone, category)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [title, description, location, price, JSON.stringify(images), phone, category],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });

      res.status(201).json({ id: this.lastID });
    }
  );
});

// ✅ Update ad
app.put('/api/ads/:id', (req, res) => {
  const { id } = req.params;
  const { title, description, location, price, images, phone, category } = req.body;

  db.run(
    `UPDATE ads SET title=?, description=?, location=?, price=?, images=?, phone=?, category=? WHERE id=?`,
    [title, description, location, price, JSON.stringify(images), phone, category, id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });

      res.status(200).json({ updated: this.changes });
    }
  );
});

// ✅ Delete ad
app.delete('/api/ads/:id', (req, res) => {
  const { id } = req.params;
  db.run(`DELETE FROM ads WHERE id=?`, [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });

    res.status(204).end();
  });
});

// ✅ Start server
app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
