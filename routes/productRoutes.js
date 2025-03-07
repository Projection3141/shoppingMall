const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { 
  createProduct, 
  purchaseProduct 
} = require('../controllers/productController');

// 상품 등록
router.post('/', protect, createProduct);

// 상품 구매
router.post('/purchase', protect, purchaseProduct);

module.exports = router;