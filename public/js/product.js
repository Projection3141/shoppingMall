document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
  
    // 상품 목록 로드
    async function loadProducts() {
      try {
        const response = await apiRequest('/products');
        const productList = document.getElementById('productList');
        productList.innerHTML = '';
  
        response.products.forEach(product => {
          const item = document.createElement('div');
          item.className = 'product-item';
          item.innerHTML = `
            <h3>${product.nameCode}</h3>
            <p>가격: ${product.price.toLocaleString()}원</p>
            <button onclick="purchaseProduct('${product._id}')" 
              ${product.isSold ? 'disabled' : ''}>
              ${product.isSold ? '판매 완료' : '구매하기'}
            </button>
          `;
          productList.appendChild(item);
        });
      } catch (error) {
        alert(error.message);
      }
    }
  
    // 상품 등록
    if (document.getElementById('productForm')) {
      document.getElementById('productForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        try {
          await apiRequest('/products', 'POST', {
            nameCode: document.getElementById('nameCode').value,
            price: parseInt(document.getElementById('price').value),
            categoryCode: document.getElementById('categoryCode').value,
            description: document.getElementById('description').value
          });
  
          alert('상품이 등록되었습니다');
          loadProducts();
        } catch (error) {
          alert(error.message);
        }
      });
    }
  
    // 상품 구매
    window.purchaseProduct = async (productId) => {
      try {
        await apiRequest('/products/purchase', 'POST', { productId });
        alert('구매가 완료되었습니다');
        loadProducts();
      } catch (error) {
        alert(error.message);
      }
    };
  
    loadProducts();
  });