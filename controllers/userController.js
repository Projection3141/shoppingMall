const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const Wallet = require('../models/walletModel');
const { generateToken } = require('../middleware/auth');
const mongoose = require('mongoose');

// 회원가입
exports.signup = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    
    const { username, userId, password, linkedAccount } = req.body;

    // 사용자 생성
    const newUser = await User.create([{
      username,
      userId,
      password,
    }], { session });

    // 지갑 생성
    const newWallet = await Wallet.create([{
      linkedAccount,
      owner: newUser[0]._id,
      address: '0x' + crypto.randomBytes(20).toString('hex')
    }], { session });

    // 사용자-지갑 연결
    await User.findByIdAndUpdate(
      newUser[0]._id,
      { wallet: newWallet[0]._id },
      { session }
    );

    await session.commitTransaction();
    
    const token = generateToken(newUser[0]._id);
    res.status(201).json({
      success: true,
      token,
      user: {
        id: newUser[0]._id,
        username: newUser[0].username
      }
    });

  } catch (error) {
    await session.abortTransaction();
    res.status(400).json({
      success: false,
      message: error.message.includes('duplicate') 
        ? '이미 존재하는 아이디입니다' 
        : error.message
    });
  } finally {
    session.endSession();
  }
};

// 로그인
exports.login = async (req, res) => {
  try {
    const { userId, password } = req.body;

    const user = await User.findOne({ userId }).select('+password');
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ 
        success: false, 
        message: '잘못된 계정 정보입니다' 
      });
    }

    const token = generateToken(user._id);
    res.json({ 
      success: true, 
      token,
      user: {
        id: user._id,
        username: user.username
      }
    });

  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: '서버 오류 발생' 
    });
  }
};

// 로그아웃
exports.logout = (req, res) => {
  res.json({ 
    success: true, 
    message: '로그아웃 성공' 
  });
};

// 내 정보 조회
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password -sellingProducts')
      .populate('wallet', 'balance address');

    res.json({ 
      success: true, 
      user 
    });

  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: '프로필 조회 실패' 
    });
  }
};

// 이름 수정
exports.updateName = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { username: req.body.newName },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({ 
      success: true, 
      user 
    });

  } catch (error) {
    res.status(400).json({ 
      success: false, 
      message: error.message 
    });
  }
};