import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import salesService from '../../services/salesService';

const CustomerList = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState([]);

  // 1. Dữ liệu: Gọi từ salesService và map sang định dạng UI
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const data = await salesService.getCustomers();
        const mapped = data.map(c => ({
          id: (c.firstName?.substring(0, 1) || '') + (c.lastName?.substring(0, 1) || 'KH'),
          customerID: c.customerID,
          name: c.companyName || `${c.lastName || ''} ${c.firstName || ''}`,
          phone: c.phoneNumber || 'N/A',
          email: c.email || 'N/A',
          group: c.status === 'ACTIVE' ? 'VIP' : 'TIÊU CHUẨN',
          groupColor: c.status === 'ACTIVE' ? 'bg-[#ffdbce] text-[#802a00]' : 'bg-gray-200 text-gray-700',
          revenue: '0 đ', 
          status: c.status === 'ACTIVE' ? 'Hoạt động' : 'Ngoại tuyến',
          isActive: c.status === 'ACTIVE',
          avatarBg: c.status === 'ACTIVE' ? 'bg-blue-100 text-[#00288E]' : 'bg-gray-200 text-gray-800'
        }));
        setCustomers(mapped);
      } catch (err) {
        console.error("Lỗi khi tải khách hàng:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  // --- 2. TRẠNG THÁI MODAL & TOAST ---
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [targetCustomer, setTargetCustomer] = useState(null);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState(null);

  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  // --- 3. CÁC HÀM XỬ LÝ ---
  const showToastMsg = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  // LOGIC XÓA
  const openDeleteModal = (customer) => {
    setTargetCustomer(customer);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setShowDeleteModal(false);
    const updatedCustomers = customers.filter(c => c.customerID !== targetCustomer.customerID);
    setCustomers(updatedCustomers);
    showToastMsg(`Đã xóa khách hàng "${targetCustomer.name}" thành công!`);
    setTargetCustomer(null);
  };

  // LOGIC SỬA
  const openEditModal = (customer) => {
    setEditFormData({ ...customer });
    setShowEditModal(true);
  };

  const saveEditCustomer = () => {
    const updatedCustomers = customers.map(c => 
      c.customerID === editFormData.customerID ? editFormData : c
    );
    setCustomers(updatedCustomers);
    setShowEditModal(false);
    showToastMsg(`Đã cập nhật thông tin "${editFormData.name}" thành công!`);
  };

  return (
    <div className="font-inter flex flex-col w-full h-full bg-slate-50 animate-fade-in gap-4 md:gap-6">
      
      {/* Header - Cố định */}
      <div className="flex justify-between items-start shrink-0 px-2 md:px-0">
        <div>
          <h1 className="text-3xl sm:text-4xl lg:text-[2rem] font-black text-slate-900 uppercase tracking-tight leading-tight">Hồ sơ Khách hàng</h1>
          <p className="text-sm sm:text-base text-slate-600 font-medium mt-1 max-w-lg leading-relaxed">
            Quản lý thông tin khách hàng, nhóm đối tượng và doanh thu tích lũy.
          </p>
        </div>
        
        <button 
          onClick={() => navigate('/sales/customers/add')}
          className="bg-gradient-to-r from-[#00288E] to-[#1e40af] text-white px-6 py-3 rounded-xl font-medium text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 shrink-0 whitespace-nowrap"
        >
          <span className="material-symbols-outlined text-[20px]">person_add</span>
          Thêm khách hàng
        </button>
      </div>

      {/* Content - Cuộn nội bộ */}
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 pr-1 md:pr-2 pb-4">
        <div className="flex flex-col gap-6">

          {/* Thẻ Thống kê */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 shrink-0 px-2 md:px-0">
            <div className="bg-white p-6 rounded-2xl border border-slate-300 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-blue-500 transition-all duration-300 cursor-pointer">
              <p className="text-xs text-[#444653] font-semibold mb-2 uppercase tracking-wider">TỔNG KHÁCH HÀNG</p>
              <h2 className="text-3xl font-bold text-[#00288E] mb-2">{customers.length}</h2>
              <p className="text-xs text-green-600 flex items-center gap-1 font-medium">
                <span className="w-2 h-2 bg-green-500 rounded-full inline-block"></span> +12% tháng này
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-300 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-blue-500 transition-all duration-300 cursor-pointer">
              <p className="text-xs text-[#444653] font-semibold mb-2 uppercase tracking-wider">KHÁCH HÀNG VIP</p>
              <h2 className="text-3xl font-bold text-[#00288E] mb-2">142</h2>
              <p className="text-xs text-blue-600 flex items-center gap-1 font-medium">
                <span className="w-2 h-2 bg-blue-500 rounded-full inline-block"></span> Top 10% doanh thu
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-300 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-blue-500 transition-all duration-300 cursor-pointer">
              <p className="text-xs text-[#444653] font-semibold mb-2 uppercase tracking-wider">DOANH THU TRUNG BÌNH</p>
              <h2 className="text-3xl font-bold text-[#00288E] mb-2">14.2M</h2>
              <p className="text-xs text-[#444653] font-medium uppercase tracking-wider">VNĐ / Mỗi khách hàng</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-300 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-blue-500 transition-all duration-300 cursor-pointer">
              <p className="text-xs text-[#444653] font-semibold mb-2 uppercase tracking-wider">TỶ LỆ GIỮ CHÂN</p>
              <h2 className="text-3xl font-bold text-[#00288E] mb-4">92%</h2>
              <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#00288E] w-[92%] h-full"></div>
              </div>
            </div>
          </div>

          {/* Bảng dữ liệu */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-300 hover:shadow-xl hover:border-blue-500 transition-all duration-300 overflow-hidden mx-2 md:mx-0 flex flex-col">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 shrink-0">
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-blue-50 text-[#00288E] text-sm font-medium rounded-lg">Tất cả</button>
                <button className="px-4 py-2 text-[#444653] hover:bg-gray-100 text-sm font-medium rounded-lg transition-colors">Khách hàng VIP</button>
                <button className="px-4 py-2 text-[#444653] hover:bg-gray-100 text-sm font-medium rounded-lg transition-colors">Khách hàng Mới</button>
              </div>
            </div>

            <div className="overflow-x-auto relative">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-gray-100 border-b border-gray-200 z-10">
                  <tr className="text-xs text-[#444653] font-medium uppercase tracking-wider">
                    <th className="p-4 pl-6">Tên Khách Hàng</th>
                    <th className="p-4">SĐT</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Nhóm Khách Hàng</th>
                    <th className="p-4">Doanh Thu Tích Lũy</th>
                    <th className="p-4">Trạng Thái</th>
                    <th className="p-4 text-center">THAO TÁC</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer, index) => (
                    <tr key={index} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="p-4 pl-6 flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-semibold text-sm ${customer.avatarBg}`}>
                          {customer.id}
                        </div>
                        <span className="font-medium text-[#191c1e]">{customer.name}</span>
                      </td>
                      <td className="p-4 text-sm text-[#444653]">{customer.phone}</td>
                      <td className="p-4 text-sm text-[#444653]">{customer.email}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold ${customer.groupColor}`}>
                          {customer.group}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-[#00288E]">{customer.revenue}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${customer.isActive ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                          <span className="text-sm text-[#191c1e]">{customer.status}</span>
                        </div>
                      </td>
                      
                      {/* Cột Thao tác */}
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button 
                            title="Lịch sử giao dịch"
                            className="text-gray-400 hover:text-[#00288E] hover:bg-blue-50 transition-colors p-1.5 rounded-lg flex items-center justify-center"
                            onClick={() => showToastMsg(`Đang mở lịch sử giao dịch của ${customer.name}...`)}
                          >
                            <span className="material-symbols-outlined text-[18px]">history</span>
                          </button>
                          <button 
                            title="Chỉnh sửa"
                            onClick={() => openEditModal(customer)}
                            className="text-gray-400 hover:text-[#00288E] hover:bg-gray-100 transition-colors p-1.5 rounded-lg flex items-center justify-center"
                          >
                            <span className="material-symbols-outlined text-[18px]">edit</span>
                          </button>
                          <button 
                            title="Xóa khách hàng"
                            onClick={() => openDeleteModal(customer)}
                            className="text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors p-1.5 rounded-lg flex items-center justify-center"
                          >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-[#444653] shrink-0 bg-white">
              <span>Hiển thị 1 - {customers.length} của {customers.length} khách hàng</span>
              <div className="flex items-center gap-1">
                <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#00288E] text-white font-medium">1</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- MODAL XÁC NHẬN XÓA --- */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                ⚠️
              </div>
              <h2 className="text-xl font-bold text-slate-800 mb-2">Xác nhận xóa?</h2>
              <p className="text-sm text-slate-500 leading-relaxed">
                Bạn có chắc muốn xóa hồ sơ khách hàng <span className="font-bold text-slate-700">"{targetCustomer?.name}"</span>?
              </p>
            </div>
            <div className="flex gap-3 mt-8">
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-200 transition-colors"
              >
                Hủy bỏ
              </button>
              <button 
                onClick={confirmDelete}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 shadow-lg shadow-red-200 transition-all"
              >
                Xóa khách hàng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL SỬA THÔNG TIN --- */}
      {showEditModal && editFormData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-200">
            <h2 className="text-2xl font-bold text-[#00288E] mb-6 font-manrope">Chỉnh sửa hồ sơ</h2>
            
            <div className="flex flex-col gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Họ và tên</label>
                <input 
                  type="text" 
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-sm outline-none focus:border-[#00288E] focus:bg-white transition-all font-semibold text-slate-700" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Nhóm khách hàng</label>
                <select 
                  value={editFormData.group}
                  onChange={(e) => setEditFormData({...editFormData, group: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-sm outline-none focus:border-[#00288E] focus:bg-white transition-all font-semibold text-slate-700 appearance-none"
                >
                  <option value="VIP">VIP</option>
                  <option value="GOLD">GOLD</option>
                  <option value="DOANH NGHIỆP">DOANH NGHIỆP</option>
                  <option value="TIÊU CHUẨN">TIÊU CHUẨN</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Trạng thái</label>
                <select 
                  value={editFormData.status}
                  onChange={(e) => setEditFormData({...editFormData, status: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-sm outline-none focus:border-[#00288E] focus:bg-white transition-all font-semibold text-slate-700 appearance-none"
                >
                  <option value="Hoạt động">Hoạt động</option>
                  <option value="Ngoại tuyến">Ngoại tuyến</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button 
                onClick={() => setShowEditModal(false)}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-200 transition-colors"
              >
                Hủy bỏ
              </button>
              <button 
                onClick={saveEditCustomer}
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
        <div className={`fixed bottom-8 right-8 z-[100] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-right-10 duration-300 bg-slate-800 text-white`}>
          <span className="text-xl">✅</span>
          <p className="text-sm font-bold tracking-wide">{toast.message}</p>
        </div>
      )}
    </div>
  );
};

export default CustomerList;