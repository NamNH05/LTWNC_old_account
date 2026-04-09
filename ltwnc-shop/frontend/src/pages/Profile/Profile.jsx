import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import Header from '../../components/ui/Header/Header';
import Footer from '../../components/ui/Footer/Footer';
import { useAuth } from '../../context/AuthContext';
import './Profile.css';

const DEFAULT_FORM = {
  fullName: '',
  email: '',
  phone: ''
};

const validateProfileForm = (formData) => {
  const errors = {};

  if (!formData.fullName.trim()) {
    errors.fullName = 'Họ tên là bắt buộc';
  }

  if (!formData.email.trim()) {
    errors.email = 'Email là bắt buộc';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = 'Email không hợp lệ';
  }

  if (!formData.phone.trim()) {
    errors.phone = 'Số điện thoại là bắt buộc';
  } else if (!/^\d{9,11}$/.test(formData.phone)) {
    errors.phone = 'Số điện thoại không hợp lệ';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

const ProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState(DEFAULT_FORM);
  const [originalData, setOriginalData] = useState(DEFAULT_FORM);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const userData = {
      fullName: user.fullName || user.name || '',
      email: user.email || '',
      phone: user.phone || ''
    };
    setFormData(userData);
    setOriginalData(userData);
  }, [user, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validation = validateProfileForm(formData);

    if (!validation.isValid) {
      setErrors(validation.errors);
      message.error('Vui lòng kiểm tra lại các trường thông tin');
      return;
    }

    setOriginalData(formData);
    setIsEditing(false);
    message.success('Thông tin tài khoản đã được lưu');
  };

  const handleCancel = () => {
    setFormData(originalData);
    setErrors({});
    setIsEditing(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="profile-content">
            <div className="content-header">
              <h2>Thông tin tài khoản</h2>
              <p>Quản lý thông tin cá nhân của bạn</p>
            </div>

            <form onSubmit={handleSubmit} className="profile-form">
              <div className="form-section">
                <div className="section-header">
                  <h3>Thông tin cơ bản</h3>
                  {!isEditing && (
                    <button
                      type="button"
                      className="edit-btn"
                      onClick={() => setIsEditing(true)}
                    >
                      ✏️ Chỉnh sửa
                    </button>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="fullName">Họ tên</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={errors.fullName ? 'input-error' : ''}
                  />
                  {errors.fullName && <span className="error-message">{errors.fullName}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={errors.email ? 'input-error' : ''}
                  />
                  {errors.email && <span className="error-message">{errors.email}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Số điện thoại</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={errors.phone ? 'input-error' : ''}
                  />
                  {errors.phone && <span className="error-message">{errors.phone}</span>}
                </div>
              </div>

              {isEditing && (
                <div className="form-actions">
                  <button type="submit" className="save-btn">
                    💾 Lưu thay đổi
                  </button>
                  <button type="button" className="cancel-btn" onClick={handleCancel}>
                    ✕ Hủy
                  </button>
                </div>
              )}
            </form>
          </div>
        );

      case 'orders':
        return (
          <div className="orders-content">
            <div className="content-header">
              <h2>Đơn hàng của tôi</h2>
              <p>Lịch sử mua hàng và trạng thái đơn hàng</p>
            </div>

            <div className="empty-state">
              <p>Bạn chưa có đơn hàng nào.</p>
              <span>Đây là giao diện hiển thị đơn hàng thuần ui, chưa kết nối API.</span>
            </div>
          </div>
        );

      case 'addresses':
        return (
          <div className="addresses-content">
            <div className="content-header">
              <h2>Địa chỉ giao hàng</h2>
              <p>Quản lý địa chỉ giao hàng của bạn</p>
            </div>

            <div className="address-list">
              <div className="address-card">
                <h4>Địa chỉ mặc định</h4>
                <p>123 Đường ABC, Phường XYZ, Quận 1, TP.HCM</p>
                <p>Điện thoại: 0909 123 456</p>
              </div>
              <div className="address-card">
                <h4>Địa chỉ khác</h4>
                <p>456 Phố DEF, Phường UVW, Quận 3, TP.HCM</p>
                <p>Điện thoại: 0919 987 654</p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="profile-page">
      <Header />

      <main className="profile-container">
        <div className="profile-layout">
          <aside className="profile-sidebar">
            <div className="user-info">
              <div className="user-avatar">
                <span>{formData.fullName.charAt(0) || 'U'}</span>
              </div>
              <div className="user-details">
                <h3>Tài khoản của</h3>
                <p>{formData.fullName || 'Người dùng'}</p>
              </div>
            </div>

            <nav className="profile-nav">
              <button
                className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('profile')}
              >
                <span className="material-icons">person</span>
                <span>Thông tin tài khoản</span>
              </button>
              <button
                className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`}
                onClick={() => setActiveTab('orders')}
              >
                <span className="material-icons">receipt_long</span>
                <span>Đơn hàng của tôi</span>
              </button>
              <button
                className={`nav-item ${activeTab === 'addresses' ? 'active' : ''}`}
                onClick={() => setActiveTab('addresses')}
              >
                <span className="material-icons">location_on</span>
                <span>Địa chỉ giao hàng</span>
              </button>
            </nav>
          </aside>

          <div className="profile-main">{renderContent()}</div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProfilePage;
