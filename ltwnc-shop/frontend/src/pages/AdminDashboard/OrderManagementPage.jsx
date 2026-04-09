import React from 'react';
import AdminLayout from '../../components/ui/AdminLayout/AdminLayout';
import OrderManagement from '../../components/features/admin/OrderManagement/OrderManagement';

const OrderManagementPage = () => {
  return (
    <AdminLayout activePage="orders">
      <OrderManagement />
    </AdminLayout>
  );
};

export default OrderManagementPage;
