import React, { useState, useEffect, useRef } from 'react';
import { Table, Button, Modal, Form, Input, Select, message, Space, Popconfirm, Spin } from 'antd';
import { useAuth } from '../../../../context/AuthContext';
import './AddressManagement.css';

const API_BASE_URL = 'http://localhost:8080/api';

const AddressManagement = () => {
  const { token } = useAuth();
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

  const loadAddresses = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/admin/addresses`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to load addresses');
      }

      const data = await response.json();
      setAddresses(data.data.addresses || []);
    } catch (error) {
      console.error('Error loading addresses:', error);
      message.error('Lỗi khi tải danh sách địa chỉ');
      setAddresses([]);
    } finally {
      setLoading(false);
    }
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

  const handleDeleteAddress = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/addresses/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete address');
      }

      setAddresses((prev) => prev.filter((address) => address.id !== id));
      message.success('Xóa địa chỉ thành công');
    } catch (error) {
      console.error('Error deleting address:', error);
      message.error('Lỗi khi xóa địa chỉ');
    }
  };

  const handleSetDefault = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/addresses/${id}/set-default`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to set default address');
      }

      setAddresses((prev) =>
        prev.map((address) => ({
          ...address,
          isDefault: address.id === id
        }))
      );
      message.success('Đặt địa chỉ mặc định thành công');
    } catch (error) {
      console.error('Error setting default address:', error);
      message.error('Lỗi khi đặt địa chỉ mặc định');
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (editingAddress) {
        const response = await fetch(`${API_BASE_URL}/admin/addresses/${editingAddress.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(values)
        });

        if (!response.ok) {
          throw new Error('Failed to update address');
        }

        const updatedAddress = { ...editingAddress, ...values };
        setAddresses((prev) => prev.map((item) => (item.id === editingAddress.id ? updatedAddress : item)));
        message.success('Cập nhật địa chỉ thành công');
      } else {
        const response = await fetch(`${API_BASE_URL}/admin/addresses`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            ...values,
            isDefault: addresses.length === 0
          })
        });

        if (!response.ok) {
          throw new Error('Failed to create address');
        }

        const data = await response.json();
        setAddresses((prev) => [...prev, data.data]);
        message.success('Thêm địa chỉ thành công');
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving address:', error);
      message.error('Lỗi khi lưu địa chỉ');
    }
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