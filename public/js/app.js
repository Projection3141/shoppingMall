// 공통 함수
const apiClient = {
    post: async (url, data) => {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
      return await response.json();
    }
  };
  
  // 회원가입 처리
  if (document.getElementById('signupForm')) {
    document.getElementById('signupForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const userData = {
        username: document.getElementById('username').value,
        userId: document.getElementById('userId').value,
        password: document.getElementById('password').value,
        wallet: {
          linkedAccount: document.getElementById('linkedAccount').value
        }
      };
  
      const result = await apiClient.post('/users/signup', userData);
      if (result.success) {
        localStorage.setItem('token', result.token);
        window.location.href = '/html/dashboard.html';
      }
    });
  }
  
  // 로그인 처리
  if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const credentials = {
        userId: document.getElementById('userId').value,
        password: document.getElementById('password').value
      };
  
      const result = await apiClient.post('/users/login', credentials);
      if (result.success) {
        localStorage.setItem('token', result.token);
        window.location.href = '/html/dashboard.html';
      }
    });
  }