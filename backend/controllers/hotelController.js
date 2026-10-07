const db = require('../config/db');
const fs = require('fs');
const path = require('path');

// CREATE
exports.createHotel = async (req, res) => {
  try {
    console.log('📥 Create hotel request received');
    console.log('Body:', req.body);
    console.log('File:', req.file);

    const { title, description, latitude, longitude, price } = req.body;

    if (!req.file) {
      console.log('❌ No file uploaded');
      return res.status(400).json({ message: 'Image required' });
    }

    const image = `/uploads/${req.file.filename}`;
    console.log('💾 Inserting into DB...');

    const [result] = await db.query(
      'INSERT INTO hotels (image, title, description, latitude, longitude, price) VALUES (?, ?, ?, ?, ?, ?)',
      [image, title, description, latitude, longitude, price]
    );

    console.log('✅ Inserted with ID:', result.insertId);

    res.status(201).json({
      id: result.insertId,
      image,
      title,
      description,
      latitude,
      longitude,
      price,
    });
  } catch (err) {
    console.log('❌ Create error:', err.message);
    res.status(500).json({ message: err.message });
  }
};

// UPDATE
exports.updateHotel = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, latitude, longitude, price } = req.body;

    const [rows] = await db.query('SELECT * FROM hotels WHERE id = ?', [id]);
    if (!rows.length) return res.status(404).json({ message: 'Hotel not found' });

    let image = rows[0].image;
    if (req.file) {
      const oldPath = path.join(__dirname, '..', rows[0].image);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      image = `/uploads/${req.file.filename}`;
    }

    await db.query(
      'UPDATE hotels SET image=?, title=?, description=?, latitude=?, longitude=?, price=? WHERE id=?',
      [image, title, description, latitude, longitude, price, id]
    );

    res.json({ id, image, title, description, latitude, longitude, price });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE
exports.deleteHotel = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM hotels WHERE id = ?', [id]);
    if (!rows.length) return res.status(404).json({ message: 'Hotel not found' });

    const imgPath = path.join(__dirname, '..', rows[0].image);
    if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);

    await db.query('DELETE FROM hotels WHERE id = ?', [id]);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// LIST with filters + pagination
exports.getHotels = async (req, res) => {
  try {
    // Safe extraction
    const title = req.query.title || '';
    const minPrice = req.query.minPrice ? Number(req.query.minPrice) : 0;
    const maxPrice = req.query.maxPrice ? Number(req.query.maxPrice) : 999999;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 6;

    const offset = (page - 1) * limit;

    // ... rest of the code (COUNT query + SELECT query) same ah irukatum!

    const [countRows] = await db.query(
      'SELECT COUNT(*) as total FROM hotels WHERE title LIKE ? AND price BETWEEN ? AND ?',
      [`%${title}%`, minPrice, maxPrice]
    );

    const [rows] = await db.query(
      'SELECT * FROM hotels WHERE title LIKE ? AND price BETWEEN ? AND ? ORDER BY id DESC LIMIT ? OFFSET ?',
      [`%${title}%`, minPrice, maxPrice, Number(limit), Number(offset)]
    );

    res.json({
      data: rows,
      total: countRows[0].total,
      page: Number(page),
      limit: Number(limit),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET BY ID
exports.getHotelById = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM hotels WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: 'Hotel not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};