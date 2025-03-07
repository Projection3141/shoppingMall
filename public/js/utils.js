const API_BASE_URL = 'http://localhost:3000/api';

// 공통 API 요청 함수
async function apiRequest(endpoint, method = 'GET', body = null) {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  const token = localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
}

// 로그인 상태 확인
function checkAuth() {
  if (!localStorage.getItem('token')) {
    window.location.href = '/html/login.html';
  }
}

// 로그아웃 처리
function logout() {
  localStorage.removeItem('token');
  window.location.href = '/html/login.html';
}