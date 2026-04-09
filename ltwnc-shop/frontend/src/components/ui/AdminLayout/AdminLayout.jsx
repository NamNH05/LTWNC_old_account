import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Menu, message } from 'antd';
import { DashboardOutlined, ShoppingOutlined, UserOutlined, FileTextOutlined, BarChartOutlined, AuditOutlined, LogoutOutlined, HomeOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { useAuth } from '../../../context/AuthContext';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import './AdminLayout.css';

const { Sider, Content } = Layout;

const AdminLayout = ({ children, activePage = 'orders' }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    if (!user || (user.role && !user.role.toUpperCase().includes('ADMIN'))) {
      message.error('Bạn không có quyền truy cập trang này');
      navigate('/');
      return;
    }
  }, [user, navigate]);

  const handleMenuClick = ({ key }) => {
    switch (key) {
      case 'orders':
        navigate('/admin/orders');
        break;
      case 'profile':
        navigate('/profile');
        break;
      case 'address':
        navigate('/address');
        break;
      case 'logout':
        logout();
        navigate('/login');
        break;
      default:
        break;
    }
  };

  const menuItems = [
    {
      key: 'orders',
      icon: <FileTextOutlined />,
      label: 'Quản lý đơn hàng',
    },
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Thông tin tài khoản',
    },
    {
      key: 'address',
      icon: <EnvironmentOutlined />,
      label: 'Địa chỉ giao hàng',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Đăng xuất',
    },
  ];

  return (
    <div className="admin-page">
      <Header />
      <Layout style={{ minHeight: 'calc(100vh - 140px)' }}>
        <Sider width={250} theme="dark" className="admin-sider">
          <div className="admin-logo">
            <h2>
              <DashboardOutlined /> Admin Panel
            </h2>
          </div>
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[activePage]}
            items={menuItems}
            onClick={handleMenuClick}
          />
        </Sider>
        <Content className="admin-content">
          <div className="admin-container">{children}</div>
        </Content>
      </Layout>
      <Footer />
    </div>
  );
};

export default AdminLayout;
