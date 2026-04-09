import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../../ui/Header/Header';
import Footer from '../../../ui/Footer/Footer';
import { useCart } from '../../../../context/CartContext';
import './Cart.css';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart, getCartTotal } = useCart();
  const [checkoutMessage, setCheckoutMessage] = useState('');

  const getShippingFee = () => {
    const subtotal = getCartTotal();
    if (subtotal === 0) return 0;
    return subtotal > 500000 ? 0 : 30000;
  };

  const getTotal = () => {
    return getCartTotal() + getShippingFee();
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    clearCart();
    setCheckoutMessage('Thanh toán giả lập thành công. Giỏ hàng đã được xóa tạm thời.');
  };

  return (
    <div className="cart-page">
      <Header />

      <main className="cart-container">
        <h1 className="cart-title">Giỏ Hàng Của Bạn</h1>

        {checkoutMessage && <div className="checkout-message">{checkoutMessage}</div>}

        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-cart-icon">
              <span className="material-icons">shopping_cart</span>
            </div>
            <h2>Giỏ hàng của bạn đang trống</h2>
            <p>Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm.</p>
            <Link to="/" className="continue-shopping-btn">
              Tiếp tục mua sắm
            </Link>
          </div>
        ) : (
          <div className="cart-content">
            <div className="cart-items">
              <div className="cart-header">
                <div className="header-product">Sản phẩm</div>
                <div className="header-quantity">Số lượng</div>
                <div className="header-total">Tổng giá</div>
              </div>

              {cartItems.map((item) => (
                <div key={`${item.id}-${item.size}-${item.color || ''}`} className="cart-item">
                  <div className="item-product">
                    <div className="item-image">
                      <img src={item.imageUrl || item.image || ''} alt={item.name} />
                    </div>
                    <div className="item-details">
                      <h3 className="item-name">{item.name}</h3>
                      {item.size || item.color ? (
                        <p className="item-variant">{item.size ? `Size: ${item.size}` : ''}{item.size && item.color ? ' | ' : ''}{item.color ? `Màu: ${item.color}` : ''}</p>
                      ) : null}
                      <p className="item-price">{item.price.toLocaleString()} ₫</p>
                      <button
                        className="remove-btn"
                        onClick={() => removeFromCart(item.id, item.size, item.color)}
                      >
                        <span className="material-icons">delete</span>
                        Xóa
                      </button>
                    </div>
                  </div>

                  <div className="item-quantity">
                    <div className="quantity-controls">
                      <button
                        className="quantity-btn"
                        onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="quantity-value">{item.quantity}</span>
                      <button
                        className="quantity-btn"
                        onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="item-total">
                    {(item.price * item.quantity).toLocaleString()} ₫
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <h2 className="summary-title">Tóm tắt đơn hàng</h2>

              <div className="summary-row">
                <span>Tạm tính:</span>
                <span>{getCartTotal().toLocaleString()} ₫</span>
              </div>

              <div className="summary-row">
                <span>Phí vận chuyển:</span>
                <span>{getShippingFee() === 0 ? 'Miễn phí' : `${getShippingFee().toLocaleString()} ₫`}</span>
              </div>

              {getShippingFee() === 0 && getCartTotal() > 0 && (
                <p className="free-shipping-note">
                  🎉 Miễn phí vận chuyển cho đơn hàng từ 500.000 ₫
                </p>
              )}

              <div className="summary-divider"></div>

              <div className="summary-row total-row">
                <span>Tổng cộng:</span>
                <span className="total-amount">{getTotal().toLocaleString()} ₫</span>
              </div>

              <button className="checkout-btn" onClick={handleCheckout}>
                Tiến hành đặt hàng
              </button>

              <Link to="/" className="continue-shopping-link">
                ← Tiếp tục mua sắm
              </Link>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Cart;
