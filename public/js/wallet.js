document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
  
    // 잔액 조회
    async function loadBalance() {
      try {
        const user = await apiRequest('/users/me');
        document.getElementById('balance').textContent = 
          `현재 잔액: ${user.wallet.balance.toLocaleString()}원`;
      } catch (error) {
        alert(error.message);
      }
    }
  
    // 충전 폼
    if (document.getElementById('chargeForm')) {
      document.getElementById('chargeForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        try {
          const amount = parseInt(document.getElementById('amount').value);
          await apiRequest('/wallet/charge', 'POST', { amount });
          await loadBalance();
          alert('충전이 완료되었습니다');
        } catch (error) {
          alert(error.message);
        }
      });
    }
  
    loadBalance();
  });