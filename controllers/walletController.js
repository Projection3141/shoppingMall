const Wallet = require('../models/walletModel');
const Transaction = require('../models/transactionModel');
const Ledger = require('../models/ledgerModel');
const { TX_TYPE } = require('../constants');
const mongoose = require('mongoose');

// 잔액 충전
exports.chargeBalance = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const { amount } = req.body;
    const wallet = await Wallet.findById(req.user.wallet);

    // 잔액 업데이트
    wallet.balance += amount;
    await wallet.save({ session });

    // 트랜잭션 기록
    const transaction = await Transaction.create([{
      txType: TX_TYPE.DEPOSIT,
      data: [amount],
      wallet: wallet._id
    }], { session });

    // 원장 관리
    await manageLedger(wallet, transaction[0]._id, session);

    await session.commitTransaction();
    res.json({ 
      success: true, 
      balance: wallet.balance 
    });

  } catch (error) {
    await session.abortTransaction();
    res.status(400).json({ 
      success: false, 
      message: error.message 
    });
  } finally {
    session.endSession();
  }
};

// 원장 관리 함수
const manageLedger = async (wallet, transactionId, session) => {
  let ledger = await Ledger.findById(wallet.latestLedger).session(session);

  if (!ledger || ledger.transactions.length >= 10000) {
    ledger = await Ledger.create([{
      period: 1, // 일별
      startTime: Date.now(),
      transactions: [transactionId],
      prevHash: ledger ? ledger.currentHash : null,
      currentHash: generateHash(transactionId)
    }], { session });

    wallet.latestLedger = ledger[0]._id;
    await wallet.save({ session });
  } else {
    ledger.transactions.push(transactionId);
    ledger.currentHash = generateHash(transactionId);
    await ledger.save({ session });
  }
};

// 해시 생성 함수
const generateHash = (data) => {
  return crypto.createHash('sha256')
    .update(JSON.stringify(data))
    .digest('hex');
};