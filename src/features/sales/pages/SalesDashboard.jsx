import React from 'react';

const SalesDashboard = () => {
  const stats = [
    { title: 'Doanh thu cá nhân', value: '145.200.000 ₫', change: '+8.5%', isUp: true, icon: 'account_balance_wallet' },
    { title: 'Báo giá thành công', value: '28', change: '+12%', isUp: true, icon: 'request_quote' },
    { title: 'Đơn hàng mới', value: '15', change: '-5%', isUp: false, icon: 'shopping_cart' },
    { title: 'Khách hàng tiềm năng', value: '104', change: '+2', isUp: true, icon: 'person_add' },
  ];

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

      {/* Content - Cuộn nội bộ */}
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 pr-1 md:pr-2 pb-4">
        <div className="flex flex-col gap-6 h-full">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 shrink-0">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                    <h3 className="text-2xl font-bold text-slate-900 mt-2">{stat.value}</h3>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                    <span className="material-symbols-outlined">{stat.icon}</span>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-1">
                  <span className={`material-symbols-outlined text-sm ${stat.isUp ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {stat.isUp ? 'trending_up' : 'trending_down'}
                  </span>
                  <span className={`text-xs font-medium ${stat.isUp ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {stat.change}
                  </span>
                  <span className="text-xs text-slate-400 ml-1">so với tháng trước</span>
                </div>
              </div>
            ))}
          </div>

          {/* Main Content Area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-[400px]">
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col">
              <div className="flex justify-between items-center mb-4 shrink-0">
                <h2 className="text-lg font-bold text-slate-900">Báo giá & Đơn hàng gần đây</h2>
                <button className="text-sm font-medium text-[#00288E] hover:underline">Xem tất cả</button>
              </div>
              <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 border border-gray-100 rounded-lg">
                <table className="w-full text-left border-collapse relative">
                  <thead className="sticky top-0 bg-slate-50 z-10">
                    <tr className="border-b border-gray-200 text-xs uppercase tracking-wider text-slate-500">
                      <th className="px-4 py-3 font-semibold">Mã đơn</th>
                      <th className="px-4 py-3 font-semibold">Khách hàng</th>
                      <th className="px-4 py-3 font-semibold">Ngày tạo</th>
                      <th className="px-4 py-3 font-semibold text-right">Giá trị</th>
                      <th className="px-4 py-3 font-semibold text-center">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm text-slate-700 divide-y divide-gray-50">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((row) => (
                      <tr key={row} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-4 py-3 font-medium">#ORD-{9000 + row}</td>
                        <td className="px-4 py-3 truncate max-w-[150px]">Công ty TNHH Khách hàng {row}</td>
                        <td className="px-4 py-3">1{row}/05/2026</td>
                        <td className="px-4 py-3 font-medium text-right text-slate-900">12.500.000 ₫</td>
                        <td className="px-4 py-3 text-center">
                          <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-medium border border-emerald-100 whitespace-nowrap">
                            Thành công
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col">
              <h2 className="text-lg font-bold text-slate-900 mb-4 shrink-0">Nhiệm vụ trong tuần</h2>
              <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 pr-2 space-y-3">
                {[
                  { task: 'Gọi điện cho KH Nguyễn Văn A', time: 'Hôm nay, 14:00', done: false },
                  { task: 'Gửi báo giá dự án X', time: 'Ngày mai, 09:00', done: false },
                  { task: 'Họp team Sales định kỳ', time: 'Thứ 6, 15:00', done: false },
                  { task: 'Hoàn thiện hồ sơ thầu KH Y', time: 'Hôm qua', done: true },
                  { task: 'Cập nhật KPI tháng', time: 'Hôm qua', done: true },
                  { task: 'Gặp mặt KH Công ty Z', time: 'Tuần trước', done: true },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 hover:border-blue-100 hover:bg-blue-50/30 transition-colors cursor-pointer group">
                    <div className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center border shrink-0 ${item.done ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-gray-300 text-transparent group-hover:border-blue-400'}`}>
                      <span className="material-symbols-outlined text-[14px]">check</span>
                    </div>
                    <div className="min-w-0">
                      <p className={`text-sm font-medium truncate ${item.done ? 'text-slate-400 line-through' : 'text-slate-800'}`}>{item.task}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesDashboard;
