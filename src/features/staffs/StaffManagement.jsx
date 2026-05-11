import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const StaffManagement = () => {
  const navigate = useNavigate();

  const [staffList, setStaffList] = useState([
    { id: 1, name: 'Trần Anh Huy', email: 'huy.ta@holagroup.vn', initials: 'TH', bgColor: 'bg-indigo-100 text-indigo-700', dept: 'Quản trị hệ thống', role: 'Admin', status: 'Hoạt động', lastLogin: '15 phút trước' },
    { id: 2, name: 'Lê Thị Minh', email: 'minh.lt@holagroup.vn', avatar: 'https://i.pravatar.cc/150?img=5', dept: 'Kinh doanh', role: 'Sales', status: 'Hoạt động', lastLogin: '2 giờ trước' },
    { id: 3, name: 'Nguyễn Văn Phúc', email: 'phuc.nv@holagroup.vn', initials: 'NP', bgColor: 'bg-orange-100 text-orange-700', dept: 'Kho vận', role: 'Warehouse', status: 'Ngoại tuyến', lastLogin: '3 ngày trước' },
    { id: 4, name: 'Phạm Mỹ Linh', email: 'linh.pm@holagroup.vn', avatar: 'https://i.pravatar.cc/150?img=9', dept: 'Kế toán', role: 'Accounting', status: 'Hoạt động', lastLogin: 'Hôm qua' },
  ]);

  const [openRoleMenu, setOpenRoleMenu] = useState(null);
  const roles = ['Admin', 'Sales', 'Warehouse', 'Accounting'];

  const handleRoleChange = (id, newRole) => {
    setStaffList(staffList.map(staff => staff.id === id ? { ...staff, role: newRole } : staff));
    setOpenRoleMenu(null);
  };

  return (
    <div className="w-full bg-[#f8fafc] min-h-screen p-6 font-sans text-[#191c1e]">
      
      {/* 1. Tiêu đề & Nút Thêm mới (Gọi navigate qua App) */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#0f172a] mb-2 tracking-tight">Quản lý Nhân sự & Phân quyền</h1>
          <p className="text-[#64748b] text-sm max-w-lg leading-relaxed">
            Hệ thống quản trị tập trung cho Hola Group. Điều chỉnh vai trò, quyền hạn và giám sát hoạt động của đội ngũ nhân viên.
          </p>
        </div>
        
        <button 
          onClick={() => navigate('/home/staffs/add')}
          className="bg-[#1e3a8a] hover:bg-blue-900 text-white px-5 py-2.5 rounded-lg font-semibold text-sm shadow-sm transition-all flex items-center gap-2"
        >
          <span>👤+</span> Thêm nhân viên mới
        </button>
      </div>

      {/* 2. Thanh tìm kiếm và bộ lọc */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <input 
            type="text" 
            placeholder="Tìm kiếm theo tên hoặc email..." 
            className="w-full bg-gray-100 border-none rounded-lg py-2.5 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-[#1e3a8a]/20" 
          />
          <span className="absolute left-3 top-2.5 opacity-40">🔍</span>
        </div>
        <select className="bg-gray-100 border-none text-gray-600 text-sm rounded-lg px-4 py-2.5 outline-none font-medium appearance-none pr-10">
          <option>Tất cả phòng ban</option>
          <option>Kinh doanh</option>
          <option>Kế toán</option>
        </select>
        <button className="bg-gray-100 text-gray-600 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-200 transition flex items-center gap-2">
          <span>≡</span> Lọc thêm
        </button>
      </div>

      {/* 3. Bảng Nhân sự */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-visible mb-8">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="text-xs text-gray-500 uppercase font-bold tracking-wider border-b border-gray-100">
            <tr>
              <th className="px-6 py-4">NHÂN VIÊN</th>
              <th className="px-6 py-4">PHÒNG BAN</th>
              <th className="px-6 py-4">VAI TRÒ</th>
              <th className="px-6 py-4">TRẠNG THÁI</th>
              <th className="px-6 py-4">ĐĂNG NHẬP CUỐI</th>
              <th className="px-6 py-4 text-center">THAO TÁC</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {staffList.map((staff) => (
              <tr key={staff.id} className="hover:bg-slate-50/50 transition">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {staff.avatar ? (
                      <img src={staff.avatar} alt="avatar" className="w-10 h-10 rounded-full object-cover border border-gray-200" />
                    ) : (
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${staff.bgColor}`}>
                        {staff.initials}
                      </div>
                    )}
                    <div>
                      <p className="font-bold text-[#0f172a]">{staff.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{staff.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 font-medium text-gray-700">{staff.dept}</td>
                
                <td className="px-6 py-4 relative">
                  <div 
                    onClick={() => setOpenRoleMenu(openRoleMenu === staff.id ? null : staff.id)}
                    className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold cursor-pointer hover:bg-indigo-100 transition"
                  >
                    {staff.role} <span>✎</span>
                  </div>

                  {openRoleMenu === staff.id && (
                    <div className="absolute top-12 left-6 bg-white border border-gray-100 shadow-xl rounded-xl w-48 py-2 z-50">
                      <p className="text-[10px] font-bold text-gray-400 uppercase px-4 mb-1">CHỌN VAI TRÒ</p>
                      {roles.map(r => (
                        <div 
                          key={r} 
                          onClick={() => handleRoleChange(staff.id, r)}
                          className={`px-4 py-2 text-sm font-medium cursor-pointer flex justify-between items-center hover:bg-slate-50 ${staff.role === r ? 'bg-indigo-50 text-[#1e3a8a]' : 'text-gray-700'}`}
                        >
                          {r} {staff.role === r && <span className="text-[#1e3a8a]">✓</span>}
                        </div>
                      ))}
                    </div>
                  )}
                </td>

                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${staff.status === 'Hoạt động' ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                    <span className="font-medium text-gray-700 text-xs">{staff.status}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-500 text-xs font-medium">{staff.lastLogin}</td>
                <td className="px-6 py-4 text-center">
                  <button className="text-gray-400 hover:text-[#1e3a8a] text-lg px-2 rounded hover:bg-gray-100">⋮</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* Phân trang */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between text-xs font-medium text-gray-500">
          <span>Hiển thị 1-10 trên 45 nhân viên</span>
          <div className="flex gap-1">
            <button className="w-8 h-8 flex justify-center items-center rounded border border-gray-200 hover:bg-gray-50">&lt;</button>
            <button className="w-8 h-8 flex justify-center items-center rounded bg-[#1e3a8a] text-white">1</button>
            <button className="w-8 h-8 flex justify-center items-center rounded border border-gray-200 hover:bg-gray-50">2</button>
            <button className="w-8 h-8 flex justify-center items-center rounded border border-gray-200 hover:bg-gray-50">3</button>
            <button className="w-8 h-8 flex justify-center items-center rounded border border-gray-200 hover:bg-gray-50">&gt;</button>
          </div>
        </div>
      </div>

      {/* Thẻ Thống Kê Dưới Cùng */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#1e3a8a] text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-xs font-bold uppercase tracking-wider opacity-80 mb-2">TỔNG NHÂN SỰ</p>
            <h2 className="text-5xl font-bold mb-3">{staffList.length}</h2>
            <p className="text-xs font-medium opacity-90 flex items-center gap-1">
              <span>↗</span> +4 nhân viên trong tháng này
            </p>
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-10 flex">
            <span className="text-8xl">👤</span>
            <span className="text-6xl -ml-6 mt-4">👤</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-5">
          <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 text-2xl">
            🛡️
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">YÊU CẦU QUYỀN</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-[#0f172a]">08</span>
              <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded">Cần phê duyệt ngay</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-5">
          <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-[#1e3a8a] text-2xl">
            🕒
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">NHẬT KÝ HỆ THỐNG</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-[#0f172a]">1.2k</span>
              <span className="text-xs font-medium text-gray-500">Hoạt động trong 24h qua</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffManagement;