import React from 'react';
import { Routes, Route } from 'react-router-dom';

import LoginPage from './features/auth/LoginPage';
import MainLayout from './components/Layout/MainLayout';

// Sales & Admin (Từ GitHub - Đã Pull về)
import CustomerList from './features/sales/CustomerList';
import CustomerCreate from './features/sales/CustomerCreate';
import OrderManager from './features/admin/pages/OrderManagement';

// Kế toán (Accounting Module - Phát triển cục bộ)
import AccountingDashboard from './features/accounting/dashboard/index.jsx';
import InvoiceList from './features/accounting/invoices/index.jsx';
import InvoiceDetail from './features/accounting/invoices/invoice_details.jsx';
import DebtTracker from './features/accounting/debts/index.jsx';
import PaymentList from './features/accounting/payments/index.jsx';
import PaymentDetail from './features/accounting/payments/detail.jsx';
import AccountingReport from './features/accounting/reports/accounting/index.jsx';
import AccountingLayout from './features/accounting/components/Layout/AccountingLayout';
import TransactionDetail from './features/accounting/dashboard/TransactionDetail.jsx';
import StaffManagement from './features/staffs/StaffManagement.jsx';
import StaffCreate from './features/staffs/StaffCreate.jsx';
import ProductManagement from './features/admin/products/ProductManagement.jsx';
import AddProduct from './features/admin/products/AddProduct.jsx';
import CategoryManagement from './features/admin/category/CategoryManagement.jsx';
import AddCategory from './features/admin/category/AddCategory.jsx';
import PriceManagement from './features/admin/prices/PriceManagement.jsx';
import PriceCreate from './features/admin/prices/AddPrice.jsx';
function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      
      {/* Tuyến đường Sales & Admin sử dụng MainLayout (Cấu trúc mới từ GitHub) */}
      <Route path="/home" element={<MainLayout />}>
        {/* Đường dẫn mặc định khi vào /home */}
        <Route index element={<div className="p-4">Đây là trang Dashboard tổng quan</div>} />
        
        {/* Tuyến đường con: /home/customers và /home/orders */}
        <Route path="customers" element={<CustomerList />} />
        <Route path="customers/add" element={<CustomerCreate />} />
        <Route path="orders" element={<OrderManager />} />
        <Route path="staffs" element={<StaffManagement />} />
        <Route path="staffs/add" element={<StaffCreate />} />
        <Route path="products" element={<ProductManagement />} />
        <Route path="products/add" element={<AddProduct />} />
        <Route path="categories" element={<CategoryManagement />} />
        <Route path="categories/add" element={<AddCategory />} />
        <Route path="prices" element={<PriceManagement />} />
        <Route path="prices/add" element={<PriceCreate />} />
      </Route>
      
      {/* Tuyến đường Kế toán sử dụng AccountingLayout (Phát triển cục bộ) */}
      <Route path="/accounting" element={<AccountingLayout />}>
        <Route index element={<AccountingDashboard />} />
        <Route path="sales-invoices" element={<InvoiceList />} />
        <Route path="sales-invoices/detail" element={<InvoiceDetail />} />
        <Route path="debts" element={<DebtTracker />} />
        <Route path="payments" element={<PaymentList />} />
        <Route path="payments/detail" element={<PaymentDetail />} />
        <Route path="reports" element={<AccountingReport />} />
        <Route path="transaction/:id" element={<TransactionDetail />} />
      </Route>
    </Routes>
  );
}

export default App;