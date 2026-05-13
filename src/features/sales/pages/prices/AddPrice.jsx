import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';

// ==========================================
// 1. MODAL CHỌN SẢN PHẨM CỤ THỂ
// ==========================================
const ProductSelectionModal = ({ isOpen, onClose, onConfirm, initialSelected }) => {
  const [products] = useState([
    { id: 'SL-77291', name: 'Chronos Elite V2', category: 'HÀNG XA XỈ', price: '42,500,000 đ' },
    { id: 'SL-99012', name: 'Arch-Vision Tablet Pro', category: 'CÔNG NGHỆ DOANH NGHIỆP', price: '18,900,000 đ' },
    { id: 'SL-11234', name: 'Nexus Core Server 5k', category: 'PHẦN CỨNG', price: '125,000,000 đ' },
    { id: 'SL-44567', name: 'Office Brew Master', category: 'TIỆN NGHI', price: '4,200,000 đ' },
    { id: 'SL-88123', name: 'Quantum Display X', category: 'CÔNG NGHỆ DOANH NGHIỆP', price: '32,000,000 đ' },
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
      <div className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl animate-in fade-in zoom-in duration-200 flex flex-col h-[550px]">
        
        {/* Header Modal */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Danh sách sản phẩm</h2>
            <p className="text-xs text-slate-500 mt-0.5">Tìm kiếm và chọn sản phẩm để áp dụng quy tắc giá</p>
          </div>
          <button 
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors text-slate-500 font-bold"
          >
            ✕
          </button>
        </div>

        {/* Thanh tìm kiếm */}
        <div className="relative mb-6">
          <input 
            type="text" 
            placeholder="Tìm kiếm theo mã sản phẩm hoặc tên sản phẩm..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 p-3.5 pl-11 rounded-xl text-sm outline-none focus:border-[#00288E] focus:bg-white transition-all text-slate-700 font-medium" 
          />
          <span className="absolute left-4 top-4 text-slate-400 text-base">🔍</span>
        </div>

        {/* Bảng danh mục sản phẩm */}
        <div className="flex-1 overflow-y-auto border border-slate-100 rounded-2xl bg-slate-50/30 custom-scrollbar mb-6">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="sticky top-0 bg-white border-b border-slate-100 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5 w-12 text-center">CHỌN</th>
                <th className="px-5 py-3.5">MÃ & SẢN PHẨM</th>
                <th className="px-5 py-3.5">DANH MỤC</th>
                <th className="px-5 py-3.5 text-right">ĐƠN GIÁ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-10 text-slate-400 text-xs font-semibold">
                    Không tìm thấy sản phẩm phù hợp.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr 
                    key={product.id} 
                    onClick={() => toggleSelectProduct(product.id)}
                    className={`hover:bg-slate-50 cursor-pointer transition-colors ${
                      selectedProductIds.includes(product.id) ? 'bg-blue-50/40' : ''
                    }`}
                  >
                    <td className="px-5 py-4 text-center">
                      <input 
                        type="checkbox" 
                        checked={selectedProductIds.includes(product.id)}
                        onChange={() => {}} 
                        className="accent-[#00288E] w-4 h-4 rounded pointer-events-none" 
                      />
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center flex-shrink-0 text-slate-300 text-[10px]">IMG</div>
                        <div>
                          <div className="font-bold text-slate-800">{product.name}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5 font-mono">{product.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-600 font-medium text-xs">{product.category}</td>
                    <td className="px-5 py-4 text-right font-bold text-slate-800">{product.price}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center border-t border-slate-100 pt-5">
          <span className="text-xs text-slate-400 font-semibold">
            Đã chọn: <b className="text-[#00288E]">{selectedProductIds.length}</b> sản phẩm
          </span>
          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="px-5 py-2.5 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-200 transition-colors"
            >
              Hủy bỏ
            </button>
            <button 
              onClick={handleConfirm}
              className="px-5 py-2.5 bg-[#00288E] hover:bg-[#1e40af] text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-2"
            >
              <span>✅</span> Xác nhận chọn
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


// ==========================================
// 2. COMPONENT CHÍNH AddPrice
// ==========================================
const AddPrice = () => {
  const navigate = useNavigate();

  // State cho thông tin cơ bản
  const [priceName, setPriceName] = useState('');
  const [currency, setCurrency] = useState('VNĐ - Việt Nam Đồng');
  
  // State quy tắc thiết lập giá
  const [pricingRule, setPricingRule] = useState('Giá cố định');
  const [scopeType, setScopeType] = useState('Toàn bộ danh mục');
  
  // State cho Modal chọn Sản phẩm cụ thể
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);

  // State cho tương tác
  const [value, setValue] = useState('');
  const [status, setStatus] = useState(true);

  return (
    <div className="font-inter flex flex-col w-full h-full bg-slate-50 animate-fade-in gap-4 md:gap-6">
      
      {/* --- HEADER --- */}
      <div className="flex justify-between items-start shrink-0 px-2 md:px-0">
        <div>
          <h1 className="text-3xl sm:text-4xl lg:text-[2rem] font-black text-slate-900 uppercase tracking-tight leading-tight">Thêm bảng giá mới</h1>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={() => navigate('/sales/prices')}
            className="px-5 py-2.5 rounded-lg font-semibold text-sm border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm"
          >
            Hủy bỏ
          </button>
          <button 
            onClick={() => navigate('/sales/prices')}
            className="bg-[#00288E] hover:bg-[#00288E]/90 text-white px-5 py-2.5 rounded-lg font-semibold text-sm shadow-sm transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-xl">save</span> Lưu bảng giá
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 pr-1 md:pr-2 pb-4">
        <div className="flex flex-col xl:flex-row gap-6 mx-2 md:mx-0">
          
          {/* Cột trái (Form nhập liệu) */}
          <div className="xl:flex-[2] flex flex-col gap-6">
          <div className="bg-white rounded-3xl p-8 shadow-[0_2px_20px_rgba(0,0,0,0.03)] border border-slate-100 flex flex-col gap-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-1 h-5 bg-[#00288E] rounded-full"></div>
              <h3 className="text-sm font-bold text-slate-800 tracking-wide uppercase">👤 Thông tin cơ bản</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">
                  Tên bảng giá <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  placeholder="VD: Bảng giá đối tác miền Bắc Q3" 
                  value={priceName}
                  onChange={(e) => setPriceName(e.target.value)}
                  className="w-full bg-slate-50/70 border border-slate-200 p-3.5 rounded-xl text-sm outline-none focus:border-[#00288E] focus:bg-white transition-all font-medium text-slate-700" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">Mã bảng giá</label>
                <input 
                  type="text" 
                  placeholder="PL-2024-NORTH-01" 
                  className="w-full bg-slate-50/70 border border-slate-200 p-3.5 rounded-xl text-sm outline-none focus:border-[#00288E] focus:bg-white transition-all font-medium text-slate-700" 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">Loại tiền tệ</label>
                <select 
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full bg-slate-50/70 border border-slate-200 p-3.5 rounded-xl text-sm outline-none focus:border-[#00288E] focus:bg-white transition-all font-medium text-slate-700 appearance-none"
                >
                  <option>VNĐ - Việt Nam Đồng</option>
                  <option>USD - Đô la Mỹ</option>
                  <option>EUR - Euro</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">Ngày bắt đầu</label>
                  <input type="date" className="w-full bg-slate-50/70 border border-slate-200 p-3.5 rounded-xl text-sm outline-none focus:border-[#00288E] focus:bg-white transition-all font-medium text-slate-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">Ngày kết thúc</label>
                  <input type="date" className="w-full bg-slate-50/70 border border-slate-200 p-3.5 rounded-xl text-sm outline-none focus:border-[#00288E] focus:bg-white transition-all font-medium text-slate-500" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">Ghi chú</label>
              <textarea 
                rows="3" 
                placeholder="Mô tả chi tiết về bảng giá này..." 
                className="w-full bg-slate-50/70 border border-slate-200 p-3.5 rounded-xl text-sm outline-none focus:border-[#00288E] focus:bg-white transition-all text-slate-700 resize-none"
              ></textarea>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-[0_2px_20px_rgba(0,0,0,0.03)] border border-slate-100 flex flex-col gap-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-1 h-5 bg-[#00288E] rounded-full"></div>
              <h3 className="text-sm font-bold text-slate-800 tracking-wide uppercase">⚙️ Quy tắc thiết lập giá</h3>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-3 uppercase tracking-wide">Cách tính giá</label>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  type="button"
                  onClick={() => setPricingRule('Giá cố định')}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    pricingRule === 'Giá cố định' ? 'border-[#00288E] bg-blue-50/30' : 'border-slate-100 hover:border-slate-300 bg-slate-50/50'
                  }`}
                >
                  <p className="font-bold text-sm text-slate-800 mb-1">Giá cố định</p>
                  <span className="text-[10px] text-slate-400 font-semibold tracking-wider">ÁP DỤNG MỘT CON SỐ CỤ THỂ</span>
                </button>
                <button 
                  type="button"
                  onClick={() => setPricingRule('Silver Member')}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    pricingRule === 'Silver Member' ? 'border-[#00288E] bg-blue-50/30' : 'border-slate-100 hover:border-slate-300 bg-slate-50/50'
                  }`}
                >
                  <p className="font-bold text-sm text-slate-800 mb-1">Silver Member</p>
                  <span className="text-[10px] text-slate-400 font-semibold tracking-wider">TĂNG/GIẢM DỰA TRÊN GIÁ GỐC</span>
                </button>
              </div>
            </div>

            {/* Phạm vi áp dụng */}
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-3 mt-2 uppercase tracking-wide">Phạm vi áp dụng</label>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  type="button"
                  onClick={() => setScopeType('Toàn bộ danh mục')}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    scopeType === 'Toàn bộ danh mục' ? 'border-[#00288E] bg-blue-50/30' : 'border-slate-100 hover:border-slate-300 bg-slate-50/50'
                  }`}
                >
                  <p className="font-bold text-sm text-slate-800">Toàn bộ danh mục</p>
                </button>
                
                {/* NÚT BẤM KÍCH HOẠT MODAL CHỌN SẢN PHẨM */}
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                    scopeType === 'Sản phẩm cụ thể' ? 'border-[#00288E] bg-blue-50/30' : 'border-slate-100 hover:border-slate-300 bg-slate-50/50'
                  }`}
                >
                  <p className="font-bold text-sm text-slate-800">Sản phẩm cụ thể</p>
                  {selectedProducts.length > 0 && (
                    <span className="text-[10px] font-bold text-green-600 mt-2">
                      Đã chọn: {selectedProducts.length} sản phẩm
                    </span>
                  )}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center mt-2 border-t border-slate-50 pt-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">Giá trị áp dụng</label>
                <input 
                  type="text" 
                  placeholder="Nhập giá trị..." 
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="w-full bg-slate-50/70 border border-slate-200 p-3.5 rounded-xl text-sm outline-none focus:border-[#00288E] focus:bg-white transition-all font-medium text-slate-700" 
                />
              </div>
              <div className="flex justify-between items-center bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                <div>
                  <p className="text-xs font-bold text-slate-800 mb-0.5">Trạng thái hoạt động</p>
                  <p className="text-[10px] text-slate-400 tracking-wide uppercase">Hoạt động | Tạm dừng hệ thống</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={status} 
                    onChange={() => setStatus(!status)} 
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00288E]"></div>
                </label>
              </div>
            </div>
          </div>

          </div>

        {/* Cột phải (Đối tượng áp dụng) */}
        <div className="xl:flex-[1] flex flex-col gap-6">
          <div className="bg-white rounded-3xl p-6 shadow-[0_2px_20px_rgba(0,0,0,0.03)] border border-slate-100">
            <h3 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2 uppercase tracking-wide">
              <span className="text-[#00288E]">👥</span> Đối tượng áp dụng
            </h3>

            {/* Loại khách hàng */}
            <div className="mb-6">
              <label className="text-[10px] font-bold text-slate-400 tracking-wider mb-3 block uppercase">Loại khách hàng</label>
              <p className="text-[10px] text-slate-400 mb-3">Chọn loại hình khách hàng mục tiêu cho bảng giá này.</p>
              <div className="space-y-2.5">
                {['Cá nhân', 'Doanh nghiệp'].map((type) => (
                  <label key={type} className="flex items-center gap-3 text-sm font-medium text-slate-700 cursor-pointer">
                    <input type="checkbox" className="accent-[#00288E] w-4 h-4 rounded" />
                    {type}
                  </label>
                ))}
              </div>
            </div>

            {/* Thứ hạng khách hàng */}
            <div className="mb-6 border-t border-slate-50 pt-5">
              <label className="text-[10px] font-bold text-slate-400 tracking-wider mb-2 block uppercase">Thứ hạng khách hàng</label>
              <p className="text-[10px] text-slate-400 mb-3">Bảng giá này sẽ tự động áp dụng cho khách hàng dựa trên thứ hạng thành viên của họ.</p>
              <div className="space-y-2.5">
                {['Silver Member', 'Gold Member', 'VIP Member'].map((member) => (
                  <label key={member} className="flex items-center gap-3 text-sm font-medium text-slate-700 cursor-pointer">
                    <input type="checkbox" className="accent-[#00288E] w-4 h-4 rounded" />
                    {member}
                  </label>
                ))}
              </div>
            </div>

            {/* Khu vực */}
            <div className="pt-5 border-t border-slate-50">
              <label className="text-[10px] font-bold text-slate-400 tracking-wider mb-2 block uppercase">Khu vực</label>
              <p className="text-[10px] text-slate-400 mb-3">Bảng giá này sẽ tự động áp dụng cho các khách hàng thuộc nhóm được chọn.</p>
              <div className="bg-slate-100 p-3 rounded-xl max-h-40 overflow-y-auto space-y-2 border border-slate-200 text-sm text-slate-700">
                {['Tất cả khu vực', 'Miền Bắc', 'Miền Trung', 'Miền Nam', 'Đông Nam Bộ'].map((location) => (
                  <label key={location} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="accent-[#00288E]" />
                    {location}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Banner Thông tin */}
          <div className="bg-[#1e3a8a] rounded-3xl p-6 shadow-xl text-white relative overflow-hidden">
            <div className="absolute top-[-20%] right-[-10%] w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
            <div className="mb-8">
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center mb-4">
                <span className="text-white opacity-80">💡</span>
              </div>
              <p className="text-[10px] font-bold text-blue-200 uppercase tracking-widest mb-2">Phân tích giá thông minh</p>
              <h2 className="text-lg font-bold font-manrope leading-tight text-white mb-2">Hệ thống phân tích thông minh</h2>
              <p className="text-xs text-blue-100 opacity-80 leading-relaxed">
                Hệ thống Ledger giúp tự động hóa việc tính toán lợi nhuận dựa trên các quy tắc bảng giá bạn thiết lập.
              </p>
            </div>
          </div>
        </div>
        </div>
      </div>

      {/* MODAL GỌI BẢNG SẢN PHẨM */}
      <ProductSelectionModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={(items) => {
          setSelectedProducts(items);
          setScopeType('Sản phẩm cụ thể');
        }}
        initialSelected={selectedProducts.map(p => p.id)}
      />
    </div>
  );
};

export default AddPrice;