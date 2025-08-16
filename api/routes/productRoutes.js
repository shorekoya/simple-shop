const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Product = require('../models/productModel');
const checkAuth = require('../middleware/check-auth');
const productController = require('../controllers/productController');

// Multer storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, './uploads/'),
  filename: (req, file, cb) => {
    const safeDate = new Date().toISOString().replace(/:/g, '-');
    cb(null, safeDate + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage,
  limits: { fieldSize: 1024 * 1024 * 5 },
  fileFilter,
});

// GET all products
router.get('/', productController.getAll);

// POST new product
router.post(
  '/',
  checkAuth,
  upload.single('productImg'),
  productController.newProduct
);

// GET product by ID
router.get('/:id', productController.getOne);

// PATCH update product
router.patch('/:id', checkAuth, productController.updateProduct);

// DELETE product
router.delete('/:id', checkAuth, productController.deleteProduct);

module.exports = router;
