import React, { useState } from 'react';
import { message } from 'antd';
import Header from '../../components/ui/Header/Header';
import Footer from '../../components/ui/Footer/Footer';
import ProductCard from '../../components/ui/ProductCard/ProductCard';
import { products as allProducts } from '../../data/products';
import { formatCurrency } from '../../utils/format';
import './Search.css';

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();

    if (!searchTerm.trim()) {
      message.warning('Vui lòng nhập từ khóa tìm kiếm');
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    setIsSearching(true);
    setHasSearched(true);

    const keyword = searchTerm.trim().toLowerCase();
    const filteredResults = allProducts.filter((product) => {
      const name = product.name?.toLowerCase() || '';
      const category = product.category?.toLowerCase() || '';
      const description = product.description?.toLowerCase() || '';
      const matchKeyword =
        name.includes(keyword) ||
        category.includes(keyword) ||
        description.includes(keyword);

      return product.quantum > 0 && matchKeyword;
    });

    setTimeout(() => {
      setSearchResults(filteredResults);
      setIsSearching(false);

      if (filteredResults.length === 0) {
        message.info('Không tìm thấy sản phẩm nào phù hợp');
      } else {
        message.success(`Tìm thấy ${filteredResults.length} sản phẩm`);
      }
    }, 250);
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="search-page">
      <Header />

      <main className="search-main">
        <div className="container">
          <div className="search-header">
            <h1>Tìm kiếm sản phẩm</h1>
            <form onSubmit={handleSearch} className="search-form">
              <div className="search-input-wrapper">
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchTerm}
                  onChange={handleInputChange}
                  className="search-input"
                />
                <button type="submit" className="search-btn" disabled={isSearching}>
                  <span className="material-icons">
                    {isSearching ? 'hourglass_empty' : 'search'}
                  </span>
                </button>
              </div>
            </form>
          </div>

          <div className="search-results">
            {isSearching ? (
              <div className="loading">
                <div className="loading-spinner"></div>
                <p>Đang tìm kiếm...</p>
              </div>
            ) : searchResults.length > 0 ? (
              <>
                <div className="results-header">
                  <p>Tìm thấy <strong>{searchResults.length}</strong> sản phẩm</p>
                </div>
                <div className="products-grid">
                  {searchResults.map((product) => (
                    <ProductCard
                      key={product.id}
                      image={product.imageUrl || product.image || 'https://via.placeholder.com/300'}
                      alt={product.name}
                      category={product.category || product.type}
                      name={product.name}
                      currentPrice={formatCurrency(product.price)}
                      oldPrice={product.oldPrice ? formatCurrency(product.oldPrice) : undefined}
                      link={`/product/${product.id}`}
                    />
                  ))}
                </div>
              </>
            ) : hasSearched && !isSearching ? (
              <div className="no-results">
                <div className="no-results-icon">
                  <span className="material-icons">search_off</span>
                </div>
                <h3>Không tìm thấy sản phẩm</h3>
                <p>Không có sản phẩm nào phù hợp với từ khóa "<strong>{searchTerm}</strong>"</p>
                <div className="suggestions">
                  <h4>Gợi ý tìm kiếm:</h4>
                  <ul>
                    <li>Kiểm tra chính tả</li>
                    <li>Sử dụng từ khóa khác</li>
                    <li>Tìm kiếm theo danh mục sản phẩm</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="search-placeholder">
                <div className="placeholder-icon">
                  <span className="material-icons">search</span>
                </div>
                <h3>Bắt đầu tìm kiếm</h3>
                <p>Nhập tên sản phẩm hoặc danh mục để tìm kiếm</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Search;
