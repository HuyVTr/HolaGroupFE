import React, { useState } from 'react';

const CreateOrder = ({ onBack }) => {
  // 1. STATE QUẢN LÝ GIỎ HÀNG (Sản phẩm đang chọn)
  const [cart, setCart] = useState([
    { id: 1, sku: 'SW8-WH-44', name: 'SmartWatch Series 8 Pro', icon: '⌚', price: 8450000, quantity: 2 },
    { id: 2, sku: 'BTS-PRO-BK', name: 'Beats Studio Pro - Onyx', icon: '🎧', price: 4200000, quantity: 1 }
  ]);

  // 2. HÀM TĂNG / GIẢM SỐ LƯỢNG
  const updateQuantity = (id, delta) => {
    setCart(prevCart => 
      prevCart.map(item => {
        if (item.id === id) {
          // Math.max(1, ...) để đảm bảo số lượng không bị tụt xuống 0 hoặc số âm
          const newQuantity = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  // 3. TỰ ĐỘNG TÍNH TOÁN TIỀN BẠC
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0); // Tổng số lượng SP
  const subTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0); // Tạm tính
  const tax = subTotal * 0.1; // Thuế 10%
  const discount = 1775000; // Giảm giá (đang để fix theo UI)
  const finalTotal = subTotal + tax - discount; // Tổng thanh toán cuối

  return (
    <div className="font-inter flex flex-col w-full h-full bg-slate-50 animate-fade-in gap-4 md:gap-6">
      
      {/* Header Tạo Đơn Mới */}
      <div className="flex justify-between items-start shrink-0 px-2 md:px-0">
        <div>
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition shadow-sm">
              <span className="material-symbols-outlined text-sm">arrow_back</span>
            </button>
            <h1 className="text-3xl sm:text-4xl lg:text-[2rem] font-black text-slate-900 uppercase tracking-tight leading-tight">Tạo Đơn hàng Mới</h1>
          </div>
          <p className="text-sm sm:text-base text-slate-600 font-medium mt-1 max-w-lg leading-relaxed">
            Hệ thống quản lý bán hàng Hola Ledger • Đơn hàng #ORD-2023-0892
          </p>
        </div>
        
        {/* Stepper */}
        <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-100 hidden md:flex mt-4">
          <div className="flex items-center gap-2 bg-[#00288E] text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm">
            <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">1</span> Khách hàng
          </div>
          <div className="flex items-center gap-2 text-slate-400 px-4 py-2 text-sm font-semibold">
            <span className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-xs">2</span> Sản phẩm
          </div>
          <div className="flex items-center gap-2 text-slate-400 px-4 py-2 text-sm font-semibold">
            <span className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-xs">3</span> Thanh toán
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 pr-1 md:pr-2 pb-4">
        <div className="flex flex-col xl:flex-row gap-6 mx-2 md:mx-0">
          {/* CỘT TRÁI */}
          <div className="xl:flex-[2] flex flex-col gap-6">
          
          {/* Thông tin khách hàng */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <div className="mb-5">
              <h3 className="text-lg font-bold text-[#0f172a] flex items-center gap-2">
                <span className="text-[#00288E]">👤</span> Thông tin Khách hàng
              </h3>
            </div>
            
            <div className="mb-4">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">TÌM KIẾM KHÁCH HÀNG</label>
              <div className="relative">
                <input type="text" placeholder="Nhập tên, số điện thoại hoặc mã KH..." className="w-full bg-slate-100 border-none rounded-xl py-3 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-[#00288E]/20" />
                <span className="absolute left-3 top-3 opacity-40">🔍</span>
              </div>
            </div>

            {/* Thông tin khách hàng sau khi tìm kiếm thành công */}
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 mt-2">
              <div className="grid grid-cols-3 gap-4 mb-3">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">HỌ VÀ TÊN</span>
                  <p className="font-bold text-slate-800 mt-1">Nguyễn Văn Thành</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">SỐ ĐIỆN THOẠI</span>
                  <p className="font-bold text-slate-800 mt-1">0982 • 123 • 456</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">HẠNG THÀNH VIÊN</span>
                  <div className="mt-1"><span className="bg-orange-100 text-orange-700 text-[10px] font-bold px-2 py-1 rounded-md">GOLD MEMBER</span></div>
                </div>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">ĐỊA CHỈ GIAO HÀNG</span>
                <p className="text-sm text-slate-600 mt-1">123 Đường Lê Lợi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh</p>
              </div>
            </div>
          </div>

          {/* Danh sách sản phẩm */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h3 className="text-lg font-bold text-[#0f172a] flex items-center gap-2 whitespace-nowrap">
                <span className="text-[#00288E]">🛒</span> Danh sách Sản phẩm
              </h3>
              <div className="flex gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:min-w-[200px]">
                  <input type="text" placeholder="Quét mã vạch..." className="w-full bg-slate-100 border-none rounded-lg py-2 pl-10 pr-4 text-sm outline-none" />
                  <span className="absolute left-3 top-2 opacity-40">📱</span>
                </div>
                <button className="bg-[#00288E] text-white px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap">
                  + Thêm sản phẩm
                </button>
              </div>
            </div>
            
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase">
                <tr>
                  <th className="py-3 px-2 rounded-l-lg">SẢN PHẨM</th>
                  <th className="py-3 px-2 text-center">ĐƠN GIÁ</th>
                  <th className="py-3 px-2 text-center">SỐ LƯỢNG</th>
                  <th className="py-3 px-2 text-right rounded-r-lg">THÀNH TIỀN</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {cart.map((item) => (
                  <tr key={item.id}>
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center text-xl">{item.icon}</div>
                        <div>
                          <p className="font-bold text-slate-800">{item.name}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">SKU: {item.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-2 text-center font-bold text-slate-700">
                      {item.price.toLocaleString()}<br/><span className="text-[10px] text-slate-400 font-normal">VND</span>
                    </td>
                    <td className="py-4 px-2">
                      <div className="flex items-center justify-center gap-3">
                        {/* NÚT TRỪ */}
                        <button 
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-7 h-7 flex items-center justify-center bg-slate-100 rounded-md hover:bg-slate-200 font-bold text-slate-600 transition"
                        >
                          -
                        </button>
                        
                        {/* SỐ LƯỢNG */}
                        <span className="font-bold text-slate-800 w-5 text-center">
                          {item.quantity < 10 ? `0${item.quantity}` : item.quantity}
                        </span>

                        {/* NÚT CỘNG */}
                        <button 
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-7 h-7 flex items-center justify-center bg-[#00288E] text-white rounded-md hover:bg-blue-800 font-bold transition"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="py-4 px-2 text-right font-bold text-[#00288E]">
                      {(item.price * item.quantity).toLocaleString()}<br/><span className="text-[10px] text-[#00288E]/60 font-normal">VND</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* CỘT PHẢI - THANH TOÁN (DATA ĐỘNG) */}
        <div className="xl:flex-[1] flex flex-col gap-6">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden sticky top-0">
            
            {/* TỔNG THANH TOÁN */}
            <div className="bg-[#00288E] p-6 text-white">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium opacity-90 block mb-2">Tổng thanh toán</span>
                <span className="opacity-80">💵</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold">{finalTotal.toLocaleString()}</span> 
                <span className="text-sm opacity-80">VND</span>
              </div>
            </div>
            
            <div className="p-6 flex flex-col gap-5">
              
              {/* TẠM TÍNH */}
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-medium">Tạm tính ({totalItems} SP)</span>
                <span className="font-bold text-slate-800">{subTotal.toLocaleString()} VND</span>
              </div>

              {/* MÃ GIẢM GIÁ */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">MÃ GIẢM GIÁ / CHIẾT KHẤU</label>
                <div className="flex gap-2">
                  <input type="text" placeholder="Nhập mã..." className="flex-1 bg-slate-100 border-none rounded-lg py-2.5 px-3 text-sm outline-none" />
                  <button className="bg-slate-100 text-slate-400 px-3 rounded-lg hover:bg-slate-200">🎫</button>
                </div>
              </div>

              {/* THUẾ */}
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-medium">Thuế GTGT (10%)</span>
                <span className="font-bold text-slate-800">{tax.toLocaleString()} VND</span>
              </div>

              {/* CHIẾT KHẤU */}
              <div className="bg-orange-100 rounded-xl p-4 flex justify-between items-center">
                <span className="text-orange-800 text-sm font-bold w-1/2">CHIẾT KHẤU THÀNH VIÊN</span>
                <span className="text-orange-800 font-bold text-right">- {discount.toLocaleString()}<br/><span className="text-xs font-normal">VND</span></span>
              </div>

              {/* GHI CHÚ */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">GHI CHÚ ĐƠN HÀNG</label>
                <textarea rows="3" placeholder="Yêu cầu đặc biệt, lưu ý giao hàng..." className="w-full bg-slate-100 border-none rounded-xl p-3 text-sm outline-none resize-none"></textarea>
              </div>

              {/* NÚT SUBMIT */}
              <div className="flex flex-col gap-3 mt-2">
                <button className="w-full bg-[#00288E] hover:bg-blue-800 text-white py-3.5 rounded-xl font-bold flex justify-center items-center gap-2 transition shadow-md shadow-blue-900/20">
                  <span className="w-5 h-5 border-2 border-white rounded-full flex justify-center items-center text-xs">✓</span> XÁC NHẬN ĐƠN HÀNG
                </button>
                <button onClick={onBack} className="w-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 py-3.5 rounded-xl font-bold transition">
                  LƯU BẢN NHÁP
                </button>
              </div>
              
              <div className="text-center mt-2">
                <span className="text-[10px] text-slate-400">🛡️ Hệ thống bảo mật bởi Hola Global Ledger</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};

export default CreateOrder;