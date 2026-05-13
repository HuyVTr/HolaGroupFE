import React, { useState } from 'react';
import CreateOrder from './CreateOrder'; // Nhớ import file CreateOrder vào nhé

const OrderManagement = () => {
  // Dữ liệu mẫu dựa trên thiết kế Figma của bạn
  const [orders] = useState([
    { id: '#ORD-9421', customer: 'Nguyễn Thành Trung', phone: '0902 *** 456', avatar: 'NT', date: '24/05/2024 14:30', total: '12,450,000 đ', status: 'CHỜ XÁC NHẬN' },
    { id: '#ORD-9420', customer: 'Lê Hồng Hạnh', phone: '0981 *** 122', avatar: 'LH', date: '24/05/2024 10:15', total: '3,200,000 đ', status: 'ĐANG GIAO' },
    { id: '#ORD-9419', customer: 'Phạm Quốc Anh', phone: '0914 *** 888', avatar: 'PQ', date: '23/05/2024 18:45', total: '5,800,000 đ', status: 'HOÀN THÀNH' },
    { id: '#ORD-9418', customer: 'Đặng Văn Lâm', phone: '0345 *** 789', avatar: 'DV', date: '23/05/2024 16:20', total: '1,150,000 đ', status: 'ĐÃ HỦY' },
  ]);

  const [activeTab, setActiveTab] = useState('Tất cả');
  const tabs = ['Tất cả', 'Chờ xác nhận', 'Đang giao', 'Hoàn thành', 'Đã hủy'];

  // State quản lý việc chuyển đổi màn hình
  const [isCreating, setIsCreating] = useState(false);

  // Hàm helper để render màu sắc trạng thái (Badge)
  const getStatusBadge = (status) => {
    switch (status) {
      case 'CHỜ XÁC NHẬN':
        return <span className="px-3 py-1 bg-orange-100 text-orange-700 text-[10px] font-bold rounded-full">CHỜ XÁC NHẬN</span>;
      case 'ĐANG GIAO':
        return <span className="px-3 py-1 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-full">ĐANG GIAO</span>;
      case 'HOÀN THÀNH':
        return <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-full">HOÀN THÀNH</span>;
      case 'ĐÃ HỦY':
        return <span className="px-3 py-1 bg-red-100 text-red-700 text-[10px] font-bold rounded-full">ĐÃ HỦY</span>;
      default:
        return <span className="px-3 py-1 bg-gray-100 text-gray-700 text-[10px] font-bold rounded-full">{status}</span>;
    }
  };

  // NẾU ĐANG BẤM NÚT TẠO ĐƠN THÌ HIỂN THỊ COMPONENT CREATE ORDER
  if (isCreating) {
    return <CreateOrder onBack={() => setIsCreating(false)} />;
  }

  // NẾU KHÔNG THÌ HIỂN THỊ MÀN HÌNH DANH SÁCH BÌNH THƯỜNG
  return (
    <div className="font-inter flex flex-col w-full h-full bg-slate-50 animate-fade-in gap-4 md:gap-6">
      
      {/* Header */}
      <div className="flex justify-between items-start shrink-0 px-2 md:px-0">
        <div>
          <h1 className="text-3xl sm:text-4xl lg:text-[2rem] font-black text-slate-900 uppercase tracking-tight leading-tight">Quản lý Đơn hàng</h1>
          <p className="text-sm sm:text-base text-slate-600 font-medium mt-1 max-w-lg leading-relaxed">
            Thứ Hai, 24 Tháng 5, 2024
          </p>
        </div>
        
        <div className="flex gap-3">
          <button className="bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-slate-50 flex items-center gap-2 shadow-sm transition-all">
            <span className="material-symbols-outlined text-xl">download</span> Xuất Excel
          </button>
          
          <button 
            onClick={() => setIsCreating(true)}
            className="bg-[#00288E] hover:bg-[#00288E]/90 text-white px-5 py-2.5 rounded-lg font-semibold text-sm shadow-sm transition-colors flex items-center gap-2 whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-xl">add_circle</span> Tạo đơn mới
          </button>
        </div>
      </div>

      {/* Content - Cuộn nội bộ */}
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 pr-1 md:pr-2 pb-4">
        <div className="flex flex-col gap-4 mx-2 md:mx-0">

      {/* 4 Cards Thống kê */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-xs font-semibold tracking-wider mb-2">TỔNG ĐƠN HÀNG</p>
          <div className="flex items-end gap-3">
            <span className="text-3xl font-bold text-[#00288E] font-manrope">1,284</span>
            <span className="text-emerald-600 bg-emerald-50 px-2 py-1 rounded text-xs font-medium mb-1">+12.5%</span>
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-xs font-semibold tracking-wider mb-2">CHỜ XÁC NHẬN</p>
          <div className="flex items-end gap-3">
            <span className="text-3xl font-bold text-orange-700 font-manrope">42</span>
            <span className="text-orange-700 bg-orange-50 px-2 py-1 rounded text-xs font-medium mb-1">Cần xử lý</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-xs font-semibold tracking-wider mb-2">ĐANG GIAO</p>
          <div className="flex items-end gap-3">
            <span className="text-3xl font-bold text-blue-600 font-manrope">156</span>
            <span className="text-blue-600 bg-blue-50 px-2 py-1 rounded text-xs font-medium mb-1">Trên đường</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-xs font-semibold tracking-wider mb-2">DOANH THU NGÀY</p>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-slate-800 font-manrope">42.5M</span>
            <span className="text-slate-500 text-sm font-medium mb-1">VNĐ</span>
          </div>
        </div>
      </div>

      {/* Box Bảng dữ liệu chính */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col overflow-hidden">
        
        {/* Toolbar & Tabs */}
        <div className="p-4 border-b border-slate-100 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-slate-50/50">
          {/* Tabs Filter */}
          <div className="flex gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 scrollbar-hide">
            {tabs.map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-all ${
                  activeTab === tab 
                    ? 'bg-[#00288E] text-white font-medium shadow-sm' 
                    : 'bg-slate-200/50 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex gap-3 w-full lg:w-auto">
            <div className="relative flex-1 min-w-[250px]">
              <input 
                type="text" 
                placeholder="Tìm kiếm mã đơn, khách hàng..." 
                className="w-full bg-white border border-slate-200 text-sm rounded-lg pl-10 pr-4 py-2 outline-none focus:border-[#00288E] focus:ring-1 focus:ring-[#00288E]"
              />
              <span className="absolute left-3 top-2.5 opacity-40">🔍</span>
            </div>
            <select className="bg-white border border-slate-200 text-sm rounded-lg px-4 py-2 outline-none focus:border-[#00288E] text-slate-600">
              <option>Tháng này</option>
              <option>Tháng trước</option>
              <option>Tuần này</option>
            </select>
          </div>
        </div>

        {/* Table Đơn hàng */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50/80 text-slate-500 text-xs font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 border-b border-slate-100">MÃ ĐƠN</th>
                <th className="px-6 py-4 border-b border-slate-100">KHÁCH HÀNG</th>
                <th className="px-6 py-4 border-b border-slate-100">NGÀY ĐẶT</th>
                <th className="px-6 py-4 border-b border-slate-100">GIÁ TRỊ</th>
                <th className="px-6 py-4 border-b border-slate-100">TRẠNG THÁI</th>
                <th className="px-6 py-4 border-b border-slate-100 text-right">THAO TÁC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map((order, index) => (
                <tr key={index} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4 font-semibold text-[#00288E]">{order.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                        {order.avatar}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800">{order.customer}</div>
                        <div className="text-xs text-slate-500">{order.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{order.date}</td>
                  <td className="px-6 py-4 font-semibold text-slate-800">{order.total}</td>
                  <td className="px-6 py-4">
                    {getStatusBadge(order.status)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-slate-400 hover:text-[#00288E] transition-colors p-2 rounded-lg hover:bg-slate-100">
                      •••
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Phân trang */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
          <div>Hiển thị 1-10 trong số 1,284 đơn hàng</div>
          <div className="flex gap-1">
            <button className="px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50">Trước</button>
            <button className="px-3 py-1.5 bg-[#00288E] text-white rounded-lg shadow-sm">1</button>
            <button className="px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-50">2</button>
            <button className="px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-50">3</button>
            <button className="px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50">Sau</button>
          </div>
        </div>

      </div>
        </div>
      </div>
    </div>
  );
};

export default OrderManagement;