import React, { useState, useEffect } from 'react';
import { useToast } from '../../components/Common/AccountingToast';
import accountingService from '../../services/accountingService';
import DebtTable from '../../components/Tables/DebtTable';
import '../../styles/accounting.css';

const DebtTracker = () => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [debts, setDebts] = useState([]);
  const [filteredDebts, setFilteredDebts] = useState([]);
  const [summary, setSummary] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [riskFilter, setRiskFilter] = useState("all");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [autoDays, setAutoDays] = useState(localStorage.getItem('debt_auto_days') || "7");
  const [isAutoEnabled, setIsAutoEnabled] = useState(localStorage.getItem('debt_auto_enabled') === 'true');
  const [sortConfig, setSortConfig] = useState({ key: 'remainingAmount', direction: 'desc' });

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleToggleAuto = (id) => {
    const item = debts.find(d => d.invoiceID === id);
    if (item && !item.email) {
      showToast(`Không thể bật tự động cho ${item.customerName} vì chưa có email`, "warning");
      return;
    }

    setDebts(prev => prev.map(debt => 
      debt.invoiceID === id ? { ...debt, autoRemind: !debt.autoRemind } : debt
    ));
    showToast("Đã cập nhật trạng thái tự động nhắc nợ", "success");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await accountingService.getDebtReport();
        setDebts(data.data || []);
        setFilteredDebts(data.data || []);
        setSummary(data.summary);
      } catch (err) {
        console.error("Debt API Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Logic lọc dữ liệu
  useEffect(() => {
    let result = debts;
    
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(d =>
        // SQL-aligned: tìm theo customerName (computed) hoặc invoiceID
        (d.customerName      || '').toLowerCase().includes(q) ||
        (String(d.invoiceID) || '').toLowerCase().includes(q) ||
        (d.companyName       || '').toLowerCase().includes(q)
      );
    }
    
    if (riskFilter !== 'all') {
      result = result.filter(d => d.riskLevel === riskFilter);
    }

    // Logic Sắp xếp
    if (sortConfig.key) {
      result = [...result].sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];

        // Xử lý các trường đặc biệt
        if (sortConfig.key === 'lastReminderDate') {
          // Parse "DD/MM/YYYY" hoặc null
          const parseDate = (d) => {
            if (!d) return 0;
            const [day, month, year] = d.split('/').map(Number);
            return new Date(year, month - 1, day).getTime();
          };
          aVal = parseDate(aVal);
          bVal = parseDate(bVal);
        }

        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    
    setFilteredDebts(result);
  }, [searchQuery, riskFilter, debts, sortConfig]);

  const saveSettings = () => {
    localStorage.setItem('debt_auto_days', autoDays);
    localStorage.setItem('debt_auto_enabled', isAutoEnabled);
    setIsSettingsOpen(false);
    showToast(`Đã lưu cấu hình: Tự động nhắc nợ đang ${isAutoEnabled ? 'BẬT' : 'TẮT'}`, "success");
  };

  // ── Email validation: gửi nhắc nợ đơn lẻ qua Backend
  const handleReminder = async (item) => {
    if (!item.email) {
      showToast(`Không thể gửi: ${item.customerName} chưa có email`, 'error');
      return;
    }
    
    try {
      // Gọi service - khi ghép BE sẽ gọi endpoint /api/reminders/send
      await accountingService.sendDebtReminder(item.invoiceID);
      showToast(`Đã gửi nhắc nợ tới ${item.email}`, 'success');
    } catch (error) {
      showToast("Không thể kết nối máy chủ gửi mail", "error");
    }
  };

  // ── Batch reminder: gửi hàng loạt tới các KH có email
  const handleBatchReminder = async () => {
    const withEmail = filteredDebts.filter(d => !!d.email);
    const noEmail   = filteredDebts.filter(d => !d.email);
    
    if (withEmail.length === 0) {
      showToast('Không có khách hàng nào có email để gửi', 'error');
      return;
    }

    try {
      const ids = withEmail.map(d => d.invoiceID);
      // Gọi service - khi ghép BE sẽ gọi endpoint /api/reminders/batch-send
      await accountingService.sendBatchReminders(ids);

      const msg = noEmail.length > 0
        ? `Đã gửi ${withEmail.length} nhắc nợ · ${noEmail.length} KH chưa có email (bỏ qua)`
        : `Đã gửi nhắc nợ tới ${withEmail.length} khách hàng`;
      showToast(msg, 'success');
    } catch (error) {
      showToast("Lỗi khi gửi nhắc nợ hàng loạt", "error");
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 w-full animate-fade-up" style={{ gap: 'var(--space-md)' }}>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-8 shrink-0 px-4 md:px-2">
        <div className="space-y-1 md:space-y-2">
          <h1 className="text-acc-text-main leading-tight font-black text-3xl sm:text-4xl lg:text-[2rem] uppercase tracking-tight">QUẢN LÝ CÔNG NỢ</h1>
          <p className="text-body-sm md:text-body-base text-acc-text-muted font-medium flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-acc-error animate-pulse shrink-0"></span>
            <span className="line-clamp-1 md:line-clamp-none">Theo dõi khoản nợ từ hóa đơn quá hạn.</span>
          </p>
        </div>

        <div className="flex items-center gap-2 md:gap-3 justify-start md:justify-end">
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="w-10 h-10 md:w-[60px] md:h-[60px] flex-shrink-0 bg-white rounded-xl md:rounded-2xl border border-slate-200 flex items-center justify-center text-acc-text-muted hover:text-acc-primary hover:border-acc-primary/30 transition shadow-sm"
            aria-label="Cấu hình tự động"
          >
            <span className="material-symbols-outlined text-[20px] md:text-[28px]" aria-hidden="true">settings</span>
          </button>

          <button
            onClick={handleBatchReminder}
            className="acc-btn-primary flex-none bg-acc-error hover:bg-red-700 shadow-lg shadow-red-900/10 hover:shadow-red-900/20 py-2.5 px-4 md:py-4 md:px-8 rounded-xl md:rounded-2xl flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-lg md:text-xl" aria-hidden="true">campaign</span>
            <span className="font-black text-[12px] md:text-sm tracking-tight">
              <span className="inline md:hidden">NHẮC LOẠT</span>
              <span className="hidden md:inline">GỬI NHẮC NỢ HÀNG LOẠT</span>
            </span>
          </button>
        </div>
      </div>

      {/* Filter Bar - UI/UX Pro Max Style */}
      <div className="flex flex-col md:flex-row gap-4 px-1">
        <div className="flex-1 relative group">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-acc-text-light group-focus-within:text-acc-primary transition-colors">search</span>
          <input 
            type="text"
            placeholder="Tìm kiếm khách hàng, mã hóa đơn…"
            className="w-full pl-12 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-acc-primary/5 focus:border-acc-primary outline-none transition-all font-medium text-acc-text-main shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          {['all', 'critical', 'high', 'medium'].map((f) => (
            <button
              key={f}
              onClick={() => setRiskFilter(f)}
              className={`px-6 py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${
                riskFilter === f 
                ? 'bg-acc-primary text-white shadow-lg shadow-blue-900/20 scale-105' 
                : 'bg-white text-acc-text-light border border-slate-200 hover:border-acc-primary/40'
              }`}
            >
              {f === 'all' ? 'Tất cả' : f === 'critical' ? 'Rất nguy cấp' : f === 'high' ? 'Cảnh báo cao' : 'Cần theo dõi'}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 acc-summary-grid" style={{ gap: 'var(--space-md)' }}>
        <div className="acc-card group shadow-float" style={{ padding: '1.25rem' }}>
          <p className="text-label-xs text-acc-text-light" style={{ marginBottom: 'var(--space-base)' }}>Tổng nợ phải thu</p>
          <div className="flex items-center justify-between">
            <h3 className="acc-summary-value text-acc-text-main">{loading ? "---" : summary?.totalDebt}</h3>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-acc-primary flex items-center justify-center border border-blue-100/50 shadow-inner group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-2xl" aria-hidden="true">account_balance_wallet</span>
            </div>
          </div>
        </div>
        
        <div className="acc-card group shadow-float" style={{ padding: '1.25rem' }}>
          <p className="text-label-xs text-acc-error" style={{ marginBottom: 'var(--space-base)' }}>Nợ quá hạn</p>
          <div className="flex items-center justify-between">
            <h3 className="acc-summary-value text-acc-error">{loading ? "---" : summary?.overdueDebt}</h3>
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-acc-error flex items-center justify-center border border-red-100 shadow-sm group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-2xl" aria-hidden="true">error_outline</span>
            </div>
          </div>
        </div>

        <div className="acc-card group shadow-float border-acc-accent/10" style={{ padding: '1.25rem' }}>
          <p className="text-label-xs text-acc-text-light" style={{ marginBottom: 'var(--space-base)' }}>Số lượng khách hàng</p>
          <div className="flex items-center justify-between">
            <h3 className="acc-summary-value text-acc-text-main">{loading ? "---" : summary?.customerCount}</h3>
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-2xl" aria-hidden="true">groups</span>
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="acc-card flex-1 min-h-0 flex flex-col overflow-hidden" style={{ padding: 'var(--space-lg)' }}>
        <h3 className="text-label-xs text-acc-text-main shrink-0" style={{ marginBottom: 'var(--space-md)' }}>Chi tiết nợ từng khách hàng</h3>
        <div className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-slate-200">
          <DebtTable 
            debts={filteredDebts}
            loading={loading}
            onReminder={handleReminder}
            onToggleAuto={handleToggleAuto}
            isMasterAutoEnabled={isAutoEnabled}
            sortConfig={sortConfig}
            onSort={handleSort}
          />
        </div>
      </div>

      {/* Settings Modal - Glassmorphism UI */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-fade-in" onClick={() => setIsSettingsOpen(false)}></div>
          <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-zoom-in">
            <div className="p-8 pb-4 flex items-center justify-between">
              <h3 className="text-xl font-black text-acc-text-main">Cấu hình tự động</h3>
              <button 
                onClick={() => setIsSettingsOpen(false)}
                className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center transition"
                aria-label="Đóng"
              >
                <span className="material-symbols-outlined" aria-hidden="true">close</span>
              </button>
            </div>
            
            <div className="p-8 pt-2 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="space-y-1">
                    <p className="text-body-base font-black text-acc-text-main">Chế độ nhắc nợ</p>
                    <p className="text-body-xs text-acc-text-light font-medium">Bật/tắt tự động gửi mail cho toàn hệ thống</p>
                  </div>
                  <div 
                    role="switch"
                    aria-checked={isAutoEnabled}
                    aria-label="Bật/tắt tự động nhắc nợ toàn hệ thống"
                    tabIndex={0}
                    onClick={() => setIsAutoEnabled(!isAutoEnabled)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setIsAutoEnabled(!isAutoEnabled);
                      }
                    }}
                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors cursor-pointer outline-none focus-visible:ring-4 focus-visible:ring-acc-primary/20 ${isAutoEnabled ? 'bg-acc-primary' : 'bg-slate-300'}`}
                  >
                    <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${isAutoEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-blue-50/50 border border-blue-100/50 rounded-2xl">
                  <span className="material-symbols-outlined text-acc-primary" aria-hidden="true">info</span>
                  <p className="text-body-sm text-acc-primary font-bold">Hệ thống sẽ tự động gửi email nhắc nợ sau một số ngày nhất định kể từ khi quá hạn.</p>
                </div>

                <div className="space-y-2">
                  <label htmlFor="auto-days-range" className="text-label-xs text-acc-text-light font-black uppercase">Thời gian nhắc nợ (Ngày)</label>
                  <div className="flex items-center gap-4">
                    <input 
                      id="auto-days-range"
                      type="range" 
                      min="1" 
                      max="30" 
                      step="1"
                      className="flex-1 accent-acc-primary h-2 bg-slate-100 rounded-full cursor-pointer"
                      value={autoDays}
                      onChange={(e) => setAutoDays(e.target.value)}
                    />
                    <div className="w-16 h-12 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center font-black text-acc-primary">
                      {autoDays}
                    </div>
                  </div>
                  <div className="flex justify-between text-[10px] font-bold text-acc-text-light uppercase px-1">
                    <span>1 ngày</span>
                    <span>30 ngày</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex gap-3">
                <button 
                  onClick={() => setIsSettingsOpen(false)}
                  className="flex-1 py-4 rounded-xl font-black text-[11px] uppercase tracking-widest text-acc-text-light hover:bg-slate-50 transition"
                >
                  Hủy bỏ
                </button>
                <button 
                  onClick={saveSettings}
                  className="flex-1 py-4 bg-acc-primary text-white rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-acc-accent shadow-lg shadow-blue-900/10 transition"
                >
                  Lưu cấu hình
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DebtTracker;
