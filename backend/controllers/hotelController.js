const db = require('../config/db');
const fs = require('fs');
const path = require('path');

// ========== CREATE ==========
exports.createHotel = async (req, res) => {
  try {
    const { title, description, latitude, longitude, price } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Image is required' });
    }

    const image = `/uploads/${req.file.filename}`;

    const result = await db.query(
      `INSERT INTO hotels 
       (image, title, description, latitude, longitude, price) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [image, title, description, latitude, longitude, price]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Create error:', err.message);
    res.status(500).json({ message: err.message });
  }
};

// ========== UPDATE ==========
exports.updateHotel = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, latitude, longitude, price } = req.body;

    const check = await db.query('SELECT * FROM hotels WHERE id = $1', [id]);
    if (check.rows.length === 0) {
      return res.status(404).json({ message: 'Hotel not found' });
    }

    let image = check.rows[0].image;

    if (req.file) {
      const oldPath = path.join(__dirname, '..', check.rows[0].image);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      image = `/uploads/${req.file.filename}`;
    }

    const result = await db.query(
      `UPDATE hotels 
       SET image = $1, title = $2, description = $3, 
           latitude = $4, longitude = $5, price = $6, 
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $7 
       RETURNING *`,
      [image, title, description, latitude, longitude, price, id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Update error:', err.message);
    res.status(500).json({ message: err.message });
  }
};

// ========== DELETE ==========
exports.deleteHotel = async (req, res) => {
  try {
    const { id } = req.params;

    const check = await db.query('SELECT * FROM hotels WHERE id = $1', [id]);
    if (check.rows.length === 0) {
      return res.status(404).json({ message: 'Hotel not found' });
    }

    const imgPath = path.join(__dirname, '..', check.rows[0].image);
    if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);

    await db.query('DELETE FROM hotels WHERE id = $1', [id]);

    res.json({ message: 'Hotel deleted successfully' });
  } catch (err) {
    console.error('Delete error:', err.message);
    res.status(500).json({ message: err.message });
  }
};

// ========== LIST (with search + filter + pagination) ==========
exports.getHotels = async (req, res) => {
  try {
    const title = req.query.title || '';
    const minPrice = req.query.minPrice ? Number(req.query.minPrice) : 0;
    const maxPrice = req.query.maxPrice ? Number(req.query.maxPrice) : 999999999;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 6;
    const offset = (page - 1) * limit;

    const countResult = await db.query(
      `SELECT COUNT(*) AS total FROM hotels 
       WHERE title ILIKE $1 AND price BETWEEN $2 AND $3`,
      [`%${title}%`, minPrice, maxPrice]
    );

    const dataResult = await db.query(
      `SELECT * FROM hotels 
       WHERE title ILIKE $1 AND price BETWEEN $2 AND $3 
       ORDER BY id DESC 
       LIMIT $4 OFFSET $5`,
      [`%${title}%`, minPrice, maxPrice, limit, offset]
    );

    res.json({
      data: dataResult.rows,
      total: parseInt(countResult.rows[0].total),
      page,
      limit,
    });
  } catch (err) {
    console.error('Fetch error:', err.message);
    res.status(500).json({ message: err.message });
  }
};

// ========== GET BY ID ==========
exports.getHotelById = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM hotels WHERE id = $1', [
      req.params.id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Hotel not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Get by id error:', err.message);
    res.status(500).json({ message: err.message });
  }
};