import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Switch, Card, Button, message, Spin } from "antd";
import AdminLayout from "../../components/ui/AdminLayout/AdminLayout";
import { useModules } from "../../context/ModuleContext";
import api from "../../services/api";

const MODULES = [
  { key: "product", label: "Sản phẩm", description: "Cho phép truy cập và quản lý trang sản phẩm" },
  { key: "cart", label: "Giỏ hàng", description: "Cho phép người dùng thêm sản phẩm vào giỏ hàng" },
  { key: "order", label: "Đơn hàng", description: "Cho phép tạo và xử lý đơn hàng" },
  { key: "user", label: "Người dùng", description: "Cho phép quản lý thông tin người dùng" },
  { key: "address", label: "Địa chỉ", description: "Cho phép quản lý địa chỉ giao hàng" },
  { key: "payment", label: "Thanh toán", description: "Cho phép xử lý thanh toán" },
];

const ModuleManagementPage = () => {
  const navigate = useNavigate();
  const { moduleStatuses, refreshModuleStatuses } = useModules();
  const [savingModule, setSavingModule] = useState(null);

  const handleAuthError = () => {
    localStorage.removeItem("token");
    message.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
    navigate("/login");
  };

  useEffect(() => {
    refreshModuleStatuses();
  }, [refreshModuleStatuses]);

  const handleToggle = async (moduleName, isEnabled) => {
    setSavingModule(moduleName);
    try {
      await api.put(`/admin/modules/${moduleName}`, { isEnabled });
      message.success(`Module ${moduleName} đã ${isEnabled ? "bật" : "tắt"}.`);
      // Refresh toàn bộ module statuses từ context
      await refreshModuleStatuses();
    } catch (error) {
      console.error("Failed to update module status", error);
      if (error.message && error.message.includes("Invalid or expired token")) {
        handleAuthError();
      } else {
        message.error("Cập nhật trạng thái module thất bại.");
      }
    } finally {
      setSavingModule(null);
    }
  };

  if (!moduleStatuses || Object.keys(moduleStatuses).length === 0) {
    return (
      <AdminLayout activePage="modules">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <Spin size="large" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout activePage="modules">
      <div
        className="admin-header"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
          flexWrap: 'nowrap',
        }}
      >
        <div style={{ minWidth: 0 }}>
          <h1>Quản lý module</h1>
          <p style={{ margin: 0, color: 'rgba(0, 0, 0, 0.65)' }}>Bật/tắt tính năng theo module</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Button type="default" onClick={refreshModuleStatuses} style={{ whiteSpace: 'nowrap' }}>
            Làm mới
          </Button>
        </div>
      </div>

      <Card style={{ marginTop: 16, borderRadius: 12, boxShadow: '0 10px 30px rgba(0,0,0,0.04)' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '16px',
          }}
        >
          {MODULES.map((module) => {
            const enabled = moduleStatuses.hasOwnProperty(module.key)
              ? moduleStatuses[module.key]
              : true;

            return (
              <div
                key={module.key}
                style={{
                  padding: '20px',
                  borderRadius: '12px',
                  background: '#fff',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '16px',
                  minHeight: '120px',
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <div className="font-semibold text-lg">{module.label}</div>
                  <div className="text-sm text-slate-500">{module.description}</div>
                </div>
                <Switch
                  checked={enabled}
                  loading={savingModule === module.key}
                  onChange={(checked) => handleToggle(module.key, checked)}
                />
              </div>
            );
          })}
        </div>
      </Card>
    </AdminLayout>
  );
};

export default ModuleManagementPage;
