const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
  address: {
    type: String,
    required: true,
    unique: true
  },
  balance: {
    type: Number,
    default: 0,
    min: [0, 'Balance cannot be negative']
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  linkedAccount: {
    type: String,
    required: true
  },
  latestLedger: { // 최신 원장 참조
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ledger'
  }
});

module.exports = mongoose.model('Wallet', walletSchema);