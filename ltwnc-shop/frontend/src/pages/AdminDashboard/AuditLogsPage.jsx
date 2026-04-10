import React from 'react';
import AdminLayout from '../../components/ui/AdminLayout/AdminLayout';
import AuditLogsView from '../../components/features/admin/AuditLogs/AuditLogsView';

const AuditLogsPage = () => {
  return (
    <AdminLayout activePage="audit">
      <AuditLogsView />
    </AdminLayout>
  );
};

export default AuditLogsPage;
