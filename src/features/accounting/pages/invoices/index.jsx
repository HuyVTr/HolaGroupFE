import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import '../../styles/accounting.css';
import accountingService from '../../services/accountingService';
import dbData from '../../mockdata/db.json';
import { exportToPDF } from '../../utils/exportUtils';
import PrintableInvoiceTemplate from '../../components/Print/PrintableInvoiceTemplate';

// --- SUB-COMPONENTS ---

const StatusBadgeDropdown = ({ status, onStatusChange, onOpenChange, openUp = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const wrapperRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    if (onOpenChange) onOpenChange(isOpen);
  }, [isOpen]);

  const statuses = [
    { label: 'Đã thanh toán', style: 'bg-emerald-50 text-emerald-600 border-emerald-100', icon: 'check_circle' },
    { label: 'Chờ thanh toán', style: 'bg-amber-50 text-amber-600 border-amber-100', icon: 'schedule' },
    { label: 'T.Toán một phần', style: 'bg-blue-50 text-blue-600 border-blue-100', icon: 'payments' },
    { label: 'Quá hạn', style: 'bg-rose-50 text-rose-600 border-rose-100', icon: 'warning' }
  ];

  const contentRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      const isOutsideWrapper = wrapperRef.current && !wrapperRef.current.contains(event.target);
      const isOutsideContent = contentRef.current && !contentRef.current.contains(event.target);
      
      if (isOutsideWrapper && isOutsideContent) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        setCoords({ top: rect.top, left: rect.left });
      }
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const currentStatus = statuses.find(s => s.label === status) || statuses[1];

  return (
    <div className="relative inline-block ml-auto mr-auto lg:mx-0" ref={wrapperRef}>
      <button 
        ref={buttonRef}
        aria-label="Thay đổi trạng thái" 
        onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }} 
        className={`px-4 py-1.5 rounded-xl text-[9px] font-black border uppercase tracking-wider inline-flex items-center justify-center gap-2 min-w-[140px] transition-all hover:scale-105 active:scale-95 shadow-sm ${currentStatus.style}`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-current"></span>{status}<span aria-label="Mở" className="material-symbols-outlined text-[10px]">expand_more</span>
      </button>

      {isOpen && createPortal(
        <div 
          ref={contentRef}
          className="fixed w-max min-w-[15rem] bg-white/95 backdrop-blur-xl rounded-[1.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 p-2 z-[9999] animate-fade-in"
          style={{
            top: openUp ? (coords.top - 180) : (coords.top + 40),
            left: coords.left + 70,
            transform: 'translateX(-50%)'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {statuses.map((s, i) => (
            <button 
              key={i} 
              onClick={(e) => { 
                e.stopPropagation(); 
                onStatusChange(s.label); 
                setIsOpen(false); 
              }} 
              className={`w-full px-4 py-2.5 text-[9px] font-black uppercase tracking-widest flex items-center gap-3 transition-colors hover:bg-slate-50 whitespace-nowrap ${status === s.label ? 'text-acc-primary' : 'text-slate-500'}`}
            >
              <span aria-hidden="true" className={`material-symbols-outlined text-base ${s.style.split(' ')[1]}`}>{s.icon}</span>{s.label}{status === s.label && <span className="material-symbols-outlined ml-auto text-sm">check</span>}
            </button>
          ))}
        </div>,
        document.body
      )}
    </div>
  );
};

const SearchableCustomerSelect = ({ selectedCustomer, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const customers = dbData.customers || [];
  const wrapperRef = useRef(null);

  // Helper to get full name
  const getFullName = (c) => c.companyName || `${c.lastName} ${c.firstName}`;

  // Initialize searchTerm with the name if selectedCustomer is an ID
  const getInitialName = () => {
    if (!selectedCustomer) return '';
    const found = customers.find(c => c.customerID === Number(selectedCustomer));
    return found ? getFullName(found) : selectedCustomer;
  };

  const [searchTerm, setSearchTerm] = useState(getInitialName());

  useEffect(() => {
    function handleClickOutside(event) { if (wrapperRef.current && !wrapperRef.current.contains(event.target)) setIsOpen(false); }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setSearchTerm(getInitialName());
  }, [selectedCustomer]);

  const filtered = customers.filter(c => {
    const name = getFullName(c);
    return name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.phoneNumber && c.phoneNumber.includes(searchTerm));
  });

  return (
    <div className="relative" ref={wrapperRef}>
      <div className="relative group">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-300 group-focus-within:text-acc-primary transition-colors">person</span>
        <input 
          type="text"
          placeholder="Tìm hoặc nhập tên khách hàng mới..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
            onSelect(e.target.value); // Allow free text
          }}
          onFocus={() => setIsOpen(true)}
          className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl py-3.5 pl-12 pr-10 text-sm font-black text-acc-text-main outline-none focus:border-acc-primary/30 focus:bg-white transition-all placeholder:text-slate-300"
        />
        {searchTerm && (
          <button 
            type="button"
            onClick={() => { setSearchTerm(''); onSelect(''); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-rose-500 transition-colors"
          >
            <span className="material-symbols-outlined text-base">cancel</span>
          </button>
        )}
      </div>

      {isOpen && filtered.length > 0 && (
        <div className="absolute z-[200] top-full left-0 w-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-fade-in">
          <div className="max-h-60 overflow-y-auto no-scrollbar p-1">
            {filtered.map(c => {
              const fullName = getFullName(c);
              return (
                <button
                  key={c.customerID}
                  type="button"
                  onClick={() => {
                    onSelect(c.customerID);
                    setSearchTerm(fullName);
                    setIsOpen(false);
                  }}
                  className="w-full text-left p-3 hover:bg-slate-50 rounded-xl flex items-center justify-between transition-colors group"
                >
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-acc-text-main group-hover:text-acc-primary">{fullName}</span>
                    <span className="text-[10px] text-slate-400">{c.phoneNumber || 'Không có SĐT'}</span>
                  </div>
                  {Number(selectedCustomer) === c.customerID && <span className="material-symbols-outlined text-acc-primary text-base">check_circle</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

const ProductCategoryLinkedSelect = ({ 
  selectedCategoryID, 
  selectedProductID, 
  selectedName,
  onSelect 
}) => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [isCatOpen, setIsCatOpen] = useState(false);
  const [isProdOpen, setIsProdOpen] = useState(false);
  const [catSearch, setCatSearch] = useState('');
  const [prodSearch, setProdSearch] = useState(selectedName || '');

  const catRef = useRef(null);
  const prodRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      const [cats, prods] = await Promise.all([
        accountingService.getCategories(),
        accountingService.getProducts()
      ]);
      setCategories(cats);
      setProducts(prods);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (catRef.current && !catRef.current.contains(e.target)) setIsCatOpen(false);
      if (prodRef.current && !prodRef.current.contains(e.target)) setIsProdOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (selectedCategoryID) {
      const cat = categories.find(c => c.categoryID === selectedCategoryID);
      if (cat) setCatSearch(cat.categoryName);
    } else {
      setCatSearch('');
    }
  }, [selectedCategoryID, categories]);

  useEffect(() => {
    if (selectedProductID) {
      const prod = products.find(p => p.productID === selectedProductID);
      if (prod) setProdSearch(prod.productName);
    } else if (!selectedName) {
      setProdSearch('');
    }
  }, [selectedProductID, products, selectedName]);

  const filteredCategories = categories.filter(c => 
    c.categoryName.toLowerCase().includes(catSearch.toLowerCase())
  );

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.productName.toLowerCase().includes(prodSearch.toLowerCase());
    const matchesCategory = selectedCategoryID ? p.categoryID === selectedCategoryID : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      {/* Category Cell */}
      <td className="p-3 relative" style={{ zIndex: 60 }} ref={catRef} data-label="Danh mục">
        <div className="relative group">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-300 text-sm group-focus-within:text-acc-primary transition-colors">category</span>
          <input 
            type="text"
            placeholder="Danh mục..."
            value={catSearch}
            onChange={(e) => {
              setCatSearch(e.target.value);
              setIsCatOpen(true);
              onSelect({ categoryID: null, categoryName: e.target.value });
            }}
            onFocus={() => setIsCatOpen(true)}
            className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl py-2.5 pl-9 pr-3 text-[12px] font-black focus:border-acc-primary/30 focus:bg-white outline-none transition-all placeholder:text-slate-300"
          />
        </div>
        {isCatOpen && filteredCategories.length > 0 && (
          <div className="absolute z-[160] top-full left-0 w-64 bg-white shadow-2xl border border-slate-100 rounded-xl mt-1 max-h-56 overflow-y-auto no-scrollbar animate-fade-in p-1">
            {filteredCategories.map(cat => (
              <button
                key={cat.categoryID}
                type="button"
                onClick={() => {
                  onSelect({ categoryID: cat.categoryID, categoryName: cat.categoryName });
                  setCatSearch(cat.categoryName);
                  setIsCatOpen(false);
                }}
                className={`w-full px-3 py-2 text-left text-[10px] font-black uppercase tracking-tight rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap overflow-hidden text-ellipsis ${selectedCategoryID === cat.categoryID ? 'text-acc-primary bg-blue-50/50' : 'text-slate-600'}`}
              >
                {cat.categoryName}
              </button>
            ))}
          </div>
        )}
      </td>

      {/* Product Cell */}
      <td className="p-3 relative" style={{ zIndex: 50 }} ref={prodRef} data-label="Sản phẩm">
        <div className="relative group">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-300 text-sm group-focus-within:text-acc-primary transition-colors">inventory_2</span>
          <input 
            type="text"
            placeholder="Tìm sản phẩm hoặc nhập tên mới..."
            value={prodSearch}
            onChange={(e) => {
              setProdSearch(e.target.value);
              setIsProdOpen(true);
              onSelect({ name: e.target.value });
            }}
            onFocus={() => setIsProdOpen(true)}
            className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl py-2.5 pl-9 pr-3 text-[12px] font-black focus:border-acc-primary/30 focus:bg-white outline-none transition-all placeholder:text-slate-300"
          />
        </div>
        {isProdOpen && (
          <div className="absolute z-[160] top-full left-0 w-full md:min-w-[400px] bg-white shadow-2xl border border-slate-100 rounded-xl mt-1 max-h-64 overflow-y-auto no-scrollbar animate-fade-in p-1">
            {filteredProducts.length === 0 ? (
              <div className="p-4 text-center text-slate-400 text-[9px] font-black uppercase">Không tìm thấy sản phẩm cũ</div>
            ) : filteredProducts.map(prod => (
              <button
                key={prod.productID}
                type="button"
                onClick={() => {
                  const cat = categories.find(c => c.categoryID === prod.categoryID);
                  onSelect({ 
                    productID: prod.productID, 
                    categoryID: prod.categoryID,
                    categoryName: cat?.categoryName,
                    name: prod.productName,
                    price: prod.salePrice
                  });
                  setIsProdOpen(false);
                }}
                className={`w-full px-3 py-2.5 text-left rounded-lg hover:bg-slate-50 transition-colors border-b border-slate-50/50 last:border-0 ${selectedProductID === prod.productID ? 'bg-blue-50/30' : ''}`}
              >
                <div className="flex justify-between items-center">
                  <div className="flex flex-col min-w-0">
                    <span className="text-[12px] font-black text-acc-text-main truncate">{prod.productName}</span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest truncate">
                      {categories.find(c => c.categoryID === prod.categoryID)?.categoryName || 'Sản phẩm'}
                    </span>
                  </div>
                  <span className="text-[10px] font-black text-acc-primary tabular-nums">{prod.salePrice.toLocaleString()} VND</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </td>
    </>
  );
};

const InvoiceDetailModal = ({ isOpen, onClose, invoice }) => {
  if (!isOpen || !invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    const fileName = `HoaDon_${invoice.orderID || invoice.id}.pdf`;
    await exportToPDF('printable-area', fileName);
  };

  const subtotal = (invoice.items || []).reduce((sum, item) => sum + (item.quantity * (item.unitPrice || item.price || 0)), 0);
  const adjustment = (invoice.fees?.shipping || 0) + (invoice.fees?.handling || 0) + (invoice.fees?.insurance || 0) - (invoice.fees?.discount || 0);
  const finalTotal = subtotal + adjustment;
  const paid = invoice.paidAmount || 0;
  const remaining = Math.max(0, finalTotal - paid);
  const percent = Math.min(100, Math.round((paid / finalTotal) * 100)) || 0;

  return createPortal(
    <div className="fixed inset-0 z-[150] overflow-y-auto sm:overflow-hidden animate-fade-in acc-modal-overlay">
      {/* Backdrop cho Desktop/iPad - Ẩn trên Mobile */}
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md" onClick={onClose} />

      <div className="flex items-center justify-center p-0 sm:p-4 pointer-events-none min-h-full">
        <div className="relative w-full max-w-4xl bg-white sm:bg-white/95 sm:backdrop-blur-xl rounded-none sm:rounded-[2.5rem] shadow-none sm:shadow-[0_40px_100px_rgba(0,0,0,0.2)] sm:border border-white/20 overflow-hidden sm:overflow-hidden animate-zoom-in flex flex-col h-full sm:h-auto sm:max-h-[85vh] pointer-events-auto acc-modal-content font-manrope">
          <div className="px-6 sm:px-8 py-6 sm:py-8 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white/50 gap-4 sm:gap-0 relative overflow-hidden">
            <div className="flex items-center gap-3 sm:gap-5">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl sm:rounded-3xl bg-acc-primary/10 flex items-center justify-center text-acc-primary">
                <span aria-hidden="true" className="material-symbols-outlined text-2xl sm:text-3xl">description</span>
              </div>
              <div className="space-y-0.5 sm:space-y-1">
                <h2 className="text-xl sm:text-2xl font-black text-acc-text-main uppercase tracking-tight">Chi tiết Hóa đơn</h2>
                <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-[9px] sm:text-[11px] font-bold text-acc-text-light uppercase tracking-widest">
                  <span>Mã hóa đơn:</span><span className="text-acc-primary font-black">{invoice.displayID}</span>
                  <span className="hidden sm:inline mx-2 opacity-20">|</span>
                  <span>Ngày tạo:</span><span className="text-acc-text-main font-black">{invoice.date}</span>
                </div>
              </div>
            </div>

            {/* Floating Buttons for Mobile Header */}
            <div className="absolute top-4 sm:top-auto right-4 sm:right-auto sm:relative flex items-center gap-2 sm:gap-3 z-[10]">
              <button aria-label="In hóa đơn chuyên nghiệp" onClick={handlePrint} className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white/80 backdrop-blur-md sm:bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-acc-primary transition-[background-color,color,transform] flex items-center justify-center active:scale-95 shadow-lg sm:shadow-sm border border-slate-100 sm:border-none">
                <span aria-hidden="true" className="material-symbols-outlined text-xl sm:text-2xl">print</span>
              </button>
              <button aria-label="Đóng cửa sổ chi tiết" onClick={onClose} className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white/80 backdrop-blur-md sm:bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-all flex items-center justify-center active:scale-95 shadow-lg sm:shadow-sm border border-slate-100 sm:border-none">
                <span aria-hidden="true" className="material-symbols-outlined text-xl sm:text-2xl">close</span>
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 md:p-8 no-scrollbar space-y-8 min-h-0 acc-modal-scroll-area" style={{ WebkitOverflowScrolling: 'touch' }}>
            <div className="pb-10 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                <div className="md:col-span-2 space-y-4">
                  <div className="space-y-4 p-6 rounded-3xl bg-slate-50/50 border border-slate-200">
                    <div className="flex items-center gap-2 text-[10px] font-black text-acc-text-light uppercase tracking-widest">
                      <span aria-hidden="true" className="material-symbols-outlined text-xs">person</span> Khách hàng
                    </div>
                    <div className="space-y-2">
                      <p className="font-black text-acc-text-main text-base leading-tight" translate="no">{invoice.customerName || 'Khách hàng lẻ'}</p>
                      <div className="flex flex-col gap-1.5 opacity-80">
                         {invoice.phoneNumber && (
                           <span className="text-[10px] font-bold text-acc-text-muted flex items-center gap-1">
                             <span className="material-symbols-outlined text-xs">call</span> {invoice.phoneNumber}
                           </span>
                         )}
                         {invoice.email && (
                           <span className="text-[10px] font-bold text-acc-text-muted flex items-center gap-1">
                             <span className="material-symbols-outlined text-xs">mail</span> {invoice.email}
                           </span>
                         )}
                         {invoice.address && (
                           <span className="text-[10px] font-bold text-acc-text-muted flex items-center gap-1">
                             <span className="material-symbols-outlined text-xs">location_on</span> {invoice.address}
                           </span>
                         )}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4 p-6 rounded-3xl bg-slate-50/50 border border-slate-200">
                    <div className="flex items-center gap-2 text-[10px] font-black text-acc-text-light uppercase tracking-widest">
                      <span aria-hidden="true" className="material-symbols-outlined text-xs">calendar_today</span> Hạn chót
                    </div>
                    <div className="space-y-1">
                      <p className="font-black text-acc-text-main">
                        {invoice.status === 'paid' ? 'Đã Thanh Toán' : (invoice.dueDate || 'N/A')}
                      </p>
                      <p className={`text-[10px] font-bold uppercase tracking-tighter ${invoice.status === 'paid' ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {invoice.status === 'paid' 
                          ? `đã thanh toán vào ${invoice.paidAt || 'N/A'}` 
                          : (invoice.finalDueDate ? `Gia hạn: ${invoice.finalDueDate}` : 'Đúng hạn')}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-3 space-y-4 p-8 rounded-3xl bg-acc-primary/5 border border-acc-primary/10 relative overflow-hidden group flex flex-col justify-center">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-acc-primary/5 rounded-full -mr-24 -mt-24 blur-3xl group-hover:bg-acc-primary/10 transition-all"></div>
                  <div className="flex items-center justify-between relative z-10 mb-2">
                    <div className="flex items-center gap-2 text-[10px] font-black text-acc-primary uppercase tracking-widest">
                      <span aria-hidden="true" className="material-symbols-outlined text-xs">account_balance_wallet</span> Tiến độ thanh toán
                    </div>
                    <span className="text-sm font-black text-acc-primary">{percent}%</span>
                  </div>
                  <div className="space-y-5 relative z-10">
                    <div className="w-full h-3 bg-white rounded-full overflow-hidden shadow-inner border border-acc-primary/5">
                      <div className="h-full bg-acc-primary transition-all duration-1000 shadow-[0_0_15px_rgba(79,70,229,0.3)]" style={{ width: `${percent}%` }}></div>
                    </div>
                    <div className="flex justify-between items-end">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Đã thu</p>
                        <p className="text-xl font-black text-emerald-600">{paid.toLocaleString()} VND</p>
                      </div>
                      <div className="space-y-1 text-right">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Còn nợ</p>
                        <p className="text-xl font-black text-rose-500">{remaining.toLocaleString()} VND</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-xs font-black text-acc-text-main uppercase tracking-widest flex items-center gap-2 ml-1">
                  <span className="w-1 h-3 bg-acc-primary rounded-full"></span> Danh mục Sản phẩm
                </h3>
                <div className="rounded-2xl sm:rounded-[2rem] border-2 border-slate-200 overflow-hidden shadow-sm bg-white acc-inner-scroll-mobile">
                  <table className="w-full text-sm acc-responsive-table acc-table-detail">
                    <thead className="bg-slate-50/50">
                      <tr>
                        <th scope="col" className="p-5 text-[10px] font-black uppercase text-acc-text-light text-left w-56">Danh mục</th>
                        <th scope="col" className="p-5 text-[10px] font-black uppercase text-acc-text-light text-left">Sản phẩm</th>
                        <th scope="col" className="p-5 text-[10px] font-black uppercase text-acc-text-light text-left w-40">Số lượng</th>
                        <th scope="col" className="p-5 text-[10px] font-black uppercase text-acc-text-light text-left w-64">Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {(!invoice.items || invoice.items.length === 0) ? (
                        <tr>
                          <td colSpan="4" className="p-10 text-center text-slate-400 font-medium italic">
                            Không có sản phẩm nào trong hóa đơn này.
                          </td>
                        </tr>
                      ) : invoice.items.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-5" data-label="Danh mục">
                            <span className="text-[10px] text-acc-primary font-black uppercase tracking-widest px-2 py-1 bg-acc-primary/5 rounded-lg whitespace-nowrap block w-fit max-w-[150px] truncate">
                              {item.categoryName || 'Sản phẩm'}
                            </span>
                          </td>
                          <td className="p-5 text-sm font-black text-acc-text-main" data-label="Sản phẩm">
                            <div className="truncate max-w-[200px] md:max-w-[300px] lg:max-w-[400px]" title={item.name || item.productName}>
                              {item.name || item.productName || 'Sản phẩm không xác định'}
                            </div>
                          </td>
                          <td className="p-5 text-left font-bold text-slate-500" data-label="Số lượng">{item.quantity}</td>
                          <td className="p-5 text-left font-black text-acc-primary tabular-nums" data-label="Thành tiền">{(item.quantity * (item.unitPrice || item.price || 0))?.toLocaleString()} VND</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-4">
                <div className="space-y-3">
                  <h3 className="text-[10px] font-black text-acc-text-light uppercase tracking-widest ml-1">Ghi chú nội bộ</h3>
                  <div className="p-6 rounded-[2rem] bg-slate-50/50 border border-slate-100 min-h-[100px] text-sm font-medium text-slate-500 italic leading-relaxed">
                    {invoice.notes || 'Không có ghi chú nào cho giao dịch này.'}
                  </div>
                </div>
                <div className="space-y-4 p-8 rounded-[2rem] bg-slate-900 text-white shadow-xl shadow-slate-200">
                  <div className="flex justify-between items-center text-xs opacity-60 font-medium"><span>Tạm tính</span><span>{subtotal.toLocaleString()} VND</span></div>
                  {adjustment !== 0 && (
                    <div className="flex justify-between items-center text-xs opacity-60 font-medium font-italic"><span>Phí & Giảm giá</span><span>{adjustment > 0 ? '+' : ''}{adjustment.toLocaleString()} VND</span></div>
                  )}
                  <div className="h-px bg-white/10 my-2"></div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black uppercase tracking-widest text-indigo-400">Tổng cộng</span>
                    <span className="text-2xl font-black tabular-nums tracking-tighter">{finalTotal.toLocaleString()} VND</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 border-t border-slate-100/50 bg-slate-50/30 flex flex-row sm:flex-row items-center justify-between gap-3 sm:gap-0 shrink-0 acc-modal-mobile-taskbar">
            <div className="text-[9px] sm:text-[10px] font-bold text-acc-text-light uppercase tracking-widest hidden sm:flex items-center gap-3">
              <span aria-hidden="true" className="material-symbols-outlined text-sm">verified_user</span> Được xác thực bởi Hola Group
            </div>
            <div className="flex flex-row items-center gap-3 w-full sm:w-auto">
              <button
                onClick={onClose}
                className="flex-1 sm:flex-none px-6 sm:px-10 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl bg-slate-100 text-slate-500 text-[10px] sm:text-[11px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all active:scale-95 whitespace-nowrap"
              >
                Đóng
              </button>
              <button
                onClick={handleDownloadPDF}
                className="flex-[2] sm:flex-none px-6 sm:px-10 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl bg-acc-primary text-white text-[10px] sm:text-[11px] font-black uppercase tracking-widest shadow-xl shadow-acc-primary/20 hover:scale-[1.02] active:scale-95 transition-[transform,box-shadow,background-color] flex items-center justify-center gap-2"
              >
                <span aria-hidden="true" className="material-symbols-outlined text-base">download</span>
                Tải xuống PDF
              </button>
            </div>
          </div>

          {/* Cung cấp phôi in ẩn cho trình duyệt (Printable area) */}
          <PrintableInvoiceTemplate
            detail={{
              ...invoice,
              time: invoice.time && invoice.time !== 'N/A' 
                ? invoice.time 
                : new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
            }}
            extendedData={{ type: 'INVOICE' }}
          />

        </div>
      </div>
    </div>,
    document.body
  );
};

const AdjustmentModal = ({ isOpen, onClose, invoice, onUpdate }) => {
  const [fees, setFees] = useState({ shipping: 0, handling: 0, insurance: 0, discount: 0 });
  const [reason, setReason] = useState('');
  useEffect(() => { if (isOpen) { setFees({ shipping: 0, handling: 0, insurance: 0, discount: 0 }); setReason(''); } }, [isOpen]);
  if (!isOpen || !invoice) return null;
  const totalAdjustment = Number(fees.shipping) + Number(fees.handling) + Number(fees.insurance) - Number(fees.discount);
  const finalTotal = (invoice.totalAmount || 0) + totalAdjustment;
  const handleInputChange = (key, val) => { const num = val.replace(/\D/g, ''); setFees(prev => ({ ...prev, [key]: num })); };

  return createPortal(
    <div className="fixed inset-0 z-[150] overflow-hidden animate-fade-in acc-modal-overlay">
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md" onClick={onClose} />

      <div className="flex items-center justify-center p-0 sm:p-4 pointer-events-none min-h-full">
        <div className="relative w-full max-w-4xl bg-white sm:bg-white/95 sm:backdrop-blur-xl rounded-none sm:rounded-[2.5rem] shadow-none sm:shadow-[0_40px_100px_rgba(0,0,0,0.2)] sm:border border-white/20 overflow-hidden animate-zoom-in flex flex-col h-full sm:h-auto sm:max-h-[85vh] pointer-events-auto acc-modal-content">

          {/* Header - Pro Max Style */}
          <div className="px-6 sm:px-8 py-6 sm:py-8 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white/50 gap-4 sm:gap-0 relative overflow-hidden shrink-0">
            <div className="flex items-center gap-3 sm:gap-5">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl sm:rounded-3xl bg-indigo-500/10 flex items-center justify-center text-indigo-600">
                <span aria-hidden="true" className="material-symbols-outlined text-2xl sm:text-3xl">receipt_long</span>
              </div>
              <div className="space-y-0.5 sm:space-y-1">
                <h2 className="text-xl sm:text-2xl font-black text-acc-text-main uppercase tracking-tight">Chi phí phát sinh</h2>
                <div className="flex items-center gap-2 text-[9px] sm:text-[11px] font-bold text-acc-text-light uppercase tracking-widest">
                  <span>Hóa đơn:</span><span className="text-acc-primary font-black">{invoice.id}</span>
                </div>
              </div>
            </div>

            <button aria-label="Đóng cửa sổ" onClick={onClose} className="absolute top-6 right-6 w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white sm:bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-all flex items-center justify-center active:scale-95 border border-slate-100 sm:border-none shadow-sm">
              <span aria-hidden="true" className="material-symbols-outlined text-xl sm:text-2xl">close</span>
            </button>
          </div>

          {/* Form Content */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-10 no-scrollbar acc-modal-scroll-area" style={{ WebkitOverflowScrolling: 'touch' }}>
            <div className="space-y-8 sm:space-y-10 pb-16">

              {/* Fee Inputs Group */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-8">
                {[
                  { key: 'shipping', label: 'Phí vận chuyển', icon: 'local_shipping', color: 'text-blue-500', bg: 'bg-blue-50' },
                  { key: 'handling', label: 'Phí bốc xếp', icon: 'inventory_2', color: 'text-indigo-500', bg: 'bg-indigo-50' },
                  { key: 'insurance', label: 'Bảo hiểm', icon: 'shield', color: 'text-emerald-500', bg: 'bg-emerald-50' },
                  { key: 'discount', label: 'Chiết khấu thêm', icon: 'sell', color: 'text-rose-500', bg: 'bg-rose-50' }
                ].map((item) => (
                  <div key={item.key} className="group space-y-2.5">
                    <label className={`text-[10px] font-black uppercase tracking-widest ml-1 flex items-center gap-2 ${item.key === 'discount' ? 'text-rose-600' : 'text-slate-500'}`}>
                      <span className="w-5 h-5 flex items-center justify-center rounded-md bg-slate-100 group-focus-within:bg-white group-focus-within:shadow-sm transition-all">
                        <span className="material-symbols-outlined text-[14px]">{item.icon}</span>
                      </span>
                      {item.label}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={fees[item.key] ? Number(fees[item.key]).toLocaleString() : ''}
                        onChange={(e) => handleInputChange(item.key, e.target.value)}
                        placeholder="0"
                        className={`w-full border-2 rounded-[1.5rem] py-4 px-5 text-sm font-black outline-none focus:ring-4 transition-[border-color,background-color,box-shadow,transform] tabular-nums placeholder:text-slate-200 ${item.key === 'discount' ? 'bg-rose-50/30 text-rose-600 border-rose-100/50 focus:bg-white focus:border-rose-200 focus:ring-rose-500/5' : 'bg-slate-50 text-slate-800 border-slate-200/60 focus:bg-white focus:border-acc-primary/20 focus:ring-acc-primary/5'}`}
                      />
                      <span className={`absolute right-5 top-1/2 -translate-y-1/2 text-[10px] font-black uppercase tracking-tight ${item.key === 'discount' ? 'text-rose-300' : 'text-slate-300'}`}>VND</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary Section */}
              <div className="p-6 sm:p-8 rounded-[2.5rem] bg-slate-900 text-white space-y-5 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-indigo-500/20 transition-colors"></div>

                <div className="space-y-4 relative z-10">
                  <div className="flex justify-between items-center px-2">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Giá trị gốc</span>
                    <span className="text-sm font-black tabular-nums">{invoice.totalAmount?.toLocaleString()} VND</span>
                  </div>
                  <div className={`flex justify-between items-center px-4 py-3 rounded-2xl ${totalAdjustment >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm">{totalAdjustment >= 0 ? 'trending_up' : 'trending_down'}</span>
                      <span className="text-[10px] font-black uppercase tracking-widest">Biến động {totalAdjustment >= 0 ? 'Cộng' : 'Trừ'}</span>
                    </div>
                    <span className="text-base font-black tabular-nums">{totalAdjustment >= 0 ? '+' : ''}{totalAdjustment.toLocaleString()} VND</span>
                  </div>
                </div>
              </div>

              {/* Adjust Reason */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">edit_note</span> Lý do điều chỉnh
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows="3"
                  className="w-full bg-slate-50 border-2 border-slate-200/60 rounded-[2rem] py-5 px-7 text-sm font-black text-slate-800 outline-none focus:bg-white focus:border-acc-primary/20 focus:ring-4 focus:ring-acc-primary/5 transition-[border-color,background-color,box-shadow,transform] resize-none placeholder:text-slate-200"
                  placeholder="Vui lòng nhập chi tiết lý do điều chỉnh chi phí…"
                />
              </div>
            </div>
          </div>

          {/* Footer - Sticky Mobile Taskbar */}
          <div className="px-6 sm:px-10 py-5 sm:py-8 border-t border-slate-100 flex flex-row items-center justify-between bg-slate-50/50 backdrop-blur-xl shrink-0 acc-modal-mobile-taskbar">
            <div className="flex flex-col items-start">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Quyết toán mới</span>
              <span className="text-xl sm:text-3xl font-black text-acc-primary tracking-tighter tabular-nums">{finalTotal.toLocaleString()} VND</span>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={onClose} className="px-6 py-4 sm:py-3.5 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-200/50 rounded-xl sm:rounded-2xl transition-all active:scale-95">Hủy</button>
              <button
                onClick={() => { onClose(); onUpdate(invoice.id, { finalTotal }); }}
                className="px-10 py-4 sm:py-3.5 bg-acc-primary text-white text-[10px] sm:text-[11px] font-black uppercase tracking-widest rounded-xl sm:rounded-2xl shadow-xl shadow-acc-primary/20 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-[transform,box-shadow,background-color] active:scale-95 whitespace-nowrap"
              >
                Cập nhật
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

const ActionMenu = ({ invoice, onAdjust, onEdit, onDelete, onView, onOpenChange, openUp = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const wrapperRef = useRef(null);
  const buttonRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    if (onOpenChange) onOpenChange(isOpen);
  }, [isOpen, onOpenChange]);

  useEffect(() => {
    function handleClickOutside(event) {
      // Chỉ đóng nếu click nằm ngoài cả nút bấm gốc VÀ nội dung menu trong Portal
      const isOutsideWrapper = wrapperRef.current && !wrapperRef.current.contains(event.target);
      const isOutsideContent = contentRef.current && !contentRef.current.contains(event.target);
      
      if (isOutsideWrapper && isOutsideContent) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        setCoords({ top: rect.top, left: rect.left });
      }
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const navigate = useNavigate();
  const actions = [
    { label: 'Xem chi tiết', icon: 'visibility', color: 'text-slate-600', onClick: () => onView(invoice.id) },
    { label: 'Sửa hóa đơn', icon: 'edit', color: 'text-blue-600', onClick: () => onEdit(invoice) },
    { 
      label: 'Thanh toán ngay', 
      icon: 'account_balance_wallet', 
      color: 'text-amber-600', 
      hidden: invoice.orderStatus === 'Đã thanh toán',
      onClick: () => navigate('/accounting/payments', { state: { invoiceId: invoice.id, autoPay: true } }) 
    },
    { 
      label: 'Điều chỉnh chi phí', 
      icon: 'payments', 
      color: 'text-emerald-600', 
      hidden: invoice.orderStatus === 'Đã thanh toán',
      onClick: () => onAdjust(invoice) 
    },
    { label: 'Xóa hóa đơn', icon: 'delete', color: 'text-rose-600', hoverBg: 'hover:bg-rose-50', onClick: () => onDelete(invoice.id) },
  ];

  return (
    <div className="relative inline-block" ref={wrapperRef}>
      <button 
        ref={buttonRef}
        aria-label="Mở menu thao tác" 
        onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }} 
        className={`w-9 h-9 rounded-xl flex items-center justify-center transition-[background-color,color,box-shadow] duration-300 ${isOpen ? 'bg-acc-primary text-white shadow-lg' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
      >
        <span aria-hidden="true" className="material-symbols-outlined">{isOpen ? 'close' : 'more_vert'}</span>
      </button>

      {isOpen && createPortal(
        <div 
          ref={contentRef}
          className="fixed w-max min-w-[14rem] bg-white rounded-[1.8rem] shadow-[0_30px_60px_rgba(0,0,0,0.25)] border border-slate-100 z-[9999] py-2 animate-fade-in"
          style={{
            top: openUp ? (coords.top - 180) : (coords.top - 10),
            left: coords.left - 240,
          }}
          onClick={(e) => e.stopPropagation()} // Chặn click lan ra row của bảng
        >
          {actions.filter(a => !a.hidden).map((act, i) => (
            <button 
              key={i} 
              onClick={(e) => { 
                e.stopPropagation(); 
                e.preventDefault();
                act.onClick(); 
                setIsOpen(false); 
              }} 
              className={`w-full px-5 py-3 text-[10px] font-black uppercase tracking-widest flex items-center gap-3 transition-colors whitespace-nowrap ${act.hoverBg || 'hover:bg-slate-50'} ${act.color}`}
            >
              <span aria-hidden="true" className="material-symbols-outlined text-lg">{act.icon}</span>{act.label}
            </button>
          ))}
        </div>,
        document.body
      )}
    </div>
  );
};

// Component Form mẫu dùng chung cho cả Tạo & Sửa
const InvoiceFormModal = ({ isOpen, onClose, onSave, initialData = null, title = "Hóa đơn", showToast }) => {
  const [formData, setFormData] = useState({
    customer: '', orderID: '', date: new Date().toISOString().split('T')[0], dueDate: '', notes: '',
    paidAmount: 0, finalDueDate: '',
    items: [{ id: 1, name: '', quantity: 1, price: 0 }]
  });

  useEffect(() => {
    const toISODate = (dateStr) => {
      if (!dateStr) return '';
      if (dateStr.includes('-')) return dateStr; // Already ISO
      if (dateStr.includes('/')) {
        const parts = dateStr.split('/');
        if (parts.length === 3) return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
      }
      return dateStr;
    };

    if (isOpen) {
      if (initialData) {
        setFormData({
          customer: initialData.customerID || '',
          orderID: initialData.orderID || '',
          date: toISODate(initialData.date) || new Date().toISOString().split('T')[0],
          dueDate: toISODate(initialData.dueDate) || '',
          notes: initialData.notes || '',
          paidAmount: initialData.paidAmount || 0,
          finalDueDate: toISODate(initialData.finalDueDate) || '',
          salesperson: initialData.userID || '', // Lưu thông tin nhân viên bán hàng
          items: initialData.items ? initialData.items.map((it, idx) => ({ ...it, id: it.id || (Date.now() + idx) })) : [{ id: Date.now(), name: '', quantity: 1, unitPrice: 0 }]
        });
      } else {
        setFormData({ customer: '', orderID: '', salesperson: '', date: new Date().toISOString().split('T')[0], dueDate: '', notes: '', paidAmount: 0, finalDueDate: '', items: [{ id: Date.now(), name: '', quantity: 1, unitPrice: 0 }] });
      }
    }
  }, [isOpen, initialData]);

  const addItem = () => { setFormData(prev => ({ ...prev, items: [...prev.items, { id: Date.now(), name: '', quantity: 1, unitPrice: 0, categoryID: null, productID: null }] })); };
  const removeItem = (id) => { if (formData.items.length > 1) { setFormData(prev => ({ ...prev, items: prev.items.filter(item => item.id !== id) })); } };
  const updateItem = (id, field, value) => { setFormData(prev => ({ ...prev, items: prev.items.map(item => item.id === id ? { ...item, [field]: value } : item) })); };
  const updateItemData = (id, data) => { setFormData(prev => ({ ...prev, items: prev.items.map(item => item.id === id ? { ...item, ...data } : item) })); };
  const totalAmount = formData.items.reduce((sum, item) => sum + (Number(item.quantity || 0) * (Number(item.unitPrice || item.price || 0))), 0);
  const remaining = Math.max(0, totalAmount - formData.paidAmount);

  const [showErrorPopup, setShowErrorPopup] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate if customer exists in database
    const customerList = dbData.customers || [];
    const enteredCustomer = formData.customer;
    
    // Helper to get full name (redefined here or moved to upper scope if needed)
    const getFullName = (c) => c.companyName || `${c.lastName} ${c.firstName}`;
    
    const exists = customerList.some(c => 
      c.customerID === Number(enteredCustomer) || 
      getFullName(c).toLowerCase() === enteredCustomer?.toString().toLowerCase()
    );

    // --- VALIDATION LOGIC ---
    if (!formData.customer) {
      if (showToast) showToast("Vui lòng chọn khách hàng", "error");
      return;
    }
    if (!formData.salesperson) {
      if (showToast) showToast("Vui lòng chọn nhân viên bán hàng", "error");
      return;
    }
    if (!formData.orderID?.toString().trim()) {
      if (showToast) showToast("Vui lòng nhập mã đơn hàng", "error");
      return;
    }
    if (!formData.date) {
      if (showToast) showToast("Vui lòng chọn ngày lập hóa đơn", "error");
      return;
    }
    if (!formData.dueDate) {
      if (showToast) showToast("Vui lòng chọn hạn thanh toán đợt 1", "error");
      return;
    }
    
    // Validate items
    if (!formData.items || formData.items.length === 0) {
      if (showToast) showToast("Vui lòng thêm ít nhất một sản phẩm", "error");
      return;
    }
    const isItemsValid = formData.items.every(it => it.name && it.quantity > 0);
    if (!isItemsValid) {
      if (showToast) showToast("Vui lòng hoàn thiện thông tin sản phẩm và số lượng", "error");
      return;
    }

    if (!exists) {
      setShowErrorPopup(true);
      return;
    }
    onSave({
      ...initialData,
      customerID: Number(formData.customer),
      orderID: Number(formData.orderID) || formData.orderID, 
      userID: Number(formData.salesperson), // Gửi ID nhân viên bán hàng
      invoiceDate: formData.date,
      dueDate: formData.dueDate,
      paidAmount: Number(formData.paidAmount),
      totalAmount,
      items: formData.items.map(item => ({
        ...item,
        productID: Number(item.productID),
        categoryID: Number(item.categoryID),
        unitPrice: Number(item.unitPrice || item.price),
        quantity: Number(item.quantity)
      })),
      notes: formData.notes,
      status: 'PENDING',
      createAt: new Date().toISOString().split('T')[0]
    });
    onClose();
  };

  if (!isOpen) return null;
  return createPortal(
    <div className="fixed inset-0 z-[150] overflow-y-auto sm:overflow-hidden animate-fade-in acc-modal-overlay">
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md" onClick={onClose} />

      <div className="flex items-center justify-center p-0 sm:p-4 pointer-events-none min-h-full">
        <div className="relative w-full max-w-4xl bg-white sm:bg-white/95 sm:backdrop-blur-xl rounded-none sm:rounded-[2.5rem] shadow-none sm:shadow-[0_40px_100px_rgba(0,0,0,0.2)] border-none sm:border border-white/20 overflow-hidden animate-zoom-in flex flex-col h-full sm:h-auto sm:max-h-[85vh] pointer-events-auto acc-modal-content">
          <div className="px-6 sm:px-8 py-5 sm:py-6 border-b border-slate-100 flex items-center justify-between bg-white sm:bg-slate-50/50 shrink-0">
            <div className="space-y-0.5 sm:space-y-1">
              <h2 className="text-lg sm:text-xl font-black text-acc-text-main uppercase tracking-tight">{title}</h2>
              <div className="flex items-center gap-2 text-[9px] font-bold text-acc-primary uppercase tracking-widest sm:hidden">
                <span className="w-1.5 h-1.5 rounded-full bg-acc-primary animate-pulse"></span> Nhập dữ liệu thời gian thực
              </div>
            </div>
            <button onClick={onClose} className="w-10 h-10 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-100 sm:border-none transition-colors">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 sm:p-8 no-scrollbar acc-modal-scroll-area" style={{ WebkitOverflowScrolling: 'touch' }}>
            <form className="space-y-8" id="invoice-form" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2"><label className="text-[10px] font-black uppercase text-acc-text-main ml-1">Khách hàng <span className="text-rose-500">*</span></label><SearchableCustomerSelect onSelect={(val) => setFormData(prev => ({ ...prev, customer: val }))} selectedCustomer={formData.customer} /></div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-acc-text-main ml-1">Nhân viên bán hàng <span className="text-rose-500">*</span></label>
                  <select 
                    value={formData.salesperson} 
                    onChange={(e) => setFormData(prev => ({ ...prev, salesperson: e.target.value }))}
                    className="w-full bg-slate-50 border-2 border-slate-200 focus:border-acc-primary/30 rounded-2xl py-3 px-5 text-sm font-black outline-none transition-all focus:bg-white"
                  >
                    <option value="">Chọn nhân viên...</option>
                    {(dbData.users || []).filter(u => u.roleID === 2).map(u => (
                      <option key={u.userID} value={u.userID}>{u.lastName} {u.firstName}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2"><label className="text-[10px] font-black uppercase text-acc-text-main ml-1">Mã đơn hàng <span className="text-rose-500">*</span></label><input type="text" value={formData.orderID} onChange={(e) => setFormData(prev => ({ ...prev, orderID: e.target.value }))} autoComplete="off" spellCheck={false} placeholder="Ví dụ: ORD-001" className="w-full bg-slate-50 border-2 border-slate-200 focus:border-acc-primary/30 rounded-2xl py-3 px-5 text-sm font-black focus:ring-4 focus:ring-acc-primary/5 outline-none transition-all focus:bg-white placeholder:text-slate-300" /></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2"><label className="text-[10px] font-black uppercase text-acc-text-main ml-1">Ngày lập <span className="text-rose-500">*</span></label><input type="date" value={formData.date} onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))} className="w-full bg-slate-50 rounded-2xl py-3 px-5 text-sm font-black outline-none border-2 border-slate-200 focus:border-acc-primary/30 transition-all focus:bg-white" /></div>
                <div className="space-y-2"><label className="text-[10px] font-black uppercase text-acc-text-main ml-1">Hạn thanh toán đợt 1 <span className="text-rose-500">*</span></label><input type="date" value={formData.dueDate} min={formData.date} onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))} className="w-full bg-slate-50 rounded-2xl py-3 px-5 text-sm font-black outline-none border-2 border-slate-200 focus:border-acc-primary/30 transition-all focus:bg-white" /></div>
              </div>

              <div className="p-6 sm:p-8 rounded-[2rem] bg-acc-primary/5 border border-acc-primary/10 space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-acc-primary/10 text-acc-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-base">payments</span>
                  </div>
                  <h3 className="text-xs font-black text-acc-primary uppercase tracking-widest">Tiến độ thanh toán & Kỳ hạn nốt</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-acc-text-main uppercase tracking-widest ml-1">Số tiền đã trả trước (VND)</label>
                    <input type="number" placeholder="Nhập số tiền đã thu..." className="w-full px-5 py-4 rounded-2xl bg-white border-2 border-slate-200 focus:border-acc-primary/40 outline-none text-sm font-black transition-all text-acc-primary shadow-sm" value={formData.paidAmount} onChange={e => setFormData({ ...formData, paidAmount: parseFloat(e.target.value) || 0 })} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-acc-text-main uppercase tracking-widest ml-1">Hạn thanh toán phần còn lại</label>
                    <div className="relative">
                      <input type="date" className="w-full px-5 py-4 rounded-2xl bg-white border-2 border-slate-200 focus:border-acc-primary/40 outline-none text-sm font-black transition-all text-acc-text-main shadow-sm" min={formData.dueDate || formData.date} value={formData.finalDueDate} onChange={e => setFormData({ ...formData, finalDueDate: e.target.value })} />
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center px-6 py-4 rounded-2xl bg-white/50 border border-acc-primary/10">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-acc-text-main uppercase tracking-widest">Dư nợ còn lại</span>
                    <span className="text-base font-black text-acc-primary">{(totalAmount - formData.paidAmount).toLocaleString()} VND</span>
                  </div>
                  <div className="text-[10px] font-black text-acc-primary uppercase bg-acc-primary/10 px-3 py-1 rounded-lg">
                    {Math.round((formData.paidAmount / totalAmount) * 100) || 0}% Đã thu
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between"><h3 className="text-xs font-black uppercase text-acc-text-main">Sản phẩm / Dịch vụ <span className="text-rose-500">*</span></h3><button type="button" onClick={addItem} className="px-4 py-2 rounded-xl bg-acc-primary/5 text-[10px] font-black text-acc-primary uppercase flex items-center gap-1 hover:bg-acc-primary/10 transition-all active:scale-95"><span className="material-symbols-outlined text-sm">add_circle</span> Thêm dòng</button></div>
                <div className="rounded-2xl border-2 border-slate-200 bg-white relative">
                  <div className="no-scrollbar">
                    <table className="w-full text-sm acc-responsive-table acc-table-detail">
                      <thead className="bg-slate-50">
                        <tr>
                          <th scope="col" className="p-4 text-[11px] font-black uppercase text-acc-text-main text-left w-52">Danh mục</th>
                          <th scope="col" className="p-4 text-[11px] font-black uppercase text-acc-text-main text-left">Sản phẩm</th>
                          <th scope="col" className="p-4 text-[11px] font-black uppercase text-acc-text-main text-left w-32">SL</th>
                          <th scope="col" className="p-4 text-[11px] font-black uppercase text-acc-text-main text-left w-48">Thành tiền</th>
                          <th scope="col" className="p-4 w-10"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {formData.items.map((item) => (
                          <tr key={item.id} className="hover:bg-slate-50/30 transition-colors">
                            <ProductCategoryLinkedSelect 
                              selectedCategoryID={item.categoryID}
                              selectedProductID={item.productID}
                              selectedName={item.name}
                              onSelect={(data) => updateItemData(item.id, data)}
                            />
                            <td className="p-3 text-left" data-label="Số lượng">
                              <input 
                                type="number" 
                                value={item.quantity} 
                                onChange={(e) => updateItem(item.id, 'quantity', Number(e.target.value))} 
                                className="w-24 bg-slate-50 rounded-xl px-4 py-2 text-left font-black outline-none border-2 border-slate-200 focus:border-acc-primary/40 transition-all" 
                              />
                            </td>
                            <td className="p-3 text-left font-black text-acc-primary tabular-nums" data-label="Thành tiền">
                              {(item.quantity * (item.unitPrice || item.price || 0)).toLocaleString()} 
                              <span className="text-[9px] opacity-40 ml-1">VND</span>
                            </td>
                            <td className="p-3 text-center" data-label="Thao tác">
                              <button 
                                type="button" 
                                aria-label="Xóa dòng" 
                                onClick={() => removeItem(item.id)} 
                                className="w-9 h-9 rounded-xl text-slate-400 border-2 border-slate-200 hover:text-rose-500 hover:border-rose-200 hover:bg-rose-50 transition-all flex items-center justify-center mx-auto shadow-sm active:scale-90"
                              >
                                <span aria-hidden="true" className="material-symbols-outlined text-lg">delete</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pb-10">
                <label className="text-[10px] font-black uppercase text-acc-text-main ml-1">Ghi chú nội bộ</label>
                <textarea value={formData.notes} onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))} rows="3" className="w-full bg-slate-50 rounded-[1.8rem] py-4 px-6 text-sm font-medium text-acc-text-main outline-none border-2 border-slate-200 focus:border-acc-primary/30 focus:bg-white transition-[border-color,background-color] resize-none placeholder:text-slate-300" placeholder="Thông tin bổ sung…" />
              </div>
            </form>
          </div>

          <div className="px-6 sm:px-8 py-5 sm:py-6 border-t border-slate-100 flex flex-row items-center justify-between bg-slate-50/50 sm:bg-slate-50/50 gap-4 shrink-0 acc-modal-mobile-taskbar">
            <div className="flex flex-col items-start w-full sm:w-auto">
              <span className="text-[9px] font-black text-acc-text-main uppercase tracking-widest">Tổng hóa đơn</span>
              <span className="text-lg sm:text-2xl font-black text-acc-primary tracking-tighter">{totalAmount.toLocaleString()} VND</span>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button onClick={onClose} className="flex-1 sm:flex-none px-6 py-3.5 sm:py-3 text-[10px] font-black uppercase text-slate-500 transition-all hover:bg-slate-200 rounded-xl sm:rounded-2xl border border-slate-200 sm:border-none backdrop-blur-md">Hủy</button>
              <button type="submit" form="invoice-form" className="flex-[2] sm:flex-none px-8 py-3.5 sm:py-3 rounded-xl sm:rounded-2xl bg-acc-primary text-white text-[10px] font-black uppercase shadow-xl shadow-acc-primary/20 active:scale-95 transition-all whitespace-nowrap">Lưu hóa đơn</button>
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal 
        isOpen={showErrorPopup} 
        onClose={() => setShowErrorPopup(false)} 
        onConfirm={() => setShowErrorPopup(false)} 
        title="Khách hàng không tồn tại"
        message="Tên khách hàng bạn vừa nhập không có trong hệ thống dữ liệu. Vui lòng chọn một khách hàng hợp lệ từ danh sách gợi ý để tiếp tục."
        type="warning"
      />
    </div>,
    document.body
  );
};

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, type = 'warning' }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center animate-fade-in p-0 sm:p-4 acc-modal-overlay">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md hidden sm:block" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden animate-zoom-in">
        <div className="p-8 text-center space-y-6">
          <div className={`w-20 h-20 mx-auto rounded-3xl flex items-center justify-center ${type === 'danger' ? 'bg-rose-50 text-rose-500' : 'bg-amber-50 text-amber-500'}`}>
            <span className="material-symbols-outlined text-4xl">{type === 'danger' ? 'delete_forever' : 'warning'}</span>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-black text-acc-text-main uppercase tracking-tight">{title}</h3>
            <p className="text-sm font-medium text-acc-text-muted leading-relaxed">{message}</p>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-2">
            <button onClick={onClose} className="px-6 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-wider text-slate-500 hover:bg-slate-50 transition-all active:scale-95">Hủy bỏ</button>
            <button onClick={() => { onClose(); onConfirm(); }} className={`px-6 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-wider text-white shadow-xl transition-[background-color,transform,box-shadow] active:scale-95 ${type === 'danger' ? 'bg-rose-500 shadow-rose-500/20 hover:bg-rose-600' : 'bg-acc-primary shadow-blue-500/20 hover:bg-acc-secondary'}`}>Xác nhận</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ToastNotification = ({ show, message, type = 'success', onClose }) => {
  useEffect(() => {
    if (show) { const timer = setTimeout(onClose, 5000); return () => clearTimeout(timer); }
  }, [show, onClose]);
  
  if (!show) return null;

  return createPortal(
    <>
      <style>{`
        @keyframes toast-center-in {
          0% { transform: scale(0.9); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes toast-slide-up {
          0% { transform: translate(-50%, 20px); opacity: 0; }
          100% { transform: translate(-50%, 0); opacity: 1; }
        }
        .animate-toast-center { animation: toast-center-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        .animate-toast-desktop { animation: toast-slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
      
      <div className="fixed inset-0 z-[99999] flex items-center justify-center p-6 pointer-events-none">
        {/* Backdrop for mobile */}
        <div 
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] sm:hidden pointer-events-auto transition-opacity duration-300" 
          onClick={onClose}
          style={{ animation: 'fade-in 0.3s ease-out' }}
        />
        
        {/* Main Notification Card */}
        <div className={`
          pointer-events-auto
          flex flex-col sm:flex-row items-center gap-4 sm:gap-5
          w-full max-w-[320px] sm:w-max sm:max-w-[90vw]
          p-6 sm:px-8 sm:py-5
          rounded-[2.5rem] sm:rounded-[2.5rem]
          shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)]
          border-2 backdrop-blur-3xl
          animate-toast-center sm:animate-toast-desktop
          sm:fixed sm:bottom-12 sm:left-1/2
          ${type === 'success' 
            ? 'bg-emerald-50/95 border-emerald-200 text-emerald-800' 
            : 'bg-rose-50/95 border-rose-200 text-rose-800'}
        `}>
          {/* Icon Section */}
          <div className={`
            flex-shrink-0 w-16 h-16 sm:w-11 sm:h-11 rounded-full 
            flex items-center justify-center 
            ${type === 'success' ? 'bg-emerald-500/10' : 'bg-rose-500/10'}
          `}>
            <span className="material-symbols-outlined text-4xl sm:text-2xl">
              {type === 'success' ? 'check_circle' : 'error'}
            </span>
          </div>

          {/* Text Content */}
          <div className="flex flex-col text-center sm:text-left flex-1 min-w-0">
            <span className="text-[10px] sm:text-[9px] font-black uppercase tracking-[0.2em] opacity-60 mb-1">
              {type === 'success' ? 'Hoàn tất giao dịch' : 'Yêu cầu nhập liệu'}
            </span>
            <span className="text-[14px] sm:text-[12px] font-black uppercase tracking-tight leading-tight sm:leading-normal">
              {message}
            </span>
          </div>

          {/* Action Button for Mobile */}
          <button 
            onClick={onClose}
            className="w-full sm:hidden mt-4 py-3.5 rounded-2xl bg-white/50 border border-current/10 text-[11px] font-black uppercase tracking-widest active:scale-95 transition-transform"
          >
            Đã hiểu
          </button>

          {/* Close Button for Desktop */}
          <button 
            onClick={onClose} 
            className="hidden sm:flex w-9 h-9 rounded-full hover:bg-black/5 items-center justify-center transition-all hover:rotate-90"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>
      </div>
    </>,
    document.body
  );
};

const InvoiceList = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAdjustmentModalOpen, setIsAdjustmentModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [activeRowId, setActiveRowId] = useState(null);

  // Custom Popup UI states
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [confirmConfig, setConfirmConfig] = useState({ isOpen: false, title: '', message: '', type: 'warning', onConfirm: () => { } });
  const [toastConfig, setToastConfig] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => setToastConfig({ show: true, message, type });
  const showConfirm = (title, message, onConfirm, type = 'warning') => setConfirmConfig({ isOpen: true, title, message, onConfirm, type });

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  useEffect(() => {
    // Custom Animations for Premium UX
    if (!document.getElementById('acc-invoices-styles')) {
      const styleTag = document.createElement('style');
      styleTag.id = 'acc-invoices-styles';
      styleTag.innerHTML = `
        @keyframes zoom-in { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        @keyframes slide-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-zoom-in { animation: zoom-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .animate-slide-up { animation: slide-up 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
      `;
      document.head.appendChild(styleTag);
    }
  }, []);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setLoading(true);
        const data = await accountingService.getInvoices();
        setInvoices(data);
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    fetchInvoices();
  }, []);

  const handleCreateInvoice = async (invoiceRawData) => {
    try {
      const newInvoice = await accountingService.createInvoice(invoiceRawData);
      setInvoices(prev => [newInvoice, ...prev]);
      showToast(`Đã tạo hóa đơn ${newInvoice.displayID} thành công!`);
    } catch (err) {
      showToast("Lỗi khi tạo hóa đơn. Vui lòng kiểm tra lại.", "error");
    }
  };

  const handleEditInvoice = async (updatedData) => {
    try {
      // In real app: await accountingService.updateInvoice(updatedData.invoiceID, updatedData);
      setInvoices(prev => prev.map(inv => inv.invoiceID === updatedData.invoiceID ? updatedData : inv));
      showToast(`Cập nhật hóa đơn ${updatedData.displayID} hoàn tất!`);
    } catch (err) {
      showToast("Cập nhật thất bại. Vui lòng thử lại.", "error");
    }
  };

  const handleDeleteInvoice = (invoiceID) => {
    const inv = invoices.find(i => i.invoiceID === invoiceID);
    const displayID = inv?.displayID || invoiceID;
    
    showConfirm(
      "Xác nhận xóa hóa đơn?",
      `Hành động này sẽ xóa vĩnh viễn hóa đơn ${displayID}. Bạn không thể khôi phục dữ liệu này sau khi thực hiện.`,
      () => {
        setInvoices(prev => prev.filter(inv => inv.invoiceID !== invoiceID));
        
        const localInvoices = JSON.parse(localStorage.getItem('added_invoices') || '[]');
        localStorage.setItem('added_invoices', JSON.stringify(localInvoices.filter(i => i.invoiceID !== invoiceID)));
        
        if (inv && inv.orderID) {
          const localOrderItems = JSON.parse(localStorage.getItem('added_order_items') || '[]');
          localStorage.setItem('added_order_items', JSON.stringify(localOrderItems.filter(it => it.orderID !== inv.orderID)));
        }

        showToast(`Đã xóa hóa đơn ${displayID} khỏi hệ thống.`, "success");
      },
      'danger'
    );
  };

  const handleStatusChange = async (invoiceID, newStatus) => {
    try {
      await accountingService.updateInvoiceStatus(invoiceID, newStatus);
      setInvoices(prev => prev.map(inv => inv.invoiceID === invoiceID ? { ...inv, orderStatus: newStatus } : inv));
      showToast(`Đã cập nhật trạng thái.`);
    } catch (err) {
      showToast("Lỗi cập nhật trạng thái.", "error");
    }
  };

  const handleUpdateCosts = async (invoiceID, data) => {
    try {
      await accountingService.updateInvoiceCosts(invoiceID, data.finalTotal);
      setInvoices(prev => prev.map(inv => inv.invoiceID === invoiceID ? { ...inv, totalAmount: data.finalTotal } : inv));
      showToast("Đã cập nhật chi phí quyết toán mới.");
    } catch (err) {
      showToast("Lỗi cập nhật chi phí.", "error");
    }
  };

  const filteredInvoices = invoices.filter(inv => {
    const searchStr = (inv.displayID || '') + (inv.displayOrderID || '') + (inv.customerName || '');
    const matchesSearch = searchStr.toLowerCase().includes(searchTerm.toLowerCase());
    return (filterStatus === 'all' || inv.orderStatus === filterStatus) && matchesSearch;
  });

  const sortedInvoices = [...filteredInvoices].sort((a, b) => {
    let aValue, bValue;

    if (sortConfig.key === 'date') {
      const dateA = new Date((a.date || '').split('/').reverse().join('-'));
      const dateB = new Date((b.date || '').split('/').reverse().join('-'));
      return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
    }

    if (sortConfig.key === 'invoiceID') {
      aValue = Number(a.invoiceID) || 0;
      bValue = Number(b.invoiceID) || 0;
    } else if (sortConfig.key === 'totalAmount') {
      aValue = Number(a.totalAmount) || 0;
      bValue = Number(b.totalAmount) || 0;
    } else {
      aValue = a[sortConfig.key] || '';
      bValue = b[sortConfig.key] || '';
    }

    // Nếu là string thì dùng natural sort
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      const comp = aValue.localeCompare(bValue, undefined, { numeric: true, sensitivity: 'base' });
      return sortConfig.direction === 'asc' ? comp : -comp;
    }

    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const SortIcon = ({ column }) => {
    const isActive = sortConfig.key === column;
    return (
      <div className={`
        inline-flex items-center justify-center w-6 h-6 rounded-lg ml-2 transition-all duration-300
        ${isActive ? 'bg-acc-primary/15 text-acc-primary scale-110 shadow-sm ring-1 ring-acc-primary/20' : 'text-slate-300 group-hover:text-slate-400 group-hover:bg-slate-100'}
      `}>
        <span className={`material-symbols-outlined text-[16px] font-black leading-none ${isActive ? 'animate-bounce-subtle' : ''}`}>
          {isActive 
            ? (sortConfig.direction === 'asc' ? 'expand_less' : 'expand_more') 
            : 'unfold_more'}
        </span>
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 gap-5 animate-fade-up pb-8 overflow-y-auto pr-1 no-scrollbar">
      <ConfirmModal
        isOpen={confirmConfig.isOpen}
        onClose={() => setConfirmConfig(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmConfig.onConfirm}
        title={confirmConfig.title}
        message={confirmConfig.message}
        type={confirmConfig.type}
      />

      <ToastNotification
        show={toastConfig.show}
        message={toastConfig.message}
        type={toastConfig.type}
        onClose={() => setToastConfig(prev => ({ ...prev, show: false }))}
      />

      <InvoiceFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleCreateInvoice} title="Tạo hóa đơn mới" showToast={showToast} />
      <InvoiceFormModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} onSave={handleEditInvoice} initialData={selectedInvoice} title="Chỉnh sửa hóa đơn" showToast={showToast} />
      <InvoiceDetailModal isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} invoice={selectedInvoice} />
      <AdjustmentModal isOpen={isAdjustmentModalOpen} onClose={() => setIsAdjustmentModalOpen(false)} invoice={selectedInvoice} onUpdate={handleUpdateCosts} />

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-1 shrink-0">
        <div className="space-y-2">
          <h1 className="text-acc-text-main leading-tight font-black text-3xl sm:text-4xl lg:text-[2rem] uppercase tracking-tight">HÓA ĐƠN BÁN HÀNG</h1>
          <p className="text-acc-text-muted font-medium">Quản lý dòng tiền kinh doanh</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="acc-btn-primary w-full md:w-fit justify-center px-8 py-4 sm:py-3.5 shadow-xl text-[11px] font-black uppercase rounded-2xl md:rounded-full flex items-center gap-3 transition-all active:scale-95"
          aria-label="Tạo hóa đơn mới"
        >
          <span aria-hidden="true" className="material-symbols-outlined text-xl font-bold">post_add</span>
          <span>Tạo hóa đơn mới</span>
        </button>
      </div>

      <div className="bg-white p-3 rounded-[1.5rem] border border-slate-200/60 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
        <div className="relative flex-1 w-full"><span aria-hidden="true" className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span><input type="text" placeholder="Tìm kiếm…" aria-label="Tìm kiếm hóa đơn" className="w-full bg-slate-50 border-none rounded-2xl py-2.5 pl-12 text-sm outline-none" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
        <div className="flex flex-nowrap bg-slate-100 p-1 rounded-xl overflow-x-auto no-scrollbar w-full md:w-auto">
          {['all', 'Đã thanh toán', 'T.Toán một phần', 'Chờ thanh toán', 'Quá hạn'].map((s) => (
            <button key={s} onClick={() => setFilterStatus(s)} className={`flex-1 min-w-fit px-5 sm:px-4 py-2 sm:py-1.5 rounded-lg text-[10px] font-black uppercase whitespace-nowrap transition-all ${filterStatus === s ? 'bg-white text-acc-primary shadow-sm' : 'text-slate-500'}`}>{s === 'all' ? 'Tất cả' : s}</button>
          ))}
        </div>
      </div>

      <div className="flex-1 bg-white rounded-none sm:rounded-[2rem] border-x-0 sm:border border-slate-200/60 shadow-xl flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto no-scrollbar px-4 sm:px-0">
          <table className="w-full text-left border-collapse relative acc-responsive-table">
            <thead className="bg-slate-50 border-b border-slate-100 sticky top-0 z-20">
              <tr>
                <th 
                  scope="col" 
                  className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] cursor-pointer hover:bg-slate-100 group transition-colors"
                  onClick={() => handleSort('invoiceID')}
                >
                  <div className="flex items-center">Mã hóa đơn <SortIcon column="invoiceID" /></div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] cursor-pointer hover:bg-slate-100 group transition-colors"
                  onClick={() => handleSort('customerName')}
                >
                  <div className="flex items-center">Khách hàng <SortIcon column="customerName" /></div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] cursor-pointer hover:bg-slate-100 group transition-colors"
                  onClick={() => handleSort('totalAmount')}
                >
                  <div className="flex items-center">Giá trị <SortIcon column="totalAmount" /></div>
                </th>
                <th scope="col" className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Trạng thái</th>
                <th scope="col" className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                [1, 2, 3].map(i => <tr key={i}><td colSpan="5" className="p-8 animate-pulse bg-slate-50/20"></td></tr>)
              ) : sortedInvoices.map((inv, idx) => {
                const isNearBottom = idx >= sortedInvoices.length - 2 && sortedInvoices.length >= 3;
                const rowID = inv.invoiceID;
                return (
                  <tr
                    key={`${rowID}-${idx}`}
                    className={`hover:bg-slate-50 transition-all cursor-pointer relative ${activeRowId === rowID ? 'z-[100] bg-slate-50 shadow-sm' : 'z-0'}`}
                    onClick={() => { setSelectedInvoice(inv); setIsDetailModalOpen(true); }}
                  >
                    <td className="px-6 py-4 text-sm font-black text-acc-primary" data-label="Mã hóa đơn">
                      <p translate="no">{inv.displayID}</p>
                      <p className="text-[10px] text-slate-400 font-bold" translate="no">{inv.displayOrderID}</p>
                    </td>
                    <td className="px-6 py-4" data-label="Khách hàng">
                      <p className="text-sm font-black text-acc-text-main whitespace-nowrap truncate max-w-[150px] xl:max-w-none xl:whitespace-normal" title={inv.customerName} translate="no">{inv.customerName}</p>
                      <p className="text-[10px] text-slate-400 font-bold">{inv.date}</p>
                    </td>
                    <td className="px-6 py-4 text-sm font-black tabular-nums" data-label="Giá trị">
                      <span className="inline-flex items-baseline gap-1 whitespace-nowrap">
                        {inv.totalAmount?.toLocaleString()}
                        <span className="inv-vnd-unit font-black opacity-60">VND</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center" onClick={e => e.stopPropagation()} data-label="Trạng thái">
                      <StatusBadgeDropdown
                        status={inv.orderStatus}
                        onStatusChange={(s) => handleStatusChange(rowID, s)}
                        onOpenChange={(open) => setActiveRowId(open ? rowID : null)}
                        openUp={isNearBottom}
                      />
                    </td>
                    <td className="px-6 py-4 text-center" onClick={e => e.stopPropagation()} data-label="Thao tác">
                      <ActionMenu
                        invoice={inv}
                        onAdjust={(i) => { setSelectedInvoice(i); setIsAdjustmentModalOpen(true); }}
                        onEdit={(i) => { setSelectedInvoice(i); setIsEditModalOpen(true); }}
                        onDelete={() => handleDeleteInvoice(rowID)}
                        onView={(id) => { setSelectedInvoice(inv); setIsDetailModalOpen(true); }}
                        onOpenChange={(open) => setActiveRowId(open ? rowID : null)}
                        openUp={isNearBottom}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="bg-slate-50 border-t border-slate-100 px-6 py-4 flex items-center justify-between shrink-0">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hiển thị {filteredInvoices.length} của {invoices.length} giao dịch</span>
          <div className="flex items-center gap-4 text-xs font-black text-acc-text-main">
            <span className="text-slate-400 uppercase text-[9px] font-black tracking-widest">Tổng cộng:</span>
            <span className="tabular-nums text-acc-primary text-sm font-black">{filteredInvoices.reduce((sum, inv) => sum + (inv.totalAmount || 0), 0).toLocaleString()} VND</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceList;
