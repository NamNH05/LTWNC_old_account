import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Home from "../pages/Home/Home";
import RegisterPage from "../pages/Register/Register";
import CategoryPage from "../pages/CategoryPage/CategoryPage";
import ProductDetailPage from "../pages/ProductDetail/ProductDetail";
import SearchPage from "../pages/Search/Search";
import CartPage from "../pages/Cart/Cart";
import OrderManagement from "../pages/OrderManagement/OrderManagement";
import ProfilePage from "../pages/Profile/Profile";
import AdminProductsPage from "../pages/AdminDashboard/AdminProductsPage";
import OrderManagementPage from "../pages/AdminDashboard/OrderManagementPage";
import RevenueDashboardPage from "../pages/AdminDashboard/RevenueDashboardPage";
import UserManagementPage from "../pages/AdminDashboard/UserManagementPage";
import AuditLogsPage from "../pages/AdminDashboard/AuditLogsPage";
import AddressPage from "../pages/Address/AddressPage";
import PaymentPage from "../pages/Payment/PaymentPage";
import PaymentCallback from "../pages/Payment/PaymentCallback";
import AuthCallback from "../pages/AuthCallback";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/san-pham" element={<CategoryPage />} />
        <Route path="/nam" element={<CategoryPage />} />
        <Route path="/nu" element={<CategoryPage />} />
        <Route path="/giay" element={<CategoryPage />} />
        <Route path="/phu-kien" element={<CategoryPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<OrderManagement />} />
        <Route path="/admin/products" element={<AdminProductsPage />} />
        <Route path="/admin/orders" element={<OrderManagementPage />} />
        <Route path="/admin/revenue" element={<RevenueDashboardPage />} />
        <Route path="/admin/users" element={<UserManagementPage />} />
        <Route path="/admin/audit-logs" element={<AuditLogsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/address" element={<AddressPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/payment/callback" element={<PaymentCallback />} />
        <Route path="/login" element={<Login />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
