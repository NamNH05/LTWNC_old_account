import React, { useState, useEffect } from 'react';
import { Spin, Statistic, Row, Col, Card, Table, message } from 'antd';
import { useAuth } from '../../../../context/AuthContext';
import './RevenueDashboard.css';

const API_BASE_URL = 'http://localhost:8080/api';

const RevenueDashboard = () => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);

  // State cho dữ liệu từ API
  const [revenueData, setRevenueData] = useState([]);
  const [summary, setSummary] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    averageOrderValue: 0
  });

  // Load dữ liệu khi component mount
  useEffect(() => {
    loadRevenueData();
  }, []);

  const loadRevenueData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/admin/revenue`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to load revenue data');
      }

      const data = await response.json();
      setSummary(data.data?.summary || {
        totalRevenue: 0,
        totalOrders: 0,
        averageOrderValue: 0
      });
      setRevenueData(data.data?.dailyRevenue || []);
    } catch (error) {
      console.error('Error loading revenue data:', error);
      message.error('Lỗi khi tải dữ liệu doanh thu');
      setSummary({ totalRevenue: 0, totalOrders: 0, averageOrderValue: 0 });
      setRevenueData([]);
    } finally {
      setLoading(false);
    }
  };

  const totalRevenue = summary.totalRevenue || 0;
  const totalOrders = summary.totalOrders || 0;
  const avgOrderValue = summary.averageOrderValue || 0;

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(value || 0);
  };

  // Cột cho bảng doanh thu hàng ngày
  const revenueColumns = [
    {
      title: 'Ngày',
      dataIndex: 'date',
      key: 'date',
      render: (text) => new Date(text).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Doanh Thu',
      dataIndex: 'revenue',
      key: 'revenue',
      render: (text) => formatCurrency(text),
    },
  ];


  return (
    <div className="revenue-dashboard">
      <Spin spinning={loading} size="large">
        <div className="admin-header">
          <h1>Báo Cáo Doanh Thu</h1>
        </div>

        {/* Thống kê tổng quan */}
        <Row gutter={16} className="stats-section">
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Tổng Doanh Thu"
                value={totalRevenue}
                prefix={<span style={{ fontSize: '12px' }}>đ</span>}
                styles={{ content: { color: '#1890ff', fontSize: '20px' } }}
                formatter={(value) => formatCurrency(value)}
              />
              <p style={{ fontSize: '12px', color: '#999', marginTop: '8px' }}>Từ đầu tháng</p>
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Tổng Đơn Hàng"
                value={totalOrders}
                styles={{ content: { color: '#52c41a', fontSize: '20px' } }}
              />
              <p style={{ fontSize: '12px', color: '#999', marginTop: '8px' }}>Đơn hàng hoàn tất</p>
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Giá Trị Trung Bình"
                value={avgOrderValue}
                prefix={<span style={{ fontSize: '12px' }}>đ</span>}
                styles={{ content: { color: '#faad14', fontSize: '20px' } }}
                formatter={(value) => formatCurrency(value)}
              />
              <p style={{ fontSize: '12px', color: '#999', marginTop: '8px' }}>Mỗi đơn hàng</p>
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Tăng Trưởng"
                value={0}
                suffix="%"
                styles={{ content: { color: '#999', fontSize: '20px' } }}
              />
              <p style={{ fontSize: '12px', color: '#999', marginTop: '8px' }}>Đang cập nhật</p>
            </Card>
          </Col>
        </Row>

        {/* Bảng doanh thu hàng ngày */}
        <Card title="Chi Tiết Doanh Thu Hàng Ngày" style={{ marginTop: '24px' }} className="admin-card">
          <Table
            columns={revenueColumns}
            dataSource={revenueData.map((item, index) => ({ ...item, _key: item.date || index }))}
            loading={loading}
            rowKey="_key"
            locale={{ emptyText: 'Chưa có dữ liệu' }}
            pagination={{ pageSize: 10 }}
          />
        </Card>
      </Spin>
    </div>
  );
};

export default RevenueDashboard;
