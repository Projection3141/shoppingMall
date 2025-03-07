const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('./models/userModel');
const Product = require('./models/productModel');
const Wallet = require('./models/walletModel');
const { protect, generateToken } = require('./middleware/auth');

dotenv.config();
const app = express();
app.use(express.json());
app.use(express.static('public'));

// MongoDB 연결
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// 라우트 연결
const userRoutes = require('./routes/userRoutes');
const walletRoutes = require('./routes/walletRoutes');
const productRoutes = require('./routes/productRoutes');
app.use('/users', userRoutes);
app.use('/wallet', walletRoutes);
app.use('/products', productRoutes);

// 서버 실행
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});