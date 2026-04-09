import React from 'react';
import AdminLayout from '../../components/ui/AdminLayout/AdminLayout';
import UserManagement from '../../components/features/admin/UserManagement/UserManagement';

const UserManagementPage = () => {
  return (
    <AdminLayout activePage="users">
      <UserManagement />
    </AdminLayout>
  );
};

export default UserManagementPage;
