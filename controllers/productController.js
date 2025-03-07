const Product = require('../models/productModel');
const Wallet = require('../models/walletModel');
const Transaction = require('../models/transactionModel');
const { TX_TYPE } = require('../constants');
const mongoose = require('mongoose');

// 상품 등록
exports.createProduct = async (req, res) => {
  try {
    const { nameCode, price, categoryCode, description } = req.body;

    const product = await Product.create({
      nameCode,
      price,
      categoryCode,
      description,
      seller: req.user.id
    });

    res.status(201).json({ 
      success: true, 
      product 
    });

  } catch (error) {
    res.status(400).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// 상품 구매
exports.purchaseProduct = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const { productId } = req.body;
    const product = await Product.findById(productId).session(session);
    const wallet = await Wallet.findById(req.user.wallet).session(session);

    // 유효성 검사
    if (product.isSold) throw new Error('이미 판매된 상품입니다');
    if (wallet.balance < product.price) throw new Error('잔액이 부족합니다');

    // 구매 처리
    product.isSold = true;
    product.buyer = req.user.id;
    await product.save({ session });

    // 잔액 차감
    wallet.balance -= product.price;
    await wallet.save({ session });

    // 트랜잭션 기록
    await Transaction.create([{
      txType: TX_TYPE.PAYMENT,
      data: [product._id, product.price],
      wallet: wallet._id,
      relatedProduct: product._id
    }], { session });

    await session.commitTransaction();
    res.json({ 
      success: true, 
      message: '구매가 완료되었습니다' 
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