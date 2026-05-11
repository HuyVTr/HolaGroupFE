import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CategoryManagement = () => {
  const navigate = useNavigate();

  // --- 1. Dữ liệu & Trạng thái ---
  const [categories, setCategories] = useState([
    { id: 1, name: 'Thiết bị điện tử', desc: 'Sản phẩm đang kinh doanh', icon: '💻' },
    { id: 2, name: 'Nội thất văn phòng', desc: 'Sản phẩm đang kinh doanh', icon: '🛋️' },
    { id: 3, name: 'Thiết bị công nghiệp', desc: 'Sản phẩm đang kinh doanh', icon: '🏭' },
    { id: 4, name: 'Vật tư vận tải', desc: 'Sản phẩm đang kinh doanh', icon: '🚚' },
  ]);

  // Quản lý Modal Xóa
  const [showModal, setShowModal] = useState(false);
  const [targetCategory, setTargetCategory] = useState(null);

  // Quản lý Modal Sửa
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState(null);

  // Quản lý Thông báo (Toast)
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  // --- 2. Xử lý Logic ---

  // Hiện thông báo và tự ẩn sau 3 giây
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  // --- LOGIC XÓA ---
  const openConfirmModal = (cat) => {
    setTargetCategory(cat);
    setShowModal(true);
  };

  const confirmDelete = () => {
    setShowModal(false); // Đóng modal trước
    // Giả lập logic: ID 3 là danh mục có sản phẩm (lỗi)
    if (targetCategory.id === 3) {
      showToast('Không thể xóa! Danh mục này vẫn còn sản phẩm.', 'error');
    } else {
      setCategories(categories.filter(c => c.id !== targetCategory.id));
      showToast(`Đã xóa danh mục "${targetCategory.name}" thành công.`);
    }
    setTargetCategory(null);
  };

  // --- LOGIC SỬA ---
  const openEditModal = (cat) => {
    setEditFormData({ ...cat }); // Copy dữ liệu danh mục được click
    setShowEditModal(true);
  };

  const saveEditCategory = () => {
    // Thay thế danh mục cũ bằng dữ liệu mới
    const updatedCategories = categories.map(c => 
      c.id === editFormData.id ? editFormData : c
    );
    setCategories(updatedCategories); // Cập nhật lại list
    setShowEditModal(false); // Đóng modal
    showToast(`Đã cập nhật danh mục "${editFormData.name}" thành công!`);
  };

  return (
    <div className="flex flex-col gap-8 w-full pb-10 relative min-h-screen">
      
      {/* --- HEADER --- */}
      <div className="flex justify-between items-end mt-4">
        <div>
          <p className="text-[11px] font-bold text-[#00288E] uppercase tracking-widest mb-2">Quản lý kho doanh nghiệp</p>
          <h1 className="text-3xl font-bold text-slate-800 font-manrope">Quản lý danh mục</h1>
        </div>
        <button 
          onClick={() => navigate('/home/categories/add')}
          className="bg-[#00288E] hover:bg-[#1e40af] text-white px-5 py-3 rounded-xl text-sm font-semibold transition-all shadow-md flex items-center gap-2"
        >
          <span className="text-lg leading-none">⊕</span> Thêm danh mục
        </button>
      </div>

      {/* --- DANH SÁCH DANH MỤC --- */}
      <div className="flex flex-col gap-4">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-white rounded-2xl p-5 flex items-center justify-between border border-slate-100 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-xl bg-[#eff3ff] text-[#00288E] flex items-center justify-center text-2xl">
                {cat.icon}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">{cat.name}</h3>
                <p className="text-sm text-slate-500">{cat.desc}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* NÚT SỬA */}
              <button 
                onClick={() => openEditModal(cat)}
                className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-[#00288E] transition-colors"
              >
                ✎
              </button>
              {/* NÚT XÓA */}
              <button 
                onClick={() => openConfirmModal(cat)}
                className="w-10 h-10 rounded-full flex items-center justify-center bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all"
              >
                🗑
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* --- MODAL XÁC NHẬN XÓA --- */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                ⚠️
              </div>
              <h2 className="text-xl font-bold text-slate-800 mb-2">Xác nhận xóa?</h2>
              <p className="text-sm text-slate-500 leading-relaxed">
                Bạn có chắc chắn muốn xóa danh mục <span className="font-bold text-slate-700">"{targetCategory?.name}"</span>? Hành động này không thể hoàn tác.
              </p>
            </div>
            <div className="flex gap-3 mt-8">
              <button 
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-3 bg-slate-100 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-200 transition-colors"
              >
                Hủy bỏ
              </button>
              <button 
                onClick={confirmDelete}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 shadow-lg shadow-red-200 transition-all"
              >
                Đúng, xóa nó!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL CHỈNH SỬA DANH MỤC --- */}
      {showEditModal && editFormData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-200">
            <h2 className="text-2xl font-bold text-[#1e3a8a] mb-6 font-manrope">Chỉnh sửa danh mục</h2>
            
            <div className="flex flex-col gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Tên danh mục</label>
                <input 
                  type="text" 
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-sm outline-none focus:border-[#00288E] focus:bg-white transition-all font-semibold text-slate-700" 
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Mô tả danh mục</label>
                <textarea 
                  rows="3"
                  value={editFormData.desc}
                  onChange={(e) => setEditFormData({...editFormData, desc: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-sm outline-none focus:border-[#00288E] focus:bg-white transition-all font-medium text-slate-700 resize-none" 
                ></textarea>
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
                onClick={saveEditCategory}
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

export default CategoryManagement;