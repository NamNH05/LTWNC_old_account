import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, message, Space, Popconfirm } from 'antd';
import AdminLayout from '../../components/ui/AdminLayout/AdminLayout';
import { mockAdminProducts } from '../../data/adminMockData';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    setProducts(mockAdminProducts);
    setLoading(false);
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    form.setFieldsValue(product);
    setIsModalOpen(true);
  };

  const handleDeleteProduct = async (id) => {
    setProducts((prev) => prev.filter((item) => item.id !== id));
    message.success('Đã xóa sản phẩm (giao diện demo)');
  };

  const handleSubmit = async (values) => {
    if (editingProduct) {
      setProducts((prev) =>
        prev.map((item) =>
          item.id === editingProduct.id ? { ...item, ...values } : item
        )
      );
      message.success('Đã cập nhật sản phẩm (giao diện demo)');
    } else {
      const nextId = products.length ? Math.max(...products.map((item) => item.id)) + 1 : 1;
      setProducts((prev) => [{ id: nextId, ...values }, ...prev]);
      message.success('Đã thêm sản phẩm (giao diện demo)');
    }
    setIsModalOpen(false);
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Danh mục',
      dataIndex: 'category',
      key: 'category',
      width: 100,
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      width: 120,
      render: (price) => `${price?.toLocaleString()}đ`,
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantum',
      key: 'quantum',
      width: 100,
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button type="primary" size="small" onClick={() => handleEditProduct(record)}>
            Sửa
          </Button>
          <Popconfirm
            title="Xóa sản phẩm"
            description="Bạn chắc chắn muốn xóa sản phẩm này?"
            onConfirm={() => handleDeleteProduct(record.id)}
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
    <AdminLayout activePage="products">
      <div className="admin-header">
        <h1>Quản Lý Sản Phẩm</h1>
        <Button type="primary" onClick={handleAddProduct}>
          Thêm Sản Phẩm
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={products}
        loading={loading}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingProduct ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm'}
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
            label="Tên sản phẩm"
            name="name"
            rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Danh mục"
            name="category"
            rules={[{ required: true, message: 'Vui lòng nhập danh mục' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Giá"
            name="price"
            rules={[{ required: true, message: 'Vui lòng nhập giá' }]}
          >
            <InputNumber min={0} />
          </Form.Item>

          <Form.Item
            label="Số lượng"
            name="quantum"
            rules={[{ required: true, message: 'Vui lòng nhập số lượng' }]}
          >
            <InputNumber min={0} />
          </Form.Item>

          <Form.Item
            label="Hình ảnh URL"
            name="imageUrl"
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Mô tả"
            name="description"
          >
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </AdminLayout>
  );
};

export default AdminDashboard;
