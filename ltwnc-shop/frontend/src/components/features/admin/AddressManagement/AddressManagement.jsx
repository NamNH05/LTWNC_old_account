import React, { useState, useEffect, useRef } from 'react';
import { Table, Button, Modal, Form, Input, Select, message, Space, Popconfirm, Spin } from 'antd';
import './AddressManagement.css';

const SAMPLE_ADDRESSES = [
  {
    id: 1,
    fullName: 'Nguyễn Văn A',
    phone: '0901234567',
    address: '123 Đường ABC, Phường XYZ, Quận 1, TP.HCM',
    type: 'home',
    isDefault: true
  },
  {
    id: 2,
    fullName: 'Nguyễn Văn A',
    phone: '0901234567',
    address: '456 Đường DEF, Phường UVW, Quận 2, TP.HCM',
    type: 'work',
    isDefault: false
  },
  {
    id: 3,
    fullName: 'Trần Thị B',
    phone: '0912345678',
    address: '789 Đường GHI, Phường RST, Quận 3, TP.HCM',
    type: 'home',
    isDefault: false
  }
];

const AddressManagement = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [form] = Form.useForm();
  const isMountedRef = useRef(false);

  useEffect(() => {
    if (!isMountedRef.current) {
      isMountedRef.current = true;
      loadAddresses();
    }

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const loadAddresses = () => {
    setLoading(true);
    setAddresses(SAMPLE_ADDRESSES);
    setLoading(false);
  };

  const handleAddAddress = () => {
    setEditingAddress(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    form.setFieldsValue(address);
    setIsModalOpen(true);
  };

  const handleDeleteAddress = (id) => {
    setAddresses((prev) => prev.filter((address) => address.id !== id));
    message.success('Xóa địa chỉ thành công');
  };

  const handleSetDefault = (id) => {
    setAddresses((prev) =>
      prev.map((address) => ({
        ...address,
        isDefault: address.id === id
      }))
    );
    message.success('Đặt địa chỉ mặc định thành công');
  };

  const handleSubmit = (values) => {
    if (editingAddress) {
      const updatedAddress = { ...editingAddress, ...values };
      setAddresses((prev) => prev.map((item) => (item.id === editingAddress.id ? updatedAddress : item)));
      message.success('Cập nhật địa chỉ thành công');
    } else {
      const newAddress = {
        ...values,
        id: Math.max(...addresses.map(a => a.id)) + 1,
        isDefault: addresses.length === 0 // Đặt làm mặc định nếu là địa chỉ đầu tiên
      };
      setAddresses((prev) => [...prev, newAddress]);
      message.success('Thêm địa chỉ thành công');
    }
    setIsModalOpen(false);
  };

  const columns = [
    {
      title: 'Họ tên',
      dataIndex: 'fullName',
      key: 'fullName',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      render: (type) => {
        const typeLabels = {
          'home': 'Nhà riêng',
          'work': 'Nơi làm việc',
          'other': 'Khác'
        };
        return typeLabels[type] || type;
      }
    },
    {
      title: 'Mặc định',
      dataIndex: 'isDefault',
      key: 'isDefault',
      render: (isDefault) => (
        <span style={{
          color: isDefault ? '#52c41a' : '#999',
          fontWeight: isDefault ? 'bold' : 'normal'
        }}>
          {isDefault ? '✓ Mặc định' : 'Không'}
        </span>
      )
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space size="small">
          {!record.isDefault && (
            <Button
              type="link"
              size="small"
              onClick={() => handleSetDefault(record.id)}
            >
              Đặt mặc định
            </Button>
          )}
          <Button type="primary" size="small" onClick={() => handleEditAddress(record)}>
            Sửa
          </Button>
          <Popconfirm
            title="Xóa địa chỉ"
            description="Bạn chắc chắn muốn xóa địa chỉ này?"
            onConfirm={() => handleDeleteAddress(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button danger size="small">Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Spin spinning={loading}>
      <div className="admin-content">
        <div className="admin-header">
          <h1>Quản Lý Địa Chỉ Giao Hàng</h1>
          <Button type="primary" onClick={handleAddAddress}>
            Thêm Địa Chỉ
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={addresses}
          loading={loading}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />

        <Modal
          title={editingAddress ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ'}
          open={isModalOpen}
          onOk={() => form.submit()}
          onCancel={() => setIsModalOpen(false)}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
          >
            <Form.Item
              label="Họ tên"
              name="fullName"
              rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Số điện thoại"
              name="phone"
              rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Địa chỉ"
              name="address"
              rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
            >
              <Input.TextArea rows={3} />
            </Form.Item>

            <Form.Item
              label="Loại địa chỉ"
              name="type"
              rules={[{ required: true, message: 'Vui lòng chọn loại địa chỉ' }]}
            >
              <Select>
                <Select.Option value="home">Nhà riêng</Select.Option>
                <Select.Option value="work">Nơi làm việc</Select.Option>
                <Select.Option value="other">Khác</Select.Option>
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </Spin>
  );
};

export default AddressManagement;