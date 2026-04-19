import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logger from '../../../../utils/logger';
import { validateRegisterForm } from '../../../../utils/validation';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    fullName: '',
    phone: '',
    terms: false
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const validation = validateRegisterForm(formData);
    setErrors(validation.errors);
    return validation.isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');

    if (validateForm()) {
      setLoading(true);
      try {
        // Call backend API
        const response = await fetch('http://localhost:8080/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            fullName: formData.fullName,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          setErrors({ submit: data.message || 'Đăng ký thất bại' });
          return;
        }

        // Show success message
        setSuccessMessage('Đăng ký thành công! Vui lòng đăng nhập.');
        
        // Reset form
        setFormData({
          username: '',
          email: '',
          password: '',
          fullName: '',
          phone: '',
          terms: false
        });

        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate('/login');
        }, 2000);

      } catch (error) {
        logger.error('Register error:', error);
        setErrors({ submit: 'Có lỗi xảy ra, vui lòng thử lại' });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-header">
          <div className="logo">
            <Link to="/" className="logo-link">
              <span className="logo-text">Sixedi</span>
            </Link>
          </div>
          <h2 className="register-title">
            Tạo tài khoản mới
          </h2>
          <p className="register-subtitle">
            Tham gia cùng hàng nghìn khách hàng tin tưởng Sixedi
          </p>
        </div>

        <div className="register-form-container">
          <form className="register-form" onSubmit={handleSubmit}>
            {errors.submit && <div className="error-message" style={{marginBottom: '15px', color: 'red'}}>{errors.submit}</div>}
            {successMessage && <div className="success-message" style={{marginBottom: '15px', color: 'green'}}>{successMessage}</div>}

            <div className="form-group">
              <label htmlFor="username" className="form-label">
                Tên tài khoản
              </label>
              <div className="input-group">
                <input
                  type="text"
                  id="username"
                  name="username"
                  className={`form-input ${errors.username ? 'error' : ''}`}
                  placeholder="Nhập tên tài khoản"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
              {errors.username && <span className="error-message">{errors.username}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <div className="input-group">
                <input
                  type="email"
                  id="email"
                  name="email"
                  className={`form-input ${errors.email ? 'error' : ''}`}
                  placeholder="user@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="fullName" className="form-label">
                Họ và tên
              </label>
              <div className="input-group">
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  className={`form-input ${errors.fullName ? 'error' : ''}`}
                  placeholder="Nhập họ và tên"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>
              {errors.fullName && <span className="error-message">{errors.fullName}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="phone" className="form-label">
                Số điện thoại
              </label>
              <div className="input-group">
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className={`form-input ${errors.phone ? 'error' : ''}`}
                  placeholder="Nhập số điện thoại"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
              {errors.phone && <span className="error-message">{errors.phone}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Mật khẩu
              </label>
              <div className="input-group">
                <input
                  type="password"
                  id="password"
                  name="password"
                  className={`form-input ${errors.password ? 'error' : ''}`}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            <div className="form-group">
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  id="terms"
                  name="terms"
                  className={`form-checkbox ${errors.terms ? 'error' : ''}`}
                  checked={formData.terms}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="terms" className="checkbox-label">
                  Tôi đồng ý với <a href="#" className="link">Điều khoản sử dụng</a> và <a href="#" className="link">Chính sách bảo mật</a>
                </label>
              </div>
              {errors.terms && <span className="error-message">{errors.terms}</span>}
            </div>

            <div className="form-group">
              <button type="submit" className="register-btn" disabled={loading}>
                {loading ? 'Đang đăng ký...' : 'Đăng ký tài khoản'}
              </button>
            </div>
          </form>

          <div className="login-link">
            <p>
              Đã có tài khoản? <Link to="/login" className="link">Đăng nhập ngay</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;