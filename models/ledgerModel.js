const mongoose = require('mongoose');

const ledgerSchema = new mongoose.Schema({
  period: { // 1: 일별, 2: 주별, 3: 월별
    type: Number,
    enum: [1, 2, 3],
    required: true
  },
  startTime: Date,
  endTime: Date,
  transactions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction'
  }],
  prevHash: String, // 이전 원장 해시
  currentHash: String // 현재 원장 해시
});

module.exports = mongoose.model('Ledger', ledgerSchema);