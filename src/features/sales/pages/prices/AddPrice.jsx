import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

const formatCurrency = (val, isSmall = false, colorClass = "text-slate-800") => {
  if (val === undefined || val === null) return "0 VND";
  const num = typeof val === 'number' ? val : Number(val.toString().replace(/[đ₫\sVND.]/g, ''));
  const formatted = new Intl.NumberFormat('vi-VN').format(num);
  return (
    <span className="flex items-baseline gap-1">
      <span className={isSmall ? `font-bold ${colorClass}` : `font-black ${colorClass}`}>{formatted}</span>
      <span className={`text-[10px] font-black uppercase tracking-tighter ${colorClass === "text-white" ? "text-white/70" : "text-slate-400"}`}>VND</span>
    </span>
  );
};

const ProductSelectionModal = ({ isOpen, onClose, onConfirm, initialSelected }) => {
  const [products] = useState([
    { id: 'SL-77291', name: 'Chronos Elite V2', category: 'HÀNG XA XỈ', price: 42500000, icon: '⌚' },
    { id: 'SL-99012', name: 'Arch-Vision Tablet Pro', category: 'CÔNG NGHỆ', price: 18900000, icon: '📱' },
    { id: 'SL-11234', name: 'Nexus Core Server 5k', category: 'PHẦN CỨNG', price: 125000000, icon: '🖥️' },
    { id: 'SL-44567', name: 'Office Brew Master', category: 'TIỆN NGHI', price: 4200000, icon: '☕' },
    { id: 'SL-88123', name: 'Quantum Display X', category: 'CÔNG NGHỆ', price: 32000000, icon: '📺' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProductIds, setSelectedProductIds] = useState(initialSelected || []);

  const filteredProducts = useMemo(() => {
    return products.filter(p => 
      p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  const toggleSelectProduct = (productId) => {
    setSelectedProductIds(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId) 
        : [...prev, productId]
    );
  };

  const handleConfirm = () => {
    const selectedProducts = products.filter(p => selectedProductIds.includes(p.id));
    onConfirm(selectedProducts);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-[2.5rem] p-10 max-w-2xl w-full shadow-2xl animate-in fade-in zoom-in duration-300 flex flex-col h-[650px] border border-slate-300">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Chọn sản phẩm <span className="text-blue-600">.</span></h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Xác định danh mục hàng hóa áp dụng</p>
          </div>
          <button onClick={onClose} className="w-12 h-12 rounded-xl bg-slate-50 hover:bg-slate-100 flex items-center justify-center transition-all text-slate-400">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="relative mb-8">
          <input 
            type="text" 
            placeholder="Tìm mã hoặc tên sản phẩm..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border-2 border-transparent rounded-xl p-5 pl-14 text-sm font-bold outline-none focus:border-blue-100 focus:bg-white transition-all text-slate-700" 
          />
          <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-300">search</span>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-200">
          <div className="grid grid-cols-1 gap-3">
            {filteredProducts.map((product) => (
              <div 
                key={product.id}
                onClick={() => toggleSelectProduct(product.id)}
                className={`p-6 rounded-xl border-2 transition-all cursor-pointer flex items-center gap-4 ${
                  selectedProductIds.includes(product.id) ? 'border-blue-600 bg-blue-50/30' : 'border-slate-50 hover:border-slate-100'
                }`}
              >
                <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                  selectedProductIds.includes(product.id) ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-200 bg-white'
                }`}>
                  {selectedProductIds.includes(product.id) && <span className="material-symbols-outlined text-[14px] font-black">check</span>}
                </div>
                <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-xl shadow-sm">
                  {product.icon}
                </div>
                <div className="flex-1">
                  <p className="font-black text-slate-900 uppercase tracking-tight text-sm">{product.name}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{product.category} • {product.id}</p>
                </div>
                <div className="text-right">
                  {formatCurrency(product.price, true)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center border-t border-slate-100 pt-8 mt-8">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Đã chọn <span className="text-blue-600 text-sm mx-1">{selectedProductIds.length}</span> sản phẩm
          </p>
          <button 
            onClick={handleConfirm}
            className="bg-slate-900 text-white px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all active:scale-95 shadow-xl shadow-slate-200"
          >
            Xác nhận lựa chọn
          </button>
        </div>
      </div>
    </div>
  );
};

const AddPrice = () => {
  const navigate = useNavigate();
  const [pricingRule, setPricingRule] = useState('FIXED');
  const [scopeType, setScopeType] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [status, setStatus] = useState(true);

  return (
    <div className="font-inter flex flex-col w-full h-full bg-slate-50 animate-fade-in gap-4 md:gap-8 pb-10">
      
      {/* 1. Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 px-2 md:px-0 shrink-0">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate('/sales/prices')} 
            className="w-14 h-14 flex items-center justify-center bg-white border-2 border-slate-100 rounded-2xl hover:bg-slate-50 transition-all shadow-sm active:scale-95 group"
          >
            <span className="material-symbols-outlined text-slate-400 group-hover:text-blue-600 transition-colors">arrow_back</span>
          </button>
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl lg:text-[2rem] font-black text-slate-900 uppercase tracking-tight leading-tight">Thêm bảng giá mới</h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
              Thiết lập chính sách giá mới{" "}
              <span className="inline-flex items-center align-middle mx-1 px-2.5 py-0.5 rounded-lg bg-blue-50 text-[#00288E] font-bold whitespace-nowrap animate-fade-in">
                Bản dự thảo
              </span>
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <button 
            onClick={() => navigate('/sales/prices')}
            className="px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all"
          >
            Hủy bỏ
          </button>
          <button 
            className="group flex items-center justify-center gap-2 bg-[#00288E] hover:bg-white text-white hover:text-[#00288E] px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all duration-300 shadow-lg shadow-blue-900/10 border-2 border-[#00288E] active:scale-95"
          >
            <span className="material-symbols-outlined text-lg group-hover:rotate-12 transition-transform">save</span>
            Lưu bảng giá mới
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 pr-1 md:pr-2 pt-4">
        <div className="flex flex-col xl:flex-row gap-8 mx-2 md:mx-0">
          
          {/* Cột trái */}
          <div className="xl:flex-[2] flex flex-col gap-8">
            <div className="bg-white rounded-xl sm:rounded-2xl p-10 shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-500">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <span className="material-symbols-outlined">info</span>
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Thông tin định danh</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Xác định tên và thuộc tính bảng giá</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormInput label="Tên bảng giá" placeholder="VD: Bảng giá đối tác VIP Q4" required />
                <FormInput label="Mã bảng giá" placeholder="PL-2024-VIP-04" />
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Loại tiền tệ</label>
                  <select className="w-full bg-slate-50 border-2 border-transparent rounded-xl p-4 text-sm font-bold outline-none focus:border-blue-100 focus:bg-white transition-all text-slate-700 appearance-none">
                    <option>VND - Việt Nam Đồng</option>
                    <option>USD - US Dollar</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormInput label="Ngày hiệu lực" type="date" />
                  <FormInput label="Ngày hết hạn" type="date" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl p-10 shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-500">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <span className="material-symbols-outlined">settings_suggest</span>
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Quy tắc tính toán</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Cấu hình logic áp dụng đơn giá</p>
                </div>
              </div>

              <div className="space-y-10">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 block">Phương thức tính giá</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SelectionCard 
                      active={pricingRule === 'FIXED'} 
                      onClick={() => setPricingRule('FIXED')}
                      icon="monetization_on"
                      title="Giá cố định"
                      desc="ÁP DỤNG MỘT CON SỐ CỤ THỂ"
                    />
                    <SelectionCard 
                      active={pricingRule === 'DYNAMIC'} 
                      onClick={() => setPricingRule('DYNAMIC')}
                      icon="trending_up"
                      title="Giá linh hoạt"
                      desc="TĂNG/GIẢM THEO TỶ LỆ GIÁ GỐC"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 block">Phạm vi hàng hóa</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SelectionCard 
                      active={scopeType === 'ALL'} 
                      onClick={() => setScopeType('ALL')}
                      icon="inventory_2"
                      title="Toàn bộ danh mục"
                      desc="TẤT CẢ SẢN PHẨM TRONG KHO"
                    />
                    <SelectionCard 
                      active={scopeType === 'SPECIFIC'} 
                      onClick={() => {
                        setScopeType('SPECIFIC');
                        setIsModalOpen(true);
                      }}
                      icon="view_in_ar"
                      title="Sản phẩm cụ thể"
                      desc={selectedProducts.length > 0 ? `ĐÃ CHỌN ${selectedProducts.length} SẢN PHẨM` : "CHỌN TỪ DANH SÁCH"}
                    />
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-8 items-center pt-6 border-t border-slate-50">
                  <div className="flex-1 w-full">
                    <FormInput label="Giá trị áp dụng" placeholder="0" />
                  </div>
                  <div className="flex-1 w-full bg-slate-50 p-6 rounded-xl flex justify-between items-center border border-slate-100">
                    <div>
                      <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Trạng thái hoạt động</p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Kích hoạt bảng giá ngay lập tức</p>
                    </div>
                    <button 
                      onClick={() => setStatus(!status)}
                      className={`w-14 h-8 rounded-full transition-all relative ${status ? 'bg-blue-600' : 'bg-slate-200'}`}
                    >
                      <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${status ? 'left-7' : 'left-1'}`}></div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Cột phải */}
          <div className="xl:flex-[1] flex flex-col gap-8">
            <div className="bg-slate-900 rounded-xl sm:rounded-2xl p-10 text-white shadow-2xl shadow-slate-200 sticky top-4 overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
              <div className="relative z-10">
                <h3 className="text-xl font-black uppercase tracking-tighter mb-8 flex items-center gap-3">
                  <span className="material-symbols-outlined text-blue-500">groups</span>
                  Đối tượng áp dụng
                </h3>

                <div className="space-y-10">
                  <CheckGroup label="Phân loại khách hàng" options={['Cá nhân', 'Doanh nghiệp']} />
                  <CheckGroup label="Hạng thành viên" options={['Silver', 'Gold', 'VIP Member']} />
                  
                  <div className="pt-6 border-t border-white/10">
                    <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-4 block">Khu vực địa lý</label>
                    <div className="bg-white/5 rounded-xl p-6 border border-white/5 space-y-4 max-h-[250px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 pr-2">
                      {['Miền Bắc', 'Miền Trung', 'Miền Nam', 'Đông Nam Bộ', 'Tây Nguyên'].map(loc => (
                        <label key={loc} className="flex items-center gap-3 cursor-pointer group/item">
                          <input type="checkbox" className="w-5 h-5 rounded-lg bg-white/10 border-none accent-blue-600" />
                          <span className="text-xs font-bold text-white/60 group-hover/item:text-white transition-colors">{loc}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl p-10 shadow-sm border border-slate-300">
               <h4 className="font-black text-slate-900 uppercase tracking-tight mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-slate-400">description</span> Ghi chú nội bộ
              </h4>
              <textarea 
                rows="4" 
                placeholder="Lưu ý về lý do thay đổi giá..." 
                className="w-full bg-slate-50 border-2 border-transparent rounded-xl p-5 text-sm font-bold outline-none focus:border-blue-100 focus:bg-white transition-all text-slate-700 resize-none"
              ></textarea>
            </div>
          </div>
        </div>
      </div>

      <ProductSelectionModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={(items) => setSelectedProducts(items)}
        initialSelected={selectedProducts.map(p => p.id)}
      />
    </div>
  );
};

const FormInput = ({ label, ...props }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">{label}</label>
    <input 
      {...props}
      className="w-full bg-slate-50 border-2 border-transparent rounded-xl p-4 text-sm font-bold outline-none focus:border-blue-100 focus:bg-white transition-all text-slate-700" 
    />
  </div>
);

const SelectionCard = ({ active, onClick, icon, title, desc }) => (
  <button 
    onClick={onClick}
    className={`p-6 rounded-xl border-2 text-left transition-all group ${
      active ? 'border-blue-600 bg-blue-50/30 shadow-lg shadow-blue-100/50' : 'border-slate-50 bg-slate-50/50 hover:border-slate-100'
    }`}
  >
    <span className={`material-symbols-outlined mb-4 transition-colors ${active ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`}>{icon}</span>
    <p className={`font-black uppercase tracking-tight text-sm ${active ? 'text-slate-900' : 'text-slate-400'}`}>{title}</p>
    <p className={`text-[9px] font-black uppercase tracking-widest mt-1 ${active ? 'text-blue-600/70' : 'text-slate-300'}`}>{desc}</p>
  </button>
);

const CheckGroup = ({ label, options }) => (
  <div>
    <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-4 block">{label}</label>
    <div className="grid grid-cols-2 gap-4">
      {options.map(opt => (
        <label key={opt} className="flex items-center gap-3 cursor-pointer group/item">
          <input type="checkbox" className="w-5 h-5 rounded-lg bg-white/10 border-none accent-blue-600" />
          <span className="text-xs font-bold text-white/60 group-hover/item:text-white transition-colors">{opt}</span>
        </label>
      ))}
    </div>
  </div>
);

export default AddPrice;
