const { verifyToken } = require('../utils/jwtUtils');

// 라우트 보호를 위한 미들웨어
exports.protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized' });
  }

  try {
    req.user = await verifyToken(token); // JWT 유틸리티 사용
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: error.message });
  }
};

// 역할 기반 접근 제어 (예: 어드민만 접근 가능)
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: 'You do not have permission to perform this action' 
      });
    }
    next();
  };
};