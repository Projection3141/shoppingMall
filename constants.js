module.exports = {
    // 트랜잭션 타입
    TX_TYPE: {
      DEPOSIT: 1,    // 입금
      WITHDRAW: 2,   // 출금
      PAYMENT: 3     // 상품 결제
    },
  
    // 상품 카테고리
    PRODUCT_CATEGORY: {
      ELECTRONICS: 1, // 전자제품
      CLOTHING: 2,    // 의류
      BOOKS: 3        // 도서
    },
  
    // 원장 주기
    LEDGER_PERIOD: {
      DAILY: 1,   // 일별
      WEEKLY: 2,  // 주별
      MONTHLY: 3  // 월별
    },
  
    // API 응답 메시지
    API_MESSAGES: {
      INSUFFICIENT_BALANCE: '잔액이 부족합니다',
      PRODUCT_SOLD_OUT: '이미 판매된 상품입니다',
      INVALID_TOKEN: '유효하지 않은 토큰입니다',
      UNAUTHORIZED: '인증되지 않은 사용자입니다'
    },
  
    // 기본 설정 값
    DEFAULT_VALUES: {
      INITIAL_BALANCE: 0, // 초기 잔액
      LEDGER_MAX_TRANSACTIONS: 10000 // 원장당 최대 트랜잭션 수
    }
  };