import React, { useState, useEffect } from 'react';
import salesService from '../../services/salesService';

const SalesDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: '0 VND',
    orderCount: 0,
    customerCount: 0,
    activeQuotes: 0
  });
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [dashboardStats, ordersList] = await Promise.all([
          salesService.getDashboardStats(),
          salesService.getOrders()
        ]);
        setStats(dashboardStats);
        setOrders(ordersList.slice(0, 10)); // Chỉ lấy 10 đơn hàng gần nhất
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu dashboard:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const dashboardStats = [
    { title: 'Doanh thu tổng', value: stats.totalRevenue, change: '+8.5%', isUp: true, icon: 'account_balance_wallet' },
    { title: 'Báo giá thành công', value: stats.activeQuotes, change: '+12%', isUp: true, icon: 'request_quote' },
    { title: 'Đơn hàng mới', value: stats.orderCount.toString(), change: '-5%', isUp: false, icon: 'shopping_cart' },
    { title: 'Khách hàng', value: stats.customerCount.toString(), change: '+2', isUp: true, icon: 'person_add' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00288E]"></div>
      </div>
    );
  }

  return (
    <div className="font-inter flex flex-col w-full h-full bg-slate-50 animate-fade-in gap-4 md:gap-6">
      {/* Header - Cố định */}
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-3xl sm:text-4xl lg:text-[2rem] font-black text-slate-900 uppercase tracking-tight leading-tight">Bảng điều khiển Kinh doanh</h1>
          <p className="text-sm sm:text-base text-slate-600 font-medium mt-1">Theo dõi hiệu suất bán hàng và KPIs cá nhân.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-[#00288E] text-white rounded-lg hover:bg-[#00288E]/90 transition-colors shadow-sm text-sm font-medium">
            <span className="material-symbols-outlined text-lg">add</span>
            Tạo Báo giá mới
          </button>
        </div>
      </div>

      {/* Content - Phân bổ không gian */}
      <div className="flex-1 flex flex-col min-h-0 gap-6 pb-6 pt-2">
        
        {/* Stats Grid - Cố định độ cao */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 shrink-0 px-2 md:px-0">
          {dashboardStats.map((stat, idx) => (
            <div key={idx} className="bg-white rounded-xl p-4 shadow-sm border border-slate-300 hover:border-blue-500 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer">
              <div className="flex justify-between items-start">
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{stat.title}</p>
                  <h3 className="text-lg font-black text-slate-900 mt-1 truncate" title={stat.value}>{stat.value}</h3>
                </div>
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                  <span className="material-symbols-outlined text-xl">{stat.icon}</span>
                </div>
              </div>
              <div className="mt-2 flex items-center gap-1">
                <span className={`material-symbols-outlined text-[14px] ${stat.isUp ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {stat.isUp ? 'trending_up' : 'trending_down'}
                </span>
                <span className={`text-[10px] font-bold ${stat.isUp ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {stat.change}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Main Grid - Tự động giãn nở */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0 px-2 md:px-0 pb-2">
          
          {/* Table Area - Co giãn và Scroll nội bộ */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-300 flex flex-col min-h-0 overflow-hidden hover:border-blue-500 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center shrink-0">
              <h2 className="text-base font-black text-slate-900 uppercase tracking-tight">Báo giá & Đơn hàng gần đây</h2>
              <button className="text-xs font-bold text-[#00288E] hover:underline uppercase tracking-wider">Xem tất cả</button>
            </div>
            
            {/* Table Wrapper - Chỉ cuộn ở đây */}
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200">
              <table className="w-full text-left border-collapse relative">
                <thead className="sticky top-0 bg-slate-50 z-10">
                  <tr className="border-b border-gray-200 text-[10px] uppercase tracking-widest text-slate-500 font-bold">
                    <th className="px-6 py-3 text-left">Mã đơn</th>
                    <th className="px-6 py-3 text-left">Khách hàng</th>
                    <th className="px-6 py-3 text-center">Ngày tạo</th>
                    <th className="px-6 py-3 text-left">Giá trị</th>
                    <th className="px-6 py-3 text-center">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-slate-700 divide-y divide-gray-50">
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-4 py-20 text-center text-slate-400 italic font-medium">
                        <span className="material-symbols-outlined text-4xl block mb-2 opacity-30">inventory_2</span>
                        Không có dữ liệu đơn hàng
                      </td>
                    </tr>
                  ) : orders.map((order) => (
                    <tr key={order.orderID} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-3.5 font-bold text-[#00288E] text-left">{order.displayID}</td>
                      <td className="px-6 py-3.5 text-left">
                        <div className="font-semibold text-slate-900 truncate max-w-[200px]">{order.customerName}</div>
                      </td>
                      <td className="px-6 py-3.5 text-center text-slate-500 text-xs font-medium">{order.date}</td>
                      <td className="px-6 py-3.5 font-black text-left text-slate-900 whitespace-nowrap">
                        {new Intl.NumberFormat('vi-VN').format(order.totalAmount)} ₫
                      </td>
                      <td className="px-6 py-3.5 text-center">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold border whitespace-nowrap uppercase tracking-tighter ${
                          order.orderStatus === 'DELIVERED' 
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                          : 'bg-blue-50 text-blue-600 border-blue-100'
                        }`}>
                          {order.orderStatus === 'DELIVERED' ? 'Thành công' : 'Đang xử lý'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sidebar Area - Nhiệm vụ */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-300 flex flex-col min-h-0 overflow-hidden hover:border-blue-500 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="p-4 border-b border-slate-100 shrink-0">
              <h2 className="text-base font-black text-slate-900 uppercase tracking-tight">Nhiệm vụ trong tuần</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-slate-200">
              {[
                { task: 'Gọi điện cho KH Nguyễn Văn A', time: 'Hôm nay, 14:00', done: false },
                { task: 'Gửi báo giá dự án X', time: 'Ngày mai, 09:00', done: false },
                { task: 'Họp team Sales định kỳ', time: 'Thứ 6, 15:00', done: false },
                { task: 'Hoàn thiện hồ sơ thầu KH Y', time: 'Hôm qua', done: true },
                { task: 'Cập nhật KPI tháng', time: 'Hôm qua', done: true },
                { task: 'Gặp mặt KH Công ty Z', time: 'Tuần trước', done: true },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all cursor-pointer group">
                  <div className={`mt-0.5 w-5 h-5 rounded-lg flex items-center justify-center border shrink-0 transition-colors ${item.done ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 bg-white group-hover:border-blue-400'}`}>
                    <span className="material-symbols-outlined text-[14px] font-bold">check</span>
                  </div>
                  <div className="min-w-0">
                    <p className={`text-sm font-bold truncate ${item.done ? 'text-slate-400 line-through' : 'text-slate-800'}`}>{item.task}</p>
                    <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesDashboard;
