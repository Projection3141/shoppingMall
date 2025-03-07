const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  txType: { // 트랜잭션 유형 (1: 입금, 2: 출금, 3: 상품결제)
    type: Number,
    enum: [1, 2, 3],
    required: true
  },
  data: { // [거래ID, 금액] 또는 [상품ID, 금액, 추가정보] 등
    type: [Number],
    validate: {
      validator: function(v) {
        return v.length >= 2 && v.length <= 5; // 데이터 길이 제한
      },
      message: props => `Invalid data length!`
    }
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  wallet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Wallet',
    required: true
  },
  relatedProduct: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }
});

module.exports = mongoose.model('Transaction', transactionSchema);