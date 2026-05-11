import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProductManagement = () => {
  const navigate = useNavigate();

  // --- 1. DỮ LIỆU SẢN PHẨM ---
  const [products, setProducts] = useState([
    { 
      id: 'SL-77291', name: 'Chronos Elite V2', 
      category: 'HÀNG XA XỈ', price: '42,500,000', 
      stock: 142, status: 'Còn hàng' 
    },
    { 
      id: 'SL-99012', name: 'Arch-Vision Tablet Pro', 
      category: 'CÔNG NGHỆ DOANH NGHIỆP', price: '18,900,000', 
      stock: 8, status: 'Sắp hết hàng' 
    },
    { 
      id: 'SL-11234', name: 'Nexus Core Server 5k', 
      category: 'PHẦN CỨNG', price: '125,000,000', 
      stock: 142, status: 'Còn hàng' 
    },
    { 
      id: 'SL-44567', name: 'Office Brew Master', 
      category: 'TIỆN NGHI', price: '4,200,000', 
      stock: 8, status: 'Sắp hết hàng' 
    },
  ]);

  const [activeTab, setActiveTab] = useState('Danh mục');
  const topTabs = ['Danh mục'];

  // Danh sách các danh mục để chọn trong Modal Sửa
  const categoriesList = [
    'HÀNG XA XỈ',
    'CÔNG NGHỆ DOANH NGHIỆP',
    'PHẦN CỨNG',
    'TIỆN NGHI',
    'THIẾT BỊ VĂN PHÒNG'
  ];

  // --- 2. TRẠNG THÁI MODAL & TOAST ---
  // Modal Xóa
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [targetProduct, setTargetProduct] = useState(null);
  
  // Modal Sửa
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState(null); 

  // Thông báo Toast
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  // --- 3. CÁC HÀM XỬ LÝ ---
  
  // Hàm hiển thị thông báo
  const showToastMsg = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  // --- LOGIC XÓA ---
  const openDeleteModal = (product) => {
    setTargetProduct(product);
    setShowDeleteModal(true);
  };

  const confirmDeleteProduct = () => {
    setShowDeleteModal(false);
    const updatedProducts = products.filter(p => p.id !== targetProduct.id);
    setProducts(updatedProducts);
    showToastMsg(`Đã xóa sản phẩm "${targetProduct.name}" thành công!`);
    setTargetProduct(null);
  };

  // --- LOGIC SỬA ---
  const openEditModal = (product) => {
    setEditFormData({ ...product }); 
    setShowEditModal(true);
  };

  const saveEditProduct = () => {
    const updatedProducts = products.map(p => 
      p.id === editFormData.id ? editFormData : p
    );
    
    setProducts(updatedProducts); 
    setShowEditModal(false);      
    showToastMsg(`Đã cập nhật sản phẩm "${editFormData.name}" thành công!`);
  };

  return (
    <div className="flex flex-col gap-6 relative min-h-screen">
      
      {/* Top Tabs */}
      <div className="flex gap-6 border-b border-slate-200">
        {topTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-sm font-medium transition-all border-b-2 ${
              activeTab === tab
                ? 'border-[#00288E] text-[#00288E]'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Header */}
      <div className="flex justify-between items-start mt-2">
        <div>
          <h1 className="text-3xl font-bold text-[#1e3a8a] font-manrope">Danh mục Sản phẩm</h1>
          <p className="text-sm text-slate-500 mt-2 max-w-md">
            Quản lý tài sản doanh nghiệp, mức tồn kho và khả năng hiển thị danh mục từ một sổ cái thống nhất.
          </p>
        </div>
        
        <button 
          onClick={() => navigate('/home/products/add')}
          className="bg-[#00288E] hover:bg-[#1e40af] text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-md flex items-center gap-2"
        >
          <span className="text-lg leading-none">+</span> Thêm Sản phẩm
        </button>
      </div>

      {/* 4 Cards Thống kê */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between h-32">
          <p className="text-slate-400 text-xs font-semibold tracking-wider uppercase">Tổng số SKU</p>
          <div className="flex items-end gap-3">
            <span className="text-4xl font-bold text-[#1e3a8a] font-manrope">{products.length}</span>
            <span className="text-emerald-600 text-xs font-bold mb-1.5">+12%</span>
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between h-32">
          <p className="text-slate-400 text-xs font-semibold tracking-wider uppercase">Cảnh báo tồn kho thấp</p>
          <div className="flex items-end gap-3">
            <span className="text-4xl font-bold text-[#802a00] font-manrope">14</span>
            <span className="text-[#802a00] text-xs font-bold mb-1.5">Cần xử lý</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between h-32">
          <p className="text-slate-400 text-xs font-semibold tracking-wider uppercase">Giá trị kho hàng</p>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-bold text-[#1e3a8a] font-manrope">2.4B</span>
            <span className="text-slate-400 text-xs font-medium mb-1.5">Giá trị Kho hàng</span>
          </div>
        </div>

        <div className="bg-[#00288E] p-5 rounded-2xl shadow-md flex flex-col justify-center h-32 text-white relative overflow-hidden">
          <div className="absolute right-[-10px] bottom-[-20px] opacity-10 text-8xl">📦</div>
          <p className="text-blue-200 text-xs font-semibold tracking-wider uppercase mb-1">14 Phút trước</p>
          <h3 className="text-lg font-bold font-manrope">Đồng bộ gần nhất</h3>
        </div>
      </div>

      {/* Box Bảng dữ liệu chính */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col overflow-hidden mt-2">
        <div className="p-5 flex justify-between items-center bg-white border-b border-slate-100">
          <div className="flex gap-3">
            <button className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              <span>≡</span> Lọc
            </button>
            <button className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              <span>⇅</span> Sắp xếp
            </button>
          </div>
          <div className="text-sm text-slate-400">
            Hiển thị 1-{products.length} trên tổng số {products.length} sản phẩm
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-white border-b border-slate-100 text-slate-400 text-xs font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 w-1/3">CHI TIẾT SẢN PHẨM</th>
                <th className="px-6 py-4">DANH MỤC</th>
                <th className="px-6 py-4">GIÁ (VNĐ)</th>
                <th className="px-6 py-4">TRẠNG THÁI KHO</th>
                <th className="px-6 py-4 text-center">THAO TÁC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-10 text-slate-500">
                    Không có sản phẩm nào.
                  </td>
                </tr>
              ) : (
                products.map((product, index) => (
                  <tr key={index} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center flex-shrink-0">
                          <span className="text-slate-300 text-xs">IMG</span>
                        </div>
                        <div>
                          <div className="font-bold text-[#1e3a8a] text-base">{product.name}</div>
                          <div className="text-xs text-slate-400 mt-0.5">ID: {product.id}</div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-full uppercase tracking-wide">
                        {product.category}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 font-bold text-slate-800 text-base">
                      {product.price}
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${product.stock > 10 ? 'bg-emerald-500' : 'bg-orange-500'}`}></span>
                        <span className={`font-semibold text-xs ${product.stock > 10 ? 'text-emerald-600' : 'text-orange-600'}`}>
                          {product.stock} {product.status}
                        </span>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {/* BẤM NÚT SỬA */}
                        <button 
                          onClick={() => openEditModal(product)} 
                          className="text-slate-400 hover:text-[#00288E] hover:bg-slate-100 transition-colors p-2 rounded-lg"
                        >
                          ✎
                        </button>
                        {/* BẤM NÚT XÓA */}
                        <button 
                          onClick={() => openDeleteModal(product)}
                          className="text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors p-2 rounded-lg"
                        >
                          🗑
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-5 flex items-center justify-between text-sm text-slate-500 bg-white">
          <button className="font-semibold hover:text-[#00288E] uppercase text-xs tracking-wider">Trước</button>
          <div className="flex gap-2">
            <button className="w-8 h-8 flex items-center justify-center bg-[#00288E] text-white rounded-md font-medium shadow-sm">1</button>
          </div>
          <button className="font-semibold hover:text-[#00288E] uppercase text-xs tracking-wider">Sau</button>
        </div>
      </div>

      {/* Bottom Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-2">
        <div className="lg:col-span-2 bg-[#1e3a8a] rounded-2xl p-8 flex justify-between items-center text-white shadow-md relative overflow-hidden">
          <div className="relative z-10 max-w-md">
            <h2 className="text-2xl font-bold font-manrope mb-2">Tự động Bổ sung Kho hàng</h2>
            <p className="text-blue-100 text-sm mb-6 opacity-90 leading-relaxed">
              Hãy để thuật toán thông minh của Sổ Cái dự báo thời điểm hàng hóa nhu cầu cao sắp hết dựa trên xu hướng bán hàng.
            </p>
            <button className="bg-white text-[#1e3a8a] px-6 py-2.5 rounded-lg text-sm font-bold shadow-sm hover:bg-slate-50 transition-colors">
              Bật Tự động hóa
            </button>
          </div>
          <div className="hidden md:block w-48 h-24 bg-white/10 rounded-xl border border-white/20 p-4 relative z-10">
             <div className="w-3/4 h-2 bg-white/30 rounded-full mb-3"></div>
             <div className="w-full h-2 bg-white/20 rounded-full mb-3"></div>
             <div className="w-1/2 h-2 bg-white/20 rounded-full"></div>
          </div>
        </div>

        <div className="bg-[#ffe5d9] rounded-2xl p-8 shadow-sm flex flex-col justify-center border border-[#ffd8c4]">
          <div className="text-[#a33500] text-3xl mb-3">⚠️</div>
          <h3 className="text-[#802a00] font-bold text-lg font-manrope mb-2">Cảnh báo Tồn kho Nguy cấp</h3>
          <p className="text-[#a33500] text-sm mb-4">
            3 mặt hàng dự kiến sẽ hết hàng trong vòng 48 giờ tới.
          </p>
          <a href="#" className="text-[#802a00] text-sm font-bold underline hover:text-[#5c1e00]">
            Xem báo cáo
          </a>
        </div>
      </div>

      {/* --- MODAL XÁC NHẬN XÓA SẢN PHẨM --- */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                ⚠️
              </div>
              <h2 className="text-xl font-bold text-slate-800 mb-2">Xác nhận xóa?</h2>
              <p className="text-sm text-slate-500 leading-relaxed">
                Bạn có chắc chắn muốn xóa sản phẩm <span className="font-bold text-slate-700">"{targetProduct?.name}"</span>? 
              </p>
            </div>
            <div className="flex gap-3 mt-8">
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-3 bg-slate-100 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-200 transition-colors"
              >
                Hủy bỏ
              </button>
              <button 
                onClick={confirmDeleteProduct}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 shadow-lg shadow-red-200 transition-all"
              >
                Xóa sản phẩm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL CHỈNH SỬA SẢN PHẨM --- */}
      {showEditModal && editFormData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-200">
            <h2 className="text-2xl font-bold text-[#1e3a8a] mb-6 font-manrope">Chỉnh sửa sản phẩm</h2>
            
            <div className="flex flex-col gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Tên sản phẩm</label>
                <input 
                  type="text" 
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-sm outline-none focus:border-[#00288E] focus:bg-white transition-all font-semibold text-slate-700" 
                />
              </div>

              {/* ĐÃ THÊM Ô CHỌN DANH MỤC Ở ĐÂY */}
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Danh mục</label>
                <select 
                  value={editFormData.category}
                  onChange={(e) => setEditFormData({...editFormData, category: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-sm outline-none focus:border-[#00288E] focus:bg-white transition-all font-semibold text-slate-700 appearance-none"
                >
                  {categoriesList.map((cat, idx) => (
                    <option key={idx} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Giá tiền (VNĐ)</label>
                <input 
                  type="text" 
                  value={editFormData.price}
                  onChange={(e) => setEditFormData({...editFormData, price: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-sm outline-none focus:border-[#00288E] focus:bg-white transition-all font-semibold text-slate-700" 
                />
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button 
                onClick={() => setShowEditModal(false)}
                className="flex-1 px-4 py-3 bg-slate-100 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-200 transition-colors"
              >
                Hủy bỏ
              </button>
              <button 
                onClick={saveEditProduct}
                className="flex-1 px-4 py-3 bg-[#00288E] text-white rounded-xl text-sm font-bold hover:bg-[#1e40af] shadow-md transition-all"
              >
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- THÔNG BÁO TOAST --- */}
      {toast.show && (
        <div className={`fixed bottom-8 right-8 z-[100] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-right-10 duration-300 ${
          toast.type === 'error' ? 'bg-red-600 text-white' : 'bg-slate-800 text-white'
        }`}>
          <span className="text-xl">{toast.type === 'error' ? '❌' : '✅'}</span>
          <p className="text-sm font-bold tracking-wide">{toast.message}</p>
        </div>
      )}

    </div>
  );
};

export default ProductManagement;