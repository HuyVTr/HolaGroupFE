import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import salesService from '../../services/salesService';

const ProductManagement = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  // --- 1. DỮ LIỆU SẢN PHẨM: Gọi từ salesService ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsData, categoriesData] = await Promise.all([
          salesService.getProducts(),
          salesService.getCategories()
        ]);
        
        setCategories(categoriesData);

        const mapped = productsData.map(p => {
          const cat = categoriesData.find(c => c.categoryID === p.categoryID);
          return {
            id: `PRD-${p.productID}`,
            productID: p.productID,
            name: p.productName,
            category: cat ? cat.categoryName : 'Khác',
            price: new Intl.NumberFormat('vi-VN').format(p.salePrice),
            stock: 100, 
            status: p.status === 'ACTIVE' ? 'Còn hàng' : 'Ngừng kinh doanh'
          };
        });
        setProducts(mapped);
      } catch (err) {
        console.error("Lỗi khi tải sản phẩm:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const categoriesList = categories.map(c => c.categoryName);

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
    const updatedProducts = products.filter(p => p.productID !== targetProduct.productID);
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
      p.productID === editFormData.productID ? editFormData : p
    );
    
    setProducts(updatedProducts); 
    setShowEditModal(false);      
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00288E]"></div>
      </div>
    );
  }

  return (
    <div className="font-inter flex flex-col w-full h-full bg-slate-50 animate-fade-in gap-4 md:gap-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 shrink-0 px-2 md:px-0">
        <div>
          <h1 className="text-3xl sm:text-4xl lg:text-[2rem] font-black text-slate-900 uppercase tracking-tight leading-tight">Danh mục Sản phẩm</h1>
          <p className="text-sm sm:text-base text-slate-600 font-medium mt-1 max-w-md">
            Quản lý tài sản doanh nghiệp, mức tồn kho và khả năng hiển thị danh mục từ một sổ cái thống nhất.
          </p>
        </div>
        
        <button 
          onClick={() => navigate('/sales/products/add')}
          className="bg-[#00288E] hover:bg-[#00288E]/90 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm flex items-center justify-center gap-2 whitespace-nowrap"
        >
          <span className="material-symbols-outlined text-xl">add</span> 
          Thêm Sản phẩm
        </button>
      </div>

      {/* Content - Cuộn nội bộ */}
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 pr-1 md:pr-2 pb-4">
        <div className="flex flex-col gap-6">
          
          {/* 4 Cards Thống kê */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 shrink-0 px-2 md:px-0">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-300 flex flex-col justify-between min-h-[120px] hover:shadow-xl hover:-translate-y-1 hover:border-blue-500 transition-all duration-300 cursor-pointer">
              <p className="text-[8px] sm:text-[9px] text-slate-500 font-bold uppercase tracking-widest leading-none">Tổng số SKU</p>
              <div className="flex items-end gap-3 mt-3">
                <span className="text-sm sm:text-base md:text-lg xl:text-xl font-black text-slate-900 tracking-tight">{products.length}</span>
                <span className="text-emerald-600 text-xs font-bold mb-1.5 flex items-center">
                  <span className="material-symbols-outlined text-[14px]">trending_up</span> +12%
                </span>
              </div>
            </div>
            
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-300 flex flex-col justify-between min-h-[120px] hover:shadow-xl hover:-translate-y-1 hover:border-blue-500 transition-all duration-300 cursor-pointer">
              <p className="text-[8px] sm:text-[9px] text-slate-500 font-bold uppercase tracking-widest leading-none">Cảnh báo tồn kho thấp</p>
              <div className="flex items-end gap-3 mt-3">
                <span className="text-sm sm:text-base md:text-lg xl:text-xl font-black text-rose-600 tracking-tight">14</span>
                <span className="text-rose-600 text-xs font-bold mb-1.5">Cần xử lý</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-300 flex flex-col justify-between min-h-[120px] hover:shadow-xl hover:-translate-y-1 hover:border-blue-500 transition-all duration-300 cursor-pointer">
              <p className="text-[8px] sm:text-[9px] text-slate-500 font-bold uppercase tracking-widest leading-none">Giá trị kho hàng</p>
              <div className="flex items-end gap-2 mt-3">
                <span className="text-sm sm:text-base md:text-lg xl:text-xl font-black text-slate-900 tracking-tight">2.4B</span>
                <span className="text-slate-500 text-xs font-medium mb-1.5">VNĐ</span>
              </div>
            </div>

            <div className="bg-[#00288E] p-5 rounded-2xl shadow-md flex flex-col justify-center min-h-[120px] text-white relative overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer">
              <div className="absolute -right-2 -bottom-2 text-6xl opacity-10 group-hover:scale-110 transition-transform duration-500">📦</div>
              <p className="text-blue-200 text-[8px] sm:text-[9px] font-bold tracking-widest uppercase mb-2">14 Phút trước</p>
              <h3 className="text-sm sm:text-base md:text-lg xl:text-xl font-black tracking-tight">Đồng bộ gần nhất</h3>
            </div>
          </div>

          {/* Box Bảng dữ liệu chính */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-300 hover:shadow-xl hover:border-blue-500 transition-all duration-300 flex flex-col overflow-hidden mx-2 md:mx-0">
            <div className="p-4 md:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border-b border-gray-100 shrink-0">
              <div className="flex gap-3">
                <button className="flex items-center gap-2 bg-slate-50 border border-gray-200 hover:bg-slate-100 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
                  <span className="material-symbols-outlined text-[18px]">filter_list</span> Lọc
                </button>
                <button className="flex items-center gap-2 bg-slate-50 border border-gray-200 hover:bg-slate-100 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
                  <span className="material-symbols-outlined text-[18px]">sort</span> Sắp xếp
                </button>
              </div>
              <div className="text-sm text-slate-500 font-medium">
                Hiển thị 1-{products.length} trên tổng số {products.length} sản phẩm
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap relative">
                <thead className="sticky top-0 bg-slate-50 z-10 border-b border-gray-200">
                  <tr className="text-slate-500 text-xs font-bold uppercase tracking-wider">
                    <th className="px-6 py-4 font-semibold">Chi tiết sản phẩm</th>
                    <th className="px-6 py-4 font-semibold">Danh mục</th>
                    <th className="px-6 py-4 font-semibold">Giá (VNĐ)</th>
                    <th className="px-6 py-4 font-semibold">Trạng thái kho</th>
                    <th className="px-6 py-4 font-semibold text-center">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-slate-700">
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-12 text-slate-500">
                        <span className="material-symbols-outlined text-4xl block mb-2 opacity-50">inventory_2</span>
                        Không có sản phẩm nào.
                      </td>
                    </tr>
                  ) : (
                    products.map((product, index) => (
                      <tr key={index} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-slate-100 rounded-lg border border-gray-200 flex items-center justify-center flex-shrink-0">
                              <span className="material-symbols-outlined text-slate-400">image</span>
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 text-sm md:text-base">{product.name}</div>
                              <div className="text-xs text-slate-500 mt-0.5">ID: {product.id}</div>
                            </div>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-full uppercase tracking-wide border border-blue-100">
                            {product.category}
                          </span>
                        </td>
                        
                        <td className="px-6 py-4 font-bold text-slate-900 text-sm md:text-base">
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
                            <button 
                              onClick={() => openEditModal(product)} 
                              className="text-slate-400 hover:text-[#00288E] hover:bg-blue-50 transition-colors p-2 rounded-lg"
                              title="Chỉnh sửa"
                            >
                              <span className="material-symbols-outlined text-[20px]">edit</span>
                            </button>
                            <button 
                              onClick={() => openDeleteModal(product)}
                              className="text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors p-2 rounded-lg"
                              title="Xóa"
                            >
                              <span className="material-symbols-outlined text-[20px]">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-4 flex items-center justify-between text-sm text-slate-500 bg-white border-t border-gray-100 shrink-0">
              <button className="font-semibold hover:text-[#00288E] uppercase text-xs tracking-wider flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">chevron_left</span> Trước
              </button>
              <div className="flex gap-1">
                <button className="w-8 h-8 flex items-center justify-center bg-[#00288E] text-white rounded-lg font-medium shadow-sm">1</button>
              </div>
              <button className="font-semibold hover:text-[#00288E] uppercase text-xs tracking-wider flex items-center gap-1">
                Sau <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </button>
            </div>
          </div>

          {/* Bottom Widgets */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 shrink-0 px-2 md:px-0">
            <div className="lg:col-span-2 bg-[#00288E] rounded-xl p-6 md:p-8 flex flex-col sm:flex-row justify-between items-center text-white shadow-md relative overflow-hidden gap-6">
              <div className="relative z-10 max-w-md text-center sm:text-left">
                <h2 className="text-xl md:text-2xl font-bold mb-2">Tự động Bổ sung Kho hàng</h2>
                <p className="text-blue-100 text-sm mb-6 opacity-90 leading-relaxed">
                  Hãy để thuật toán thông minh của hệ thống dự báo thời điểm hàng hóa có nhu cầu cao sắp hết dựa trên xu hướng bán hàng.
                </p>
                <button className="bg-white text-[#00288E] px-6 py-2.5 rounded-lg text-sm font-bold shadow-sm hover:bg-slate-50 transition-colors">
                  Bật Tự động hóa
                </button>
              </div>
              <div className="hidden sm:block w-48 h-24 bg-white/10 rounded-xl border border-white/20 p-4 relative z-10 shrink-0">
                 <div className="w-3/4 h-2 bg-white/30 rounded-full mb-3"></div>
                 <div className="w-full h-2 bg-white/20 rounded-full mb-3"></div>
                 <div className="w-1/2 h-2 bg-white/20 rounded-full"></div>
              </div>
            </div>

            <div className="bg-rose-50 rounded-xl p-6 md:p-8 shadow-sm flex flex-col justify-center border border-rose-100">
              <div className="flex items-center gap-3 mb-3">
                <span className="material-symbols-outlined text-rose-500 text-3xl">warning</span>
                <h3 className="text-rose-700 font-bold text-lg">Tồn kho Nguy cấp</h3>
              </div>
              <p className="text-rose-600 text-sm mb-4 font-medium">
                3 mặt hàng dự kiến sẽ hết hàng trong vòng 48 giờ tới.
              </p>
              <a href="#" className="text-rose-700 text-sm font-bold underline hover:text-rose-800 flex items-center gap-1 w-fit">
                Xem báo cáo <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </a>
            </div>
          </div>
          
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