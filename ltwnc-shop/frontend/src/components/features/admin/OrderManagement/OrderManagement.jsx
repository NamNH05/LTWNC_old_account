import React, { useState, useEffect, useRef } from 'react';
import { Table, Button, Modal, Form, Input, Select, message, Space, Popconfirm, Spin } from 'antd';
import { useAuth } from '../../../../context/AuthContext';
import './OrderManagement.css';

const API_BASE_URL = 'http://localhost:8080/api';

const OrderManagement = () => {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [form] = Form.useForm();
  const [searchTerm, setSearchTerm] = useState('');
  const isMountedRef = useRef(false);

  useEffect(() => {
    if (!isMountedRef.current) {
      isMountedRef.current = true;
      loadOrders();
    }

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/admin/orders`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to load orders');
      }

      const data = await response.json();
      setOrders(data.data.orders || []);
    } catch (error) {
      console.error('Error loading orders:', error);
      message.error('Lỗi khi tải danh sách đơn hàng');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEditOrder = (order) => {
    setEditingOrder(order);
    form.setFieldsValue(order);
    setIsModalOpen(true);
  };

  const handleDeleteOrder = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/orders/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete order');
      }

      setOrders((prev) => prev.filter((order) => order.id !== id));
      message.success('Xóa đơn hàng thành công');
    } catch (error) {
      console.error('Error deleting order:', error);
      message.error('Lỗi khi xóa đơn hàng');
    }
  };

  const handleSubmit = async (values) => {
    if (!editingOrder) {
      message.error('Không thể thêm đơn hàng mới từ admin dashboard');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/admin/orders/${editingOrder.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status: values.status
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update order');
      }

      const updatedOrder = {
        ...editingOrder,
        status: values.status
      };

      setOrders((prev) => prev.map((item) => (item.id === editingOrder.id ? updatedOrder : item)));
      message.success('Cập nhật đơn hàng thành công');
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error updating order:', error);
      message.error('Lỗi khi cập nhật đơn hàng');
    }
  };

  const columns = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'id',
      key: 'id',
      render: (id) => `#${id}`,
    },
    {
      title: 'ID Khách hàng',
      dataIndex: ['user', 'id'],
      key: 'userId',
    },
    {
      title: 'Số tiền',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (totalPrice) => `${Number(totalPrice).toLocaleString('vi-VN')} ₫`,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const statusColor = {
          PENDING: '#ffc53d',
          CONFIRMED: '#1890ff',
          SHIPPED: '#52c41a',
          DELIVERED: '#13c2c2',
          CANCELLED: '#ff4d4f'
        };
        const statusLabel = {
          PENDING: 'Chờ xử lý',
          CONFIRMED: 'Xác nhận',
          SHIPPED: 'Đã gửi',
          DELIVERED: 'Đã giao',
          CANCELLED: 'Đã hủy'
        };
        return (
          <span
            style={{
              color: '#fff',
              backgroundColor: statusColor[status] || '#999',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '12px'
            }}
          >
            {statusLabel[status] || status}
          </span>
        );
      }
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'shippingAddr',
      key: 'shippingAddr',
      render: (shippingAddr) => shippingAddr || 'Chưa xác định',
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt) => (createdAt ? new Date(createdAt).toLocaleDateString('vi-VN') : '-'),
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button type="primary" size="small" onClick={() => handleEditOrder(record)}>
            Sửa
          </Button>
          <Popconfirm
            title="Xóa đơn hàng"
            description="Bạn chắc chắn muốn xóa đơn hàng này?"
            onConfirm={() => handleDeleteOrder(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button danger size="small">
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    }
  ];

  const filteredOrders = orders.filter((order) => {
    const search = searchTerm.toLowerCase();
    return (
      !search ||
      `#${order.id}`.toLowerCase().includes(search) ||
      `${order.userId}`.toLowerCase().includes(search) ||
      order.shippingAddr?.toLowerCase().includes(search) ||
      order.status?.toLowerCase().includes(search)
    );
  });

  return (
    <Spin spinning={loading}>
      <div className="admin-content">
        <div className="admin-header">
          <h1>Quản Lý Đơn Hàng</h1>
          <Button onClick={() => loadOrders()} style={{ marginLeft: '10px' }}>
            Làm mới
          </Button>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <Input
            placeholder="Tìm kiếm theo mã đơn, ID khách, địa chỉ hoặc trạng thái..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ maxWidth: '400px' }}
          />
        </div>

        <Table
          columns={columns}
          dataSource={filteredOrders}
          loading={loading}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />

        <Modal
          title="Cập nhật trạng thái đơn hàng"
          open={isModalOpen}
          onOk={() => form.submit()}
          onCancel={() => setIsModalOpen(false)}
        >
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            {editingOrder && (
              <>
                <Form.Item label="Mã đơn hàng">
                  <Input value={`#${editingOrder.id}`} disabled />
                </Form.Item>
                <Form.Item label="ID Khách hàng">
                  <Input value={editingOrder.customerId} disabled />
                </Form.Item>
                <Form.Item label="Số tiền">
                  <Input value={`${Number(editingOrder.total).toLocaleString('vi-VN')} ₫`} disabled />
                </Form.Item>
                <Form.Item label="Địa chỉ">
                  <Input value={editingOrder.address || 'Chưa xác định'} disabled />
                </Form.Item>
                <Form.Item label="Ngày đặt">
                  <Input value={editingOrder.createdAt ? new Date(editingOrder.createdAt).toLocaleDateString('vi-VN') : '-'} disabled />
                </Form.Item>
              </>
            )}
            <Form.Item
              label="Trạng thái"
              name="status"
              rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
            >
              <Select
                options={[
                  { value: 'PENDING', label: 'Chờ xử lý' },
                  { value: 'PAID', label: 'Đã thanh toán' },
                  { value: 'SHIPPED', label: 'Đã gửi' },
                  { value: 'DELIVERED', label: 'Đã giao' },
                  { value: 'CANCELLED', label: 'Đã hủy' }
                ]}
              />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </Spin>
  );
};

export default OrderManagement;
