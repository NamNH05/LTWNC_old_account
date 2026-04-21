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

  const authHeaders = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  });

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
    message.info('Backend hiện chưa có API tạo địa chỉ trong trang admin này');
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    form.setFieldsValue({
      street: address.street,
      ward: address.ward,
      district: address.district,
      city: address.city,
      zipCode: address.zipCode,
      isDefault: address.isDefault,
      fullName: address.user?.fullName,
      phone: address.user?.phone,
    });
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
    message.info('Backend hiện chưa hỗ trợ đặt mặc định từ trang admin này');
  };

  const handleSubmit = async (values) => {
    try {
      if (!editingAddress) {
        message.error('Backend chưa hỗ trợ tạo địa chỉ từ trang admin này');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/admin/addresses/${editingAddress.id}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({
          street: values.street,
          ward: values.ward,
          district: values.district,
          city: values.city,
          zipCode: values.zipCode,
          isDefault: values.isDefault,
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update address');
      }

      const data = await response.json();
      setAddresses((prev) => prev.map((item) => (item.id === editingAddress.id ? data.data : item)));
      message.success('Cập nhật địa chỉ thành công');
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving address:', error);
      message.error('Lỗi khi lưu địa chỉ');
    }
  };

  const columns = [
    {
      title: 'Họ tên',
      dataIndex: ['user', 'fullName'],
      key: 'fullName',
    },
    {
      title: 'Số điện thoại',
      dataIndex: ['user', 'phone'],
      key: 'phone',
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'street',
      key: 'address',
      render: (_, record) => `${record.street}, ${record.ward}, ${record.district}, ${record.city}`,
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
              label="Số nhà, đường"
              name="street"
              rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Phường/Xã"
              name="ward"
              rules={[{ required: true, message: 'Vui lòng nhập phường/xã' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Quận/Huyện"
              name="district"
              rules={[{ required: true, message: 'Vui lòng nhập quận/huyện' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Tỉnh/Thành phố"
              name="city"
              rules={[{ required: true, message: 'Vui lòng nhập tỉnh/thành phố' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Mã bưu chính"
              name="zipCode"
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Mặc định"
              name="isDefault"
              rules={[{ required: true, message: 'Vui lòng chọn trạng thái mặc định' }]}
            >
              <Select>
                <Select.Option value={true}>Có</Select.Option>
                <Select.Option value={false}>Không</Select.Option>
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </Spin>
  );
};

export default AddressManagement;