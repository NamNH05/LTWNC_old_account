import React from 'react';
import AdminLayout from '../../components/ui/AdminLayout/AdminLayout';
import RevenueDashboard from '../../components/features/admin/RevenueDashboard/RevenueDashboard';

const RevenueDashboardPage = () => {
  return (
    <AdminLayout activePage="revenue">
      <RevenueDashboard />
    </AdminLayout>
  );
};

export default RevenueDashboardPage;
