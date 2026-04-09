import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, message, Space, Popconfirm, Spin } from 'antd';
import { mockAdminUsers } from '../../../../data/adminMockData';
import './UserManagement.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    setUsers(mockAdminUsers);
    setLoading(false);
  };

  const handleAddUser = () => {
    setEditingUser(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    form.setFieldsValue(user);
    setIsModalOpen(true);
  };

  const handleDeleteUser = async (id) => {
    setUsers((prev) => prev.filter((item) => item.id !== id));
    message.success('Đã xóa người dùng (giao diện demo)');
  };

  const handleSubmit = async (values) => {
    if (editingUser) {
      setUsers((prev) =>
        prev.map((item) =>
          item.id === editingUser.id ? { ...item, ...values } : item
        )
      );
      message.success('Đã cập nhật người dùng (giao diện demo)');
    } else {
      const nextId = users.length ? Math.max(...users.map((item) => item.id)) + 1 : 1;
      setUsers((prev) => [{ id: nextId, ...values }, ...prev]);
      message.success('Đã thêm người dùng (giao diện demo)');
    }
    setIsModalOpen(false);
  };

  const columns = [
    {
      title: 'Tên',
      dataIndex: 'fullName',
      key: 'fullName',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Điện thoại',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      render: (role) => {
        const roleColors = {
          'ADMIN': '#ff4d4f',
          'USER': '#1890ff',
          'STAFF': '#52c41a'
        };
        return (
          <span style={{
            color: '#fff',
            backgroundColor: roleColors[role?.toUpperCase()] || '#999',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px'
          }}>
            {role?.toUpperCase()}
          </span>
        );
      }
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const statusColors = {
          'active': '#52c41a',
          'inactive': '#999',
          'suspended': '#ffc53d'
        };
        return (
          <span style={{
            color: '#fff',
            backgroundColor: statusColors[status] || '#999',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px'
          }}>
            {status === 'active' ? 'Hoạt động' : status === 'inactive' ? 'Không hoạt động' : 'Tạm khóa'}
          </span>
        );
      }
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button type="primary" size="small" onClick={() => handleEditUser(record)}>
            Sửa
          </Button>
          <Popconfirm
            title="Xóa người dùng"
            description="Bạn chắc chắn muốn xóa người dùng này?"
            onConfirm={() => handleDeleteUser(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button danger size="small">Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const filteredUsers = users.filter(user => {
    const search = searchTerm.toLowerCase();
    return !search || 
           user.fullName?.toLowerCase().includes(search) ||
           user.email?.toLowerCase().includes(search) ||
           user.phone?.includes(search);
  });

  return (
    <Spin spinning={loading}>
      <div className="admin-content">
        <div className="admin-header">
          <h1>Quản Lý Người Dùng</h1>
          <Button type="primary" onClick={handleAddUser}>
            Thêm Người Dùng
          </Button>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <Input
            placeholder="Tìm kiếm theo tên, email hoặc số điện thoại..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ maxWidth: '300px' }}
          />
        </div>

        <Table
          columns={columns}
          dataSource={filteredUsers}
          loading={loading}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />

        <Modal
          title={editingUser ? 'Chỉnh sửa người dùng' : 'Thêm người dùng'}
          open={isModalOpen}
          onOk={() => form.submit()}
          onCancel={() => setIsModalOpen(false)}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
          >
            {!editingUser && (
              <Form.Item
                label="Tên đăng nhập"
                name="username"
                rules={[
                  { required: true, message: 'Vui lòng nhập tên đăng nhập' },
                  { min: 3, max: 50, message: 'Tên đăng nhập phải có 3-50 ký tự' }
                ]}
              >
                <Input placeholder="Ví dụ: user123" />
              </Form.Item>
            )}

            {!editingUser && (
              <Form.Item
                label="Mật khẩu"
                name="password"
                rules={[
                  { required: true, message: 'Vui lòng nhập mật khẩu' },
                  { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' }
                ]}
              >
                <Input.Password placeholder="Nhập mật khẩu" />
              </Form.Item>
            )}

            <Form.Item
              label="Tên đầy đủ"
              name="fullName"
              rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: 'Vui lòng nhập email' },
                { type: 'email', message: 'Email không hợp lệ' }
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Điện thoại"
              name="phone"
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Vai trò"
              name="role"
              rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}
            >
              <Select>
                <Select.Option value="ADMIN">Admin</Select.Option>
                <Select.Option value="USER">Người dùng</Select.Option>
                <Select.Option value="STAFF">Nhân viên</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Trạng thái"
              name="status"
              rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
            >
              <Select>
                <Select.Option value="active">Hoạt động</Select.Option>
                <Select.Option value="inactive">Không hoạt động</Select.Option>
                <Select.Option value="suspended">Tạm khóa</Select.Option>
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </Spin>
  );
};

export default UserManagement;