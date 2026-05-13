import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useToast } from '../../components/Common/AccountingToast';
import accountingService from '../../services/accountingService';
import InvoiceTable from '../../components/Tables/InvoiceTable';
import PaymentHistoryTable from '../../components/Tables/PaymentHistoryTable';
import PaymentConfirmationModal from '../../components/Modals/PaymentConfirmationModal';
import PrintableInvoiceTemplate from '../../components/Print/PrintableInvoiceTemplate';
import '../../styles/accounting.css';

const PaymentManagement = () => {
  const location = useLocation();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' or 'history'
  const [invoices, setInvoices] = useState([]);
  const [payments, setPayments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [printData, setPrintData] = useState(null);

  // Fetch initial data và tự động xử lý hóa đơn truyền sang
  const fetchData = async () => {
    try {
      setLoading(true);
      const [invoiceData, paymentData] = await Promise.all([
        accountingService.getInvoices(),
        accountingService.getPayments()
      ]);
      
      const invList = Array.isArray(invoiceData) ? invoiceData : (invoiceData?.data || []);
      setInvoices(invList);
      setPayments(Array.isArray(paymentData) ? paymentData : (paymentData?.data || []));

      // Xử lý autoPay từ sale-invoices trỏ qua
      if (location.state?.invoiceID && location.state?.autoPay) {
        const targetInv = invList.find(inv => inv.invoiceID === location.state.invoiceID);
        if (targetInv && targetInv.orderStatus !== 'Đã thanh toán') {
          setSelectedInvoice(targetInv);
          setIsModalOpen(true);
          // Xóa state để tránh mở lại khi reload
          window.history.replaceState({}, document.title);
        }
      }
    } catch (err) {
      console.error("Data Fetch Error:", err);
      showToast("Không thể tải dữ liệu!", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [location.state]);

  // Handle Payment Confirmation
  const handleConfirmPayment = async (paymentData) => {
    try {
      setModalLoading(true);
      await accountingService.recordPayment(selectedInvoice.invoiceID, {
        ...paymentData,
        customerName: selectedInvoice.customerName
      });
      
      showToast(`Đã thu tiền thành công cho hóa đơn ${selectedInvoice.displayID}`, "success");
      setIsModalOpen(false);
      setSelectedInvoice(null);
      await fetchData();
    } catch (err) {
      console.error("Payment Error:", err);
      showToast("Lỗi khi ghi nhận thanh toán!", "error");
    } finally {
      setModalLoading(false);
    }
  };

  // Handle Printing
  const handlePrint = (payment) => {
    const invoice = invoices.find(inv => inv.invoiceID === payment.invoiceID);
    if (!invoice) {
      showToast("Không tìm thấy dữ liệu hóa đơn liên quan!", "error");
      return;
    }

    const payDate = new Date(payment.paymentDate);

    setPrintData({
      detail: {
        ...invoice,
        date: payDate.toLocaleDateString('vi-VN'),
        time: payDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      },
      extendedData: {
        type: 'voucher',
        data: {
          id: payment.id,
          amount: payment.amount?.toLocaleString('vi-VN'),
          method: payment.method === 'Cash' ? 'Tiền mặt' : payment.method === 'Transfer' ? 'Chuyển khoản' : 'Thẻ/POS',
          recordedBy: payment.recordedBy,
          paymentDate: payment.paymentDate,
          customer: payment.customerName || invoice.customerName
        }
      }
    });

    // Trigger window.print sau khi render template
    setTimeout(() => {
      window.print();
      setPrintData(null);
    }, 300);
  };

  // Lọc Hóa đơn chờ thu
  const filteredInvoices = invoices.filter(inv => {
    const status = (inv.orderStatus || '').toString();
    const search = searchQuery.toLowerCase();
    const matchesSearch = 
      (inv.displayID || '').toLowerCase().includes(search) || 
      (inv.customerName || '').toLowerCase().includes(search) ||
      (inv.displayOrderID || '').toLowerCase().includes(search);
      
    return status !== 'Đã thanh toán' && matchesSearch;
  });

  // Lọc Hóa đơn ĐÃ quyết toán
  const filteredCompletedInvoices = invoices.filter(inv => {
    const status = (inv.orderStatus || '').toString();
    const search = searchQuery.toLowerCase();
    const matchesSearch = 
      (inv.displayID || '').toLowerCase().includes(search) || 
      (inv.customerName || '').toLowerCase().includes(search) ||
      (inv.displayOrderID || '').toLowerCase().includes(search);
      
    return status === 'Đã thanh toán' && matchesSearch;
  });

  const filteredPayments = payments.filter(pay => {
    const search = searchQuery.toLowerCase();
    return (
      (pay.displayInvoiceID || '').toLowerCase().includes(search) || 
      (pay.displayID || '').toLowerCase().includes(search) ||
      (pay.customerName || '').toLowerCase().includes(search)
    );
  });

  return (
    <div className="flex-1 flex flex-col min-h-0 w-full animate-fade-up" style={{ gap: 'var(--space-lg)' }}>
      {/* 
          NOTE KỸ THUẬT: KHÔNG ĐƯỢC CHỈNH SỬA CODE PLATFORM DESKTOP. 
          Các thay đổi Responsive phải sử dụng Utility classes (md:, lg:) 
          hoặc các class chuyên dụng trong accounting.css 
      */}

      {/* Header & Stats Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 shrink-0 px-1 acc-payment-header">
        <div className="space-y-1">
          <h1 className="text-acc-text-main leading-tight font-black text-3xl sm:text-4xl lg:text-[2rem] uppercase tracking-tight">THANH TOÁN & THU TIỀN</h1>
          <p className="text-sm sm:text-base text-acc-text-muted font-medium">Quản lý dòng tiền vào và lịch sử giao dịch khách hàng.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <div className="relative group w-full sm:min-w-[280px]">
            <input 
              type="text"
              name="search"
              autoComplete="off"
              placeholder="Tìm mã hóa đơn, tên khách…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-5 py-3 pl-12 text-label-xs focus:border-acc-primary focus:ring-1 focus:ring-acc-primary/5 transition-colors outline-none shadow-sm"
            />
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-acc-primary transition-colors" aria-hidden="true">search</span>
          </div>

          <button 
            onClick={fetchData}
            aria-label="Làm mới dữ liệu"
            className="w-full sm:w-12 h-12 bg-white rounded-xl border border-slate-200 flex items-center justify-center text-acc-text-muted hover:text-acc-primary transition active:scale-95 duration-200 shadow-sm"
          >
            <span className="material-symbols-outlined" aria-hidden="true">refresh</span>
            <span className="sm:hidden ml-2 font-black text-[10px] uppercase">Làm mới dữ liệu</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="acc-card flex-1 min-h-0 flex flex-col overflow-hidden p-4 sm:p-6 lg:p-10">
        {/* Tabs Control */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 pb-1 border-b border-slate-100 shrink-0 gap-4">
          <div className="flex gap-8 acc-tabs-scroll no-scrollbar">
            {[
              { id: 'pending', label: 'Hóa đơn chờ thu', icon: 'pending_actions', count: filteredInvoices.length },
              { id: 'completed', label: 'Hóa đơn đã quyết toán', icon: 'task_alt', count: filteredCompletedInvoices.length },
              { id: 'history', label: 'Lịch sử phiếu thu', icon: 'history', count: filteredPayments.length }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative pb-4 flex items-center gap-2 transition whitespace-nowrap ${
                  activeTab === tab.id 
                  ? 'text-acc-primary font-black scale-105' 
                  : 'text-acc-text-light font-bold hover:text-acc-text-muted'
                }`}
              >
                <span className={`material-symbols-outlined text-xl ${activeTab === tab.id ? 'fill-1' : ''}`}>{tab.icon}</span>
                <span className="text-[11px] sm:text-label-xs tracking-wide">{tab.label}</span>
                {tab.count > 0 && (
                  <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[9px] sm:text-[10px] ${
                    activeTab === tab.id ? 'bg-acc-primary text-white' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {tab.count}
                  </span>
                )}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-acc-primary rounded-full animate-in fade-in slide-in-from-bottom-2 duration-300" />
                )}
              </button>
            ))}
          </div>

          {activeTab === 'pending' && selectedInvoice && (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="acc-btn-primary w-full lg:w-auto px-6 py-2.5 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 active:scale-95 transition-all text-[11px] animate-in zoom-in slide-in-from-right-4 duration-300"
            >
              <span className="material-symbols-outlined text-lg">payments</span>
              Thu tiền cho {selectedInvoice.displayID || selectedInvoice.invoiceID}
            </button>
          )}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-slate-200">
          {activeTab === 'pending' ? (
            <InvoiceTable 
              invoices={filteredInvoices}
              loading={loading}
              selectedId={selectedInvoice?.invoiceID}
              onSelect={setSelectedInvoice}
            />
          ) : activeTab === 'completed' ? (
            <InvoiceTable 
              invoices={filteredCompletedInvoices}
              loading={loading}
              selectedId={null}
              isCompleted={true}
              onSelect={() => {}} // Hóa đơn đã xong thì không chọn để thu tiền tiếp
            />
          ) : (
            <PaymentHistoryTable 
              payments={filteredPayments}
              loading={loading}
              onPrint={handlePrint}
            />
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      <PaymentConfirmationModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        invoice={selectedInvoice}
        onConfirm={handleConfirmPayment}
        loading={modalLoading}
      />

      {/* Hidden Print Template */}
      {printData && (
        <PrintableInvoiceTemplate 
          detail={printData.detail} 
          extendedData={printData.extendedData} 
        />
      )}
    </div>
  );
};

export default PaymentManagement;
