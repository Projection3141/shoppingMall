const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  nameCode: { // 상품명 코드화 (1: 전자제품, 2: 의류, ...)
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: [0, 'Price cannot be negative']
  },
  isSold: {
    type: Boolean,
    default: false
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  categoryCode: { // 분류 코드 (숫자 매핑 사용)
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  transactionHash: String
});

module.exports = mongoose.model('Product', productSchema);