const db = require('../config/db');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper: Cloudinary la irundhu image delete panna
const deleteFromCloudinary = async (imageUrl) => {
  try {
    if (!imageUrl || !imageUrl.includes('cloudinary')) return;

    const parts = imageUrl.split('/');
    const filename = parts[parts.length - 1].split('.')[0];
    const folder = parts[parts.length - 2];
    const publicId = `${folder}/${filename}`;

    await cloudinary.uploader.destroy(publicId);
    console.log('✅ Deleted from Cloudinary:', publicId);
  } catch (err) {
    console.error('⚠️ Cloudinary delete failed:', err.message);
  }
};

// ========== CREATE ==========
exports.createHotel = async (req, res) => {
  try {
    console.log('📥 Create request received');
    console.log('File object:', req.file);

    const { title, description, latitude, longitude, price } = req.body;

    if (!req.file) {
      console.log('❌ No file uploaded');
      return res.status(400).json({ message: 'Image is required' });
    }

    // ✅ Cloudinary la irundhu URL edukkanum
    const image = req.file.path || req.file.secure_url || req.file.url;
    console.log('✅ Cloudinary URL:', image);

    const result = await db.query(
      `INSERT INTO hotels 
       (image, title, description, latitude, longitude, price) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [image, title, description, latitude, longitude, price]
    );

    console.log('✅ Inserted hotel ID:', result.rows[0].id);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('❌ Create error:', err.message);
    console.error('❌ Full error:', err);
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
      await deleteFromCloudinary(image);
      image = req.file.path || req.file.secure_url || req.file.url;
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
    console.error('❌ Update error:', err.message);
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

    await deleteFromCloudinary(check.rows[0].image);
    await db.query('DELETE FROM hotels WHERE id = $1', [id]);

    res.json({ message: 'Hotel deleted successfully' });
  } catch (err) {
    console.error('❌ Delete error:', err.message);
    res.status(500).json({ message: err.message });
  }
};

// ========== LIST ==========
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
    console.error('❌ Fetch error:', err.message);
    res.status(500).json({ message: err.message });
  }
};

// ========== GET BY ID ==========
exports.getHotelById = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM hotels WHERE id = $1', [req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Hotel not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('❌ Get error:', err.message);
    res.status(500).json({ message: err.message });
  }
};