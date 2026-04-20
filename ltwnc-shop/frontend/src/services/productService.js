const API_BASE_URL = 'http://localhost:8080/api';

export const productService = {
  async getProductDetail(productId) {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${productId}`);
      if (!response.ok) throw new Error('Product not found');
      
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  },

  async listProducts(page = 1, limit = 20) {
    try {
      const response = await fetch(`${API_BASE_URL}/products?page=${page}&limit=${limit}`);
      if (!response.ok) throw new Error('Failed to fetch products');
      
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  }
};
