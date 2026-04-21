import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { useCart } from '../../../../context/CartContext';
import { useAuth } from '../../../../context/AuthContext';
import './OrderCheckout.css';

const API_BASE_URL = 'http://localhost:8080/api';

const sampleAddresses = [
  {
    id: 1,
    recipientName: 'Nguyễn Văn A',
    phone: '0912 345 678',
    addressLine: '123 Đường Trần Hưng Đạo',
    ward: 'Phường 1',
    district: 'Quận 5',
    province: 'TP.HCM',
    postalCode: '700000',
    notes: 'Gọi trước 30 phút',
    isDefault: true,
  },
  {
    id: 2,
    recipientName: 'Lê Thị B',
    phone: '0987 654 321',
    addressLine: '456 Đường Lê Lợi',
    ward: 'Phường Bến Thành',
    district: 'Quận 1',
    province: 'TP.HCM',
    postalCode: '700000',
    notes: 'Giao trong giờ hành chính',
    isDefault: false,
  },
];

const OrderCheckout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, updateQuantity, removeFromCart, clearCart, getCartTotal } = useCart();
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [loading, setLoading] = useState(false);
  const [userAddresses] = useState(sampleAddresses);
  const [selectedAddressId, setSelectedAddressId] = useState(sampleAddresses[0]?.id || null);
  const [showAddNewAddress, setShowAddNewAddress] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [formData, setFormData] = useState({
    fullName: sampleAddresses[0]?.recipientName || '',
    email: '',
    phone: sampleAddresses[0]?.phone || '',
    address: sampleAddresses[0]?.addressLine || '',
    ward: sampleAddresses[0]?.ward || '',
    district: sampleAddresses[0]?.district || '',
    city: sampleAddresses[0]?.province || '',
    postalCode: sampleAddresses[0]?.postalCode || '',
    recipientName: sampleAddresses[0]?.recipientName || '',
    notes: sampleAddresses[0]?.notes || '',
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });

  useEffect(() => {
    if (userAddresses.length > 0 && selectedAddressId === null) {
      setSelectedAddressId(userAddresses[0].id);
    }
  }, [userAddresses, selectedAddressId]);

  useEffect(() => {
    if (!showAddNewAddress && selectedAddressId !== null) {
      const selectedAddress = userAddresses.find((address) => address.id === selectedAddressId);
      if (selectedAddress) {
        fillFormWithAddress(selectedAddress);
      }
    }
  }, [selectedAddressId, showAddNewAddress, userAddresses]);

  const fillFormWithAddress = (address) => {
    setFormData((prev) => ({
      ...prev,
      fullName: address.recipientName || prev.fullName,
      recipientName: address.recipientName || prev.recipientName,
      phone: address.phone || prev.phone,
      address: address.addressLine || prev.address,
      ward: address.ward || prev.ward,
      district: address.district || prev.district,
      city: address.province || prev.city,
      postalCode: address.postalCode || prev.postalCode,
      notes: address.notes || prev.notes,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\s+/g, '');
    if (value.length > 16) value = value.slice(0, 16);
    const formatted = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    setFormData((prev) => ({
      ...prev,
      cardNumber: formatted,
    }));
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    setFormData((prev) => ({
      ...prev,
      expiryDate: value,
    }));
  };

  const handleCVVChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 3) value = value.slice(0, 3);
    setFormData((prev) => ({
      ...prev,
      cvv: value,
    }));
  };

  const getShippingFee = () => {
    const subtotal = getCartTotal();
    return subtotal > 500000 ? 0 : 30000;
  };

  const validateStep1 = () => {
    const { recipientName, phone, address, ward, district, city } = formData;
    if (!recipientName.trim() || !phone.trim() || !address.trim() || !ward.trim() || !district.trim() || !city.trim()) {
      setErrorMessage('Vui lòng điền đầy đủ thông tin giao hàng');
      return false;
    }
    setErrorMessage('');
    return true;
  };

  const validateStep2 = () => {
    const { cardName, cardNumber, expiryDate, cvv } = formData;
    if (!paymentMethod) {
      setErrorMessage('Vui lòng chọn phương thức thanh toán');
      return false;
    }
    if (paymentMethod === 'card') {
      if (!cardName.trim() || !cardNumber.trim() || !expiryDate.trim() || !cvv.trim()) {
        setErrorMessage('Vui lòng điền đầy đủ thông tin thẻ');
        return false;
      }
      if (cardNumber.replace(/\s/g, '').length !== 16) {
        setErrorMessage('Số thẻ phải có 16 chữ số');
        return false;
      }
    }
    setErrorMessage('');
    return true;
  };

  const handleNextStep = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    setStep((prev) => prev + 1);
  };

  const handlePreviousStep = () => {
    setErrorMessage('');
    setSuccessMessage('');
    if (step > 1) {
      setStep((prev) => prev - 1);
    }
  };

  const handleConfirmOrder = async () => {
    if (!user?.id) {
      message.error('Đăng nhập lại để tiếp tục');
      navigate('/login');
      return;
    }

    if (cartItems.length === 0) {
      setErrorMessage('Giỏ hàng của bạn đang trống.');
      return;
    }

    try {
      setLoading(true);

      // Format shipping address as a single string
      const shippingAddr = `${formData.address}, ${formData.ward}, ${formData.district}, ${formData.city}`;

      const orderData = {
        shippingAddr: shippingAddr,
        phoneNumber: formData.phone,
        note: formData.notes,
        items: cartItems.map(item => ({
          productId: parseInt(item.id) || item.id, // Ensure it's Int
          quantity: parseInt(item.quantity) || 1,
        })),
      };

      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Đặt hàng thất bại');
      }

      setSuccessMessage('Đơn hàng đã được đặt thành công!');
      setErrorMessage('');
      clearCart();
      
      setTimeout(() => {
        message.success('Đơn hàng đã được tạo! Đường dẫn đến trang chủ...');
        navigate('/');
      }, 2000);
    } catch (error) {
      console.error('Lỗi đặt hàng:', error);
      setErrorMessage(error.message || 'Không thể đặt hàng. Vui lòng thử lại.');
      message.error(error.message || 'Không thể đặt hàng');
    } finally {
      setLoading(false);
    }
  };

  const subtotal = getCartTotal();
  const shipping = getShippingFee();
  const discount = 0;
  const total = subtotal + shipping - discount;

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="payment-container">
      <div className="payment-wrapper">
        <div className="progress-bar">
          <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
            <div className="step-number">1</div>
            <span>Giao Hàng</span>
          </div>
          <div className={`progress-line ${step >= 2 ? 'active' : ''}`}></div>
          <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
            <div className="step-number">2</div>
            <span>Thanh Toán</span>
          </div>
          <div className={`progress-line ${step >= 3 ? 'active' : ''}`}></div>
          <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>
            <div className="step-number">3</div>
            <span>Xác Nhận</span>
          </div>
        </div>

        <div className="payment-content">
          <div className="payment-form">
            {step === 1 && (
              <div className="form-section">
                <h2>Thông Tin Giao Hàng</h2>

                {errorMessage && <div className="error-message">{errorMessage}</div>}
                {successMessage && <div className="success-message">{successMessage}</div>}

                {/* Select existing address */}
                {!showAddNewAddress && userAddresses.length > 0 && (
                  <div className="address-selection">
                    <h3>Chọn Địa Chỉ Có Sẵn</h3>
                    <div className="address-list">
                      {userAddresses.map((address) => (
                        <label key={address.id} className="address-option">
                          <input
                            type="radio"
                            name="addressSelection"
                            value={address.id}
                            checked={selectedAddressId === address.id}
                            onChange={() => {
                              setSelectedAddressId(address.id);
                              fillFormWithAddress(address);
                            }}
                          />
                          <div className="address-info">
                            <p className="recipient-name">{address.recipientName} ({address.phone})</p>
                            <p className="address-text">{address.addressLine}, {address.ward}, {address.district}, {address.province}</p>
                            {address.isDefault && <span className="badge-default">Mặc định</span>}
                          </div>
                        </label>
                      ))}
                    </div>
                    <button
                      type="button"
                      className="btn-add-new"
                      onClick={() => {
                        setShowAddNewAddress(true);
                        setFormData((prev) => ({
                          ...prev,
                          recipientName: '',
                          phone: '',
                          address: '',
                          ward: '',
                          district: '',
                          city: '',
                          postalCode: '',
                          notes: '',
                        }));
                      }}
                    >
                      + Thêm Địa Chỉ Mới
                    </button>
                  </div>
                )}

                {/* Add new address form */}
                {showAddNewAddress && (
                  <div className="new-address-form">
                    <h3>Thêm Địa Chỉ Mới</h3>
                    <div className="form-group">
                      <label>Tên Người Nhận *</label>
                      <input
                        type="text"
                        name="recipientName"
                        value={formData.recipientName}
                        onChange={handleInputChange}
                        placeholder="Nhập tên người nhận"
                      />
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Email</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="example@email.com"
                        />
                      </div>
                      <div className="form-group">
                        <label>Số Điện Thoại *</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="0912 345 678"
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Địa Chỉ Chi Tiết *</label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Nhập địa chỉ cụ thể (Số nhà, đường phố)"
                      />
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Phường/Xã *</label>
                        <input
                          type="text"
                          name="ward"
                          value={formData.ward}
                          onChange={handleInputChange}
                          placeholder="Nhập phường/xã"
                        />
                      </div>
                      <div className="form-group">
                        <label>Quận/Huyện *</label>
                        <input
                          type="text"
                          name="district"
                          value={formData.district}
                          onChange={handleInputChange}
                          placeholder="Nhập quận/huyện"
                        />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Tỉnh/Thành Phố *</label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          placeholder="Nhập tỉnh/thành phố"
                        />
                      </div>
                      <div className="form-group">
                        <label>Mã Bưu Chính</label>
                        <input
                          type="text"
                          name="postalCode"
                          value={formData.postalCode}
                          onChange={handleInputChange}
                          placeholder="Mã bưu chính"
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Ghi Chú</label>
                      <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        placeholder="VD: Cách nhà trước tòa nhà màu xanh"
                        rows="3"
                      />
                    </div>
                    <button
                      type="button"
                      className="btn-cancel-new"
                      onClick={() => {
                        setShowAddNewAddress(false);
                        const defaultAddress = userAddresses.find((addr) => addr.isDefault) || userAddresses[0];
                        setSelectedAddressId(defaultAddress.id);
                        fillFormWithAddress(defaultAddress);
                      }}
                    >
                      ← Quay Lại Danh Sách Địa Chỉ
                    </button>
                  </div>
                )}
              </div>
            )}

            {step === 2 && (
              <div className="form-section">
                <h2>Phương Thức Thanh Toán</h2>

                <div className="payment-methods">
                  <label className="payment-method-option">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span className="option-label">💳 Thẻ Tín Dụng / Ghi Nợ</span>
                  </label>
                  <label className="payment-method-option">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bank"
                      checked={paymentMethod === 'bank'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span className="option-label">🏦 Chuyển Khoản Ngân Hàng</span>
                  </label>
                  <label className="payment-method-option">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="wallet"
                      checked={paymentMethod === 'wallet'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span className="option-label">📱 Ví Điện Tử</span>
                  </label>
                </div>

                {paymentMethod === 'card' && (
                  <div className="card-form">
                    <div className="form-group">
                      <label>Tên Chủ Thẻ</label>
                      <input
                        type="text"
                        name="cardName"
                        value={formData.cardName}
                        onChange={handleInputChange}
                        placeholder="Nhập tên trên thẻ"
                      />
                    </div>
                    <div className="form-group">
                      <label>Số Thẻ</label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleCardNumberChange}
                        placeholder="1234 5678 9012 3456"
                        maxLength="19"
                      />
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Hạn Sử Dụng</label>
                        <input
                          type="text"
                          name="expiryDate"
                          value={formData.expiryDate}
                          onChange={handleExpiryChange}
                          placeholder="MM/YY"
                          maxLength="5"
                        />
                      </div>
                      <div className="form-group">
                        <label>CVV</label>
                        <input
                          type="text"
                          name="cvv"
                          value={formData.cvv}
                          onChange={handleCVVChange}
                          placeholder="123"
                          maxLength="3"
                        />
                      </div>
                    </div>
                    <div className="security-info">
                      🔒 Thông tin thẻ của bạn được mã hóa và bảo mật
                    </div>
                  </div>
                )}

                {paymentMethod === 'bank' && (
                  <div className="bank-info">
                    <p>Vui lòng chuyển khoản đến tài khoản dưới đây:</p>
                    <div className="bank-details">
                      <div><strong>Ngân hàng:</strong> ACB (Ngân hàng Á Châu)</div>
                      <div><strong>Số tài khoản:</strong> 123456789</div>
                      <div><strong>Tên chủ tài khoản:</strong> CÔNG TY CỔ PHẦN THƯƠNG MỤC</div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'wallet' && (
                  <div className="wallet-info">
                    <p>Chọn ví điện tử để thanh toán</p>
                    <div className="wallet-options">
                      <button type="button" className="wallet-btn">Momo</button>
                      <button type="button" className="wallet-btn">ZaloPay</button>
                      <button type="button" className="wallet-btn">ViettelPay</button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {step === 3 && (
              <div className="form-section">
                <h2>Xác Nhận</h2>
                <div className="confirmation-section">
                  <div className="confirmation-block">
                    <h3>Địa Chỉ Giao Hàng</h3>
                    <p><strong>{formData.recipientName}</strong></p>
                    <p>{formData.address}, {formData.ward}, {formData.district}, {formData.city}</p>
                    <p>ĐT: {formData.phone}</p>
                    {formData.notes && <p>Ghi chú: {formData.notes}</p>}
                  </div>
                  <div className="confirmation-block">
                    <h3>Phương Thức Thanh Toán</h3>
                    <p>
                      {paymentMethod === 'card' && '💳 Thẻ Tín Dụng / Ghi Nợ'}
                      {paymentMethod === 'bank' && '🏦 Chuyển Khoản Ngân Hàng'}
                      {paymentMethod === 'wallet' && '📱 Ví Điện Tử'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="form-actions">
              {step > 1 && (
                <button className="btn btn-secondary" onClick={handlePreviousStep}>
                  ← Quay Lại
                </button>
              )}
              {step < 3 && (
                <button className="btn btn-primary" onClick={handleNextStep}>
                  Tiếp Tục →
                </button>
              )}
              {step === 3 && (
                <button className="btn btn-success" onClick={handleConfirmOrder} disabled={loading}>
                  {loading ? '⏳ Đang xử lý...' : '✓ Đặt Hàng Ngay'}
                </button>
              )}
            </div>
          </div>

          <div className="order-summary">
            <h3>Tóm Tắt Đơn Hàng</h3>
            {cartItems.length > 0 ? (
              <>
                <div className="cart-items">
                  {cartItems.map((item) => (
                    <div key={`${item.id}-${item.size}-${item.color}`} className="cart-item-summary">
                      <div className="item-image">
                        {item.imageUrl ? <img src={item.imageUrl} alt={item.name} /> : '📦'}
                      </div>
                      <div className="item-details">
                        <p className="item-name">{item.name}</p>
                        {item.size && <p className="item-size">Size: {item.size}</p>}
                        {item.color && <p className="item-color">Màu: {item.color}</p>}
                        <p className="item-qty">x{item.quantity}</p>
                      </div>
                      <div className="item-price">
                        {formatCurrency(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="summary-divider"></div>
                <div className="summary-row">
                  <span>Tạm Tính:</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="summary-row">
                  <span>Phí Vận Chuyển:</span>
                  <span>{shipping === 0 ? 'Miễn phí' : formatCurrency(shipping)}</span>
                </div>
                {shipping === 0 && (
                  <p className="free-shipping-note">🎉 Miễn phí vận chuyển cho đơn hàng từ 500.000 ₫</p>
                )}
                {discount > 0 && (
                  <div className="summary-row discount">
                    <span>Giảm Giá:</span>
                    <span>-{formatCurrency(discount)}</span>
                  </div>
                )}
                <div className="summary-divider"></div>
                <div className="summary-total">
                  <span>Tổng Tiền:</span>
                  <span>{formatCurrency(total)}</span>
                </div>
                <div className="payment-info">
                  <p>✓ Miễn phí vận chuyển cho đơn hàng trên 500.000đ</p>
                  <p>✓ Hỗ trợ 24/7</p>
                  <p>✓ Hoàn tiền 100% nếu không hài lòng</p>
                </div>
              </>
            ) : (
              <div className="empty-cart">
                <p>🛒 Giỏ hàng của bạn trống</p>
                <p>Vui lòng quay lại cửa hàng để thêm sản phẩm</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCheckout;
