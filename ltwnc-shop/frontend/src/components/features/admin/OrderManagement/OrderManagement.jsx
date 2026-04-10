import React, { useState, useEffect, useRef } from 'react';
import { Table, Button, Modal, Form, Input, Select, message, Space, Popconfirm, Spin } from 'antd';
import './OrderManagement.css';

const SAMPLE_ORDERS = [
  {
    id: 101,
    customerId: 55,
    total: 1299000,
    status: 'PENDING',
    address: '123 Nguyễn Trãi, Quận 1, TP.HCM',
    createdAt: '2026-04-05T10:15:00Z'
  },
  {
    id: 102,
    customerId: 56,
    total: 890000,
    status: 'PAID',
    address: '78 Lê Lợi, Quận 3, TP.HCM',
    createdAt: '2026-04-06T14:30:00Z'
  },
  {
    id: 103,
    customerId: 57,
    total: 450000,
    status: 'SHIPPED',
    address: '12 Trần Hưng Đạo, Quận 5, TP.HCM',
    createdAt: '2026-04-07T09:20:00Z'
  },
  {
    id: 104,
    customerId: 58,
    total: 1590000,
    status: 'DELIVERED',
    address: '45 Phạm Ngũ Lão, Quận 1, TP.HCM',
    createdAt: '2026-04-08T16:50:00Z'
  }
];

const OrderManagement = () => {
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

  const loadOrders = () => {
    setLoading(true);
    setOrders(SAMPLE_ORDERS);
    setLoading(false);
  };

  const handleEditOrder = (order) => {
    setEditingOrder(order);
    form.setFieldsValue(order);
    setIsModalOpen(true);
  };

  const handleDeleteOrder = (id) => {
    setOrders((prev) => prev.filter((order) => order.id !== id));
    message.success('Xóa đơn hàng thành công');
  };

  const handleSubmit = (values) => {
    if (!editingOrder) {
      message.error('Không thể thêm đơn hàng mới từ admin dashboard');
      return;
    }

    const updatedOrder = {
      ...editingOrder,
      status: values.status
    };

    setOrders((prev) => prev.map((item) => (item.id === editingOrder.id ? updatedOrder : item)));
    message.success('Cập nhật đơn hàng thành công');
    setIsModalOpen(false);
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
      dataIndex: 'customerId',
      key: 'customerId',
    },
    {
      title: 'Số tiền',
      dataIndex: 'total',
      key: 'total',
      render: (total) => `${Number(total).toLocaleString('vi-VN')} ₫`,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const statusColor = {
          PENDING: '#ffc53d',
          PAID: '#1890ff',
          SHIPPED: '#52c41a',
          DELIVERED: '#13c2c2',
          CANCELLED: '#ff4d4f'
        };
        const statusLabel = {
          PENDING: 'Chờ xử lý',
          PAID: 'Đã thanh toán',
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
      dataIndex: 'address',
      key: 'address',
      render: (address) => address || 'Chưa xác định',
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
      `${order.customerId}`.toLowerCase().includes(search) ||
      order.address?.toLowerCase().includes(search) ||
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
