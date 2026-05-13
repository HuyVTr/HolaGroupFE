import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PriceManagement = () => {
  const navigate = useNavigate();

  // Danh sách thông tin khách hàng mẫu (đóng vai trò là dữ liệu gốc)
  // Bạn có thể coi đây là danh bạ hoặc danh sách khách hàng chuẩn.
  const customerDatabase = [
    { email: 'contact@vinfast.vn', name: 'VinFast Trading', group: 'VIP MEMBER', subGroup: 'DOANH NGHIỆP', groupColor: 'bg-[#ffdbce] text-[#802a00]', avatar: 'V' },
    { email: 'procurement@sonkim.com', name: 'Sơn Kim Group', group: 'GOLD MEMBER', subGroup: 'DOANH NGHIỆP', groupColor: 'bg-blue-100 text-blue-800', avatar: 'S' },
    { email: 'sales@trungnguyen.vn', name: 'Trung Nguyen Legend', group: 'TIÊU CHUẨN', subGroup: 'CÁ NHÂN', groupColor: 'bg-gray-200 text-gray-700', avatar: 'T' },
    { email: 'admin@masan.vn', name: 'Masan Group', group: 'VIP MEMBER', subGroup: 'DOANH NGHIỆP', groupColor: 'bg-[#ffdbce] text-[#802a00]', avatar: 'M' }
  ];

  // Dữ liệu mẫu (Mock data) hiển thị trên bảng
  const [quotations, setQuotations] = useState([
    {
      id: 'QT-2024-00125',
      name: 'VinFast Trading',
      email: 'contact@vinfast.vn',
      group: 'VIP MEMBER',
      subGroup: 'DOANH NGHIỆP',
      groupColor: 'bg-[#ffdbce] text-[#802a00]',
      date: '24/05/2024',
      value: '450,000,000 đ',
      status: 'ĐÃ DUYỆT',
      statusColor: 'bg-emerald-50 text-emerald-600',
      avatar: 'V'
    },
    {
      id: 'QT-2024-00126',
      name: 'Sơn Kim Group',
      email: 'procurement@sonkim.com',
      group: 'GOLD MEMBER',
      subGroup: 'DOANH NGHIỆP',
      groupColor: 'bg-blue-100 text-blue-800',
      date: '23/05/2024',
      value: '1,280,000,000 đ',
      status: 'ĐÃ GỬI',
      statusColor: 'bg-blue-50 text-blue-600',
      avatar: 'S'
    },
    {
      id: 'QT-2024-00127',
      name: 'Trung Nguyen Legend',
      email: 'sales@trungnguyen.vn',
      group: 'TIÊU CHUẨN',
      subGroup: 'CÁ NHÂN',
      groupColor: 'bg-gray-200 text-gray-700',
      date: '22/05/2024',
      value: '85,500,000 đ',
      status: 'NHÁP',
      statusColor: 'bg-gray-100 text-gray-600',
      avatar: 'T'
    },
    {
      id: 'QT-2024-00128',
      name: 'Masan Group',
      email: 'admin@masan.vn',
      group: 'VIP MEMBER',
      subGroup: 'DOANH NGHIỆP',
      groupColor: 'bg-[#ffdbce] text-[#802a00]',
      date: '20/05/2024',
      value: '320,000,000 đ',
      status: 'ĐÃ HỦY',
      statusColor: 'bg-red-50 text-red-600',
      avatar: 'M'
    }
  ]);

  // --- TRẠNG THÁI MODAL & TOAST ---
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [targetQuotation, setTargetQuotation] = useState(null);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState(null);

  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  // --- HÀM XỬ LÝ ---
  const showToastMsg = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  // LOGIC XÓA
  const openDeleteModal = (qt) => {
    setTargetQuotation(qt);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setShowDeleteModal(false);
    const updatedQuotations = quotations.filter(q => q.id !== targetQuotation.id);
    setQuotations(updatedQuotations);
    showToastMsg(`Đã xóa báo giá "${targetQuotation.id}" thành công!`);
    setTargetQuotation(null);
  };

  // LOGIC SỬA
  const openEditModal = (qt) => {
    setEditFormData({ ...qt });
    setShowEditModal(true);
  };

  // Hàm xử lý khi thay đổi Email trong form Sửa
  const handleEmailChange = (newEmail) => {
    // Tìm kiếm thông tin khách hàng từ danh sách cơ sở dữ liệu dựa trên email mới
    const matchedCustomer = customerDatabase.find(c => c.email === newEmail);

    if (matchedCustomer) {
      // Nếu tìm thấy, cập nhật lại tên, nhóm, avatar...
      setEditFormData({
        ...editFormData,
        email: newEmail,
        name: matchedCustomer.name,
        group: matchedCustomer.group,
        subGroup: matchedCustomer.subGroup,
        groupColor: matchedCustomer.groupColor,
        avatar: matchedCustomer.avatar
      });
    } else {
      // Nếu không tìm thấy trong DB, chỉ cập nhật riêng email và để trống hoặc giữ nguyên thông tin khác
      setEditFormData({
        ...editFormData,
        email: newEmail
      });
    }
  };

  const saveEditQuotation = () => {
    const updatedQuotations = quotations.map(q => 
      q.id === editFormData.id ? editFormData : q
    );
    setQuotations(updatedQuotations);
    setShowEditModal(false);
    showToastMsg(`Đã cập nhật báo giá "${editFormData.id}" thành công!`);
  };

  return (
    <div className="font-inter flex flex-col w-full h-full bg-slate-50 animate-fade-in gap-4 md:gap-6">
      
      {/* Header */}
      <div className="flex justify-between items-start shrink-0 px-2 md:px-0">
        <div>
          <h1 className="text-3xl sm:text-4xl lg:text-[2rem] font-black text-slate-900 uppercase tracking-tight leading-tight">Quản lý báo giá</h1>
          <p className="text-sm sm:text-base text-slate-600 font-medium mt-1 max-w-lg leading-relaxed">
            Kiểm soát dòng tiền và hiệu quả kinh doanh của hệ thống.
          </p>
        </div>
        
        <button 
          onClick={() => navigate('/sales/prices/add')}
          className="bg-[#00288E] hover:bg-[#00288E]/90 text-white px-5 py-2.5 rounded-lg font-semibold text-sm shadow-sm transition-colors flex items-center gap-2 whitespace-nowrap"
        >
          <span className="material-symbols-outlined text-xl">add_circle</span> Tạo báo giá mới
        </button>
      </div>

      {/* Content - Cuộn nội bộ */}
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 pr-1 md:pr-2 pb-4">
        <div className="flex flex-col gap-4 mx-2 md:mx-0">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-300 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-blue-500 transition-all duration-300 cursor-pointer flex flex-col justify-center h-32 relative overflow-hidden">
          <p className="text-slate-400 text-[10px] font-bold tracking-wider uppercase mb-1">TỔNG BÁO GIÁ</p>
          <div className="flex items-end gap-4">
            <span className="text-4xl font-bold text-[#00288E] font-manrope">{quotations.length}</span>
            <span className="text-emerald-600 text-xs font-bold mb-1.5 flex items-center gap-0.5">
              ↗ +12.5% <span className="text-slate-400 font-normal">so với tháng trước</span>
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-300 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-blue-500 transition-all duration-300 cursor-pointer flex flex-col justify-center h-32 relative overflow-hidden">
          <p className="text-slate-400 text-[10px] font-bold tracking-wider uppercase mb-1">ĐANG CHỜ DUYỆT</p>
          <div className="flex items-end gap-4">
            <span className="text-4xl font-bold text-slate-800 font-manrope">42</span>
            <span className="text-slate-400 text-xs font-normal mb-1.5">Cần xử lý trong 24 giờ tới</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-300 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-blue-500 transition-all duration-300 cursor-pointer flex flex-col justify-center h-32 relative overflow-hidden">
          <p className="text-slate-400 text-[10px] font-bold tracking-wider uppercase mb-1">TỶ LỆ CHUYỂN ĐỔI</p>
          <div className="flex items-end gap-4">
            <span className="text-4xl font-bold text-[#00288E] font-manrope">68.4%</span>
            <div className="w-24 bg-blue-100 h-1.5 rounded-full overflow-hidden mb-2">
              <div className="bg-[#00288E] w-[68%] h-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* --- CÔNG CỤ TÌM KIẾM VÀ LỌC --- */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-2xl border border-slate-300 items-center justify-between shadow-sm hover:shadow-md transition-all">
        <div className="relative w-full md:w-2/3">
          <input 
            type="text" 
            placeholder="Tìm kiếm theo mã báo giá hoặc tên khách hàng..." 
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 pl-10 text-sm outline-none focus:border-[#00288E] focus:bg-white transition-all text-slate-700" 
          />
          <span className="absolute left-3 top-3.5 opacity-40 text-base">🔍</span>
        </div>

        <div className="flex w-full md:w-auto gap-3 items-center">
          <select className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-sm outline-none text-slate-600 px-4 pr-10">
            <option>Tất cả trạng thái</option>
            <option>Đã duyệt</option>
            <option>Đã gửi</option>
            <option>Nháp</option>
          </select>

          <button className="bg-[#00288E] hover:bg-[#1e40af] text-white px-5 py-3.5 rounded-xl text-xs font-bold transition-all shadow-sm">
            Lọc kết quả
          </button>
        </div>
      </div>

      {/* --- BẢNG DỮ LIỆU CHÍNH --- */}
      <div className="bg-white rounded-2xl border border-slate-300 overflow-hidden shadow-sm hover:shadow-xl hover:border-blue-500 transition-all duration-300 flex flex-col">
        
        <div className="p-5 flex justify-between items-center border-b border-slate-50 bg-white">
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-blue-50 text-[#00288E] text-xs font-bold rounded-lg">Danh sách gần đây</button>
            <button className="px-4 py-2 text-slate-400 hover:bg-slate-50 text-xs font-bold rounded-lg transition-colors">Đang chờ</button>
          </div>
          <button className="text-xs text-slate-500 font-semibold hover:text-[#00288E]">Bộ lọc nâng cao</button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50/50 border-y border-slate-100 text-slate-400 text-xs font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">MÃ BÁO GIÁ</th>
                <th className="px-6 py-4">KHÁCH HÀNG</th>
                <th className="px-6 py-4">NGÀY LẬP</th>
                <th className="px-6 py-4">GIÁ TRỊ</th>
                <th className="px-6 py-4 text-center">TRẠNG THÁI</th>
                <th className="px-6 py-4 text-center">THAO TÁC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {quotations.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-10 text-slate-500 text-xs">
                    Không có báo giá nào.
                  </td>
                </tr>
              ) : (
                quotations.map((qt) => (
                  <tr key={qt.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-[#00288E]">{qt.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs bg-slate-100 text-[#00288E]">
                          {qt.avatar}
                        </div>
                        <div>
                          <span className="font-bold text-slate-800 text-sm">{qt.name}</span>
                          <p className="text-[10px] text-slate-400 mt-0.5">{qt.email}</p>
                        </div>
                        {qt.group && (
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md ${qt.groupColor}`}>
                            {qt.group}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-600">{qt.date}</td>
                    <td className="px-6 py-4 font-bold font-manrope text-[#00288E]">{qt.value}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase ${qt.statusColor}`}>
                        {qt.status}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button 
                          title="Gửi email báo giá"
                          className="text-gray-400 hover:text-[#00288E] hover:bg-blue-50 transition-colors p-1.5 rounded-lg flex items-center justify-center"
                          onClick={() => showToastMsg(`Đã gửi email báo giá ${qt.id} cho ${qt.email} thành công!`)}
                        >
                          <span className="material-symbols-outlined text-[20px]">mail</span>
                        </button>
                        <button 
                          title="Chuyển thành đơn hàng"
                          className="text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors p-1.5 rounded-lg flex items-center justify-center"
                          onClick={() => showToastMsg(`Đã chuyển báo giá ${qt.id} thành đơn hàng!`)}
                        >
                          <span className="material-symbols-outlined text-[20px]">shopping_cart_checkout</span>
                        </button>
                        <button 
                          title="Chỉnh sửa"
                          onClick={() => openEditModal(qt)}
                          className="text-gray-400 hover:text-[#00288E] hover:bg-gray-50 transition-colors p-1.5 rounded-lg flex items-center justify-center"
                        >
                          <span className="material-symbols-outlined text-[20px]">edit</span>
                        </button>
                        <button 
                          title="Xóa báo giá"
                          onClick={() => openDeleteModal(qt)}
                          className="text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors p-1.5 rounded-lg flex items-center justify-center"
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

        <div className="p-5 flex items-center justify-between text-sm text-slate-500 bg-white border-t border-slate-100">
          <span className="text-xs text-slate-400">Hiển thị 1-10 trên tổng số {quotations.length} báo giá</span>
        </div>
      </div>

      {/* --- MODAL XÁC NHẬN XÓA --- */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">⚠️</div>
              <h2 className="text-xl font-bold text-slate-800 mb-2">Xác nhận xóa?</h2>
              <p className="text-sm text-slate-500 leading-relaxed">
                Bạn có chắc chắn muốn xóa mã báo giá <span className="font-bold text-slate-700">"{targetQuotation?.id}"</span>?
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
                onClick={confirmDelete}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 shadow-lg shadow-red-200 transition-all"
              >
                Xóa báo giá
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL SỬA THÔNG TIN --- */}
      {showEditModal && editFormData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-200">
            <h2 className="text-2xl font-bold text-[#00288E] mb-6 font-manrope">Chỉnh sửa Báo giá</h2>
            
            <div className="flex flex-col gap-5">
              
              {/* Chọn/sửa email khách hàng */}
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Email khách hàng</label>
                <select 
                  value={editFormData.email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-sm outline-none focus:border-[#00288E] focus:bg-white transition-all font-semibold text-slate-700 appearance-none"
                >
                  <option value="">Chọn email khách hàng</option>
                  {customerDatabase.map(c => (
                    <option key={c.email} value={c.email}>{c.email}</option>
                  ))}
                </select>
              </div>

              {/* Tên khách hàng (Tự động cập nhật, khóa hoặc disable để tránh nhập sai) */}
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Tên khách hàng</label>
                <input 
                  type="text" 
                  value={editFormData.name}
                  disabled
                  className="w-full bg-slate-100 border border-slate-200 p-3.5 rounded-xl text-sm outline-none font-semibold text-slate-400 cursor-not-allowed" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Nhóm khách hàng</label>
                <input 
                  type="text" 
                  value={editFormData.group}
                  disabled
                  className="w-full bg-slate-100 border border-slate-200 p-3.5 rounded-xl text-sm outline-none font-semibold text-slate-400 cursor-not-allowed" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Trạng thái</label>
                <select 
                  value={editFormData.status}
                  onChange={(e) => setEditFormData({...editFormData, status: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-sm outline-none focus:border-[#00288E] focus:bg-white transition-all font-semibold text-slate-700 appearance-none"
                >
                  <option value="ĐÃ DUYỆT">ĐÃ DUYỆT</option>
                  <option value="ĐÃ GỬI">ĐÃ GỬI</option>
                  <option value="NHÁP">NHÁP</option>
                  <option value="ĐÃ HỦY">ĐÃ HỦY</option>
                </select>
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
                onClick={saveEditQuotation}
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
        <div className="fixed bottom-8 right-8 z-[100] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-right-10 duration-300 bg-slate-800 text-white">
          <span className="text-xl">✅</span>
          <p className="text-sm font-bold tracking-wide">{toast.message}</p>
        </div>
      )}
        </div>
      </div>
    </div>
  );
};

export default PriceManagement;