import React from 'react';
import { Routes, Route } from 'react-router-dom';

import LoginPage from './features/auth/login';
import MainLayout from './components/Layout/MainLayout';
import AdminLayout from './features/admin/components/Layout/AdminLayout';
import SalesLayout from './features/sales/components/Layout/SalesLayout';

// === MODULE ADMIN ===
import AdminDashboard from './features/admin/pages/AdminDashboard.jsx';
import StaffManagement from './features/admin/staffs/StaffManagement.jsx';
import StaffCreate from './features/admin/staffs/StaffCreate.jsx';
import ProductManagement from './features/admin/products/ProductManagement.jsx';
import AddProduct from './features/admin/products/AddProduct.jsx';
import CategoryManagement from './features/admin/category/CategoryManagement.jsx';
import AddCategory from './features/admin/category/AddCategory.jsx';

// === MODULE SALES ===
import SalesDashboard from './features/sales/pages/SalesDashboard.jsx';
import CustomerList from './features/sales/CustomerList';
import CustomerCreate from './features/sales/CustomerCreate';
import OrderManager from './features/admin/pages/OrderManagement'; // Dùng chung từ admin
import PriceManagement from './features/admin/prices/PriceManagement.jsx'; // Dùng chung từ admin
import PriceCreate from './features/admin/prices/AddPrice.jsx'; // Dùng chung từ admin

// === MODULE KẾ TOÁN (Accounting) ===
import AccountingDashboard from './features/accounting/dashboard/index.jsx';
import InvoiceList from './features/accounting/invoices/index.jsx';
import InvoiceDetail from './features/accounting/invoices/invoice_details.jsx';
import DebtTracker from './features/accounting/debts/index.jsx';
import PaymentList from './features/accounting/payments/index.jsx';
import PaymentDetail from './features/accounting/payments/detail.jsx';
import AccountingReport from './features/accounting/reports/accounting/index.jsx';
import AccountingLayout from './features/accounting/components/Layout/AccountingLayout';
import TransactionDetail from './features/accounting/dashboard/TransactionDetail.jsx';

// === MODULE KHO HÀNG (Warehouse) ===
import WarehouseLayout from './features/warehouse/components/Layout/WarehouseLayout';
import WarehouseDashboard from './features/warehouse/pages/WarehouseDashboard';
import DeliveryOrders from './features/warehouse/pages/DeliveryOrders';
import DeliveryDetail from './features/warehouse/pages/DeliveryDetail';
import StockImport from './features/warehouse/pages/StockImport';
import InventoryReport from './features/warehouse/pages/InventoryReport';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      
      {/* Tuyến đường Home chính - chọn các module */}
      <Route path="/home" element={<MainLayout />}>
        <Route index element={<div className="p-4 flex h-full items-center justify-center text-gray-500">Vui lòng chọn một Module từ Sidebar để tiếp tục</div>} />
      </Route>
      
      {/* Tuyến đường Admin Module */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="staffs" element={<StaffManagement />} />
        <Route path="staffs/add" element={<StaffCreate />} />
        <Route path="products" element={<ProductManagement />} />
        <Route path="products/add" element={<AddProduct />} />
        <Route path="categories" element={<CategoryManagement />} />
        <Route path="categories/add" element={<AddCategory />} />
      </Route>

      {/* Tuyến đường Sales Module */}
      <Route path="/sales" element={<SalesLayout />}>
        <Route index element={<SalesDashboard />} />
        <Route path="customers" element={<CustomerList />} />
        <Route path="customers/add" element={<CustomerCreate />} />
        <Route path="products" element={<ProductManagement />} />
        <Route path="orders" element={<OrderManager />} />
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

      {/* Tuyến đường Kho hàng sử dụng WarehouseLayout */}
      <Route path="/warehouse" element={<WarehouseLayout />}>
        <Route index element={<WarehouseDashboard />} />
        <Route path="delivery" element={<DeliveryOrders />} />
        <Route path="delivery/:id" element={<DeliveryDetail />} />
        <Route path="stock-import" element={<StockImport />} />
        <Route path="inventory" element={<InventoryReport />} />
      </Route>
    </Routes>
  );
}

export default App;