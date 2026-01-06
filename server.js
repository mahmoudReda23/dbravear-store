const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// الاتصال بقاعدة البيانات - يستخدم متغيرات البيئة عند الرفع أو الإعداد المحلي
const db = mysql.createConnection(process.env.DATABASE_URL || {
    host: 'localhost',
    user: 'root',
    password: '', 
    database: 'dbravear'
});

db.connect(err => {
    if (err) console.error('خطأ في قاعدة البيانات:', err);
    else console.log('متصل بنجاح بقاعدة بيانات dbravear');
});

// جلب المنتجات
app.get('/api/products', (req, res) => {
    db.query("SELECT * FROM products", (err, results) => {
        if (err) res.status(500).json(err);
        else res.json(results);
    });
});

// إضافة منتج جديد
app.post('/api/products', (req, res) => {
    const { name, category, price, image_url, stock } = req.body;
    const sql = "INSERT INTO products (name, category, price, image_url, stock) VALUES (?, ?, ?, ?, ?)";
    db.query(sql, [name, category, price, image_url, stock], (err, result) => {
        if (err) res.status(500).json(err);
        else res.json({ id: result.insertId, ...req.body });
    });
});

// تعديل الكمية والحالة
app.put('/api/products/:id', (req, res) => {
    const { stock, is_available } = req.body;
    db.query("UPDATE products SET stock = ?, is_available = ? WHERE id = ?", [stock, is_available, req.params.id], (err) => {
        if (err) res.status(500).json(err);
        else res.send("تم التحديث");
    });
});

// حذف منتج
app.delete('/api/products/:id', (req, res) => {
    db.query("DELETE FROM products WHERE id = ?", [req.params.id], (err) => {
        if (err) res.status(500).json(err);
        else res.send("تم الحذف");
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`السيرفر يعمل على منفذ ${PORT}`));