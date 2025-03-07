const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { chargeBalance } = require('../controllers/walletController');

// 잔액 충전
router.post('/charge', protect, chargeBalance);

module.exports = router;