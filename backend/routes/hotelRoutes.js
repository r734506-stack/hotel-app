const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { body, validationResult } = require('express-validator');
const ctrl = require('../controllers/hotelController');

const validate = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('latitude')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Valid latitude required (-90 to 90)'),
  body('longitude')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Valid longitude required (-180 to 180)'),
  body('price')
    .isFloat({ min: 1 })
    .withMessage('Valid price required (min 1)'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

router.post('/', upload.single('image'), validate, ctrl.createHotel);
router.put('/:id', upload.single('image'), validate, ctrl.updateHotel);
router.delete('/:id', ctrl.deleteHotel);
router.get('/', ctrl.getHotels);
router.get('/:id', ctrl.getHotelById);

module.exports = router;