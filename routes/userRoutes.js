const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  signup,
  login,
  logout,
  getProfile,
  updateName
} = require('../controllers/userController');

// 회원가입
router.post('/signup', signup);

// 로그인
router.post('/login', login);

// 로그아웃
router.post('/logout', protect, logout);

// 프로필 조회
router.get('/me', protect, getProfile);

// 이름 변경
router.patch('/update-name', protect, updateName);

module.exports = router;