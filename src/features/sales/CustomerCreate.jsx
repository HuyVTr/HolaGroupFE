import React, { useState } from 'react';
// 1. Import thêm useNavigate và Link từ react-router-dom
import { useNavigate, Link } from 'react-router-dom';

const CustomerCreate = () => {
  // 2. Khởi tạo hàm chuyển hướng
  const navigate = useNavigate();

  // State quản lý UI form
  const [customerType, setCustomerType] = useState('Cá nhân');
  const [membership, setMembership] = useState('VIP');

  // Hàm xử lý khi bấm Lưu
  const handleSave = () => {
    // Trong thực tế, bạn sẽ gọi API ở đây (ví dụ: axios.post(...))
    alert("Đã thêm khách hàng mới thành công!");
    
    // Sau khi lưu xong thì tự động quay về trang danh sách
    navigate('/home/customers');
  };

  return (
    <div className="w-full font-sans text-[#191c1e] bg-[#f8fafc] min-h-screen pb-10">
      
      {/* 1. Header & Breadcrumb */}
      <div className="flex justify-between items-end mb-8 pt-4">
        <div>
          <div className="text-[10px] font-bold text-gray-400 tracking-wider mb-2 uppercase flex gap-2">
            <span>DANH MỤC</span> 
            <span>›</span> 
            {/* Sử dụng Link để có thể click quay lại */}
            <Link to="/home/customers" className="hover:text-[#00288E] transition-colors">KHÁCH HÀNG</Link>
            <span>›</span> 
            <span className="text-[#00288E]">THÊM MỚI</span>
          </div>
          <h1 className="text-3xl font-manrope font-bold text-[#00288E]">Thêm mới khách hàng</h1>
        </div>
        <div className="flex gap-3">
          {/* 3. Gắn sự kiện navigate vào nút Hủy bỏ */}
          <button 
            onClick={() => navigate('/home/customers')}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2.5 rounded-xl text-sm font-bold transition-colors"
          >
            Hủy bỏ
          </button>
          {/* Gắn sự kiện handleSave vào nút Lưu thông tin */}
          <button 
            onClick={handleSave}
            className="bg-[#00288E] hover:bg-[#1e40af] text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-md transition-colors"
          >
            Lưu thông tin
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* CỘT TRÁI (Nội dung chính) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Box Thông tin định danh */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-[#0f172a] flex items-center gap-2 mb-6">
              <span className="text-[#00288E]">👤</span> Thông tin định danh
            </h3>
            
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">HỌ VÀ TÊN</label>
                <input type="text" placeholder="Nhập họ và tên đầy đủ" className="w-full bg-gray-100 border-none rounded-xl p-3.5 text-sm outline-none focus:ring-2 focus:ring-[#00288E]/20 text-gray-700" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">SỐ ĐIỆN THOẠI</label>
                <input type="text" placeholder="090 123 4567" className="w-full bg-gray-100 border-none rounded-xl p-3.5 text-sm outline-none focus:ring-2 focus:ring-[#00288E]/20 text-gray-700" />
              </div>
            </div>
            
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">ĐỊA CHỈ EMAIL</label>
              <input type="email" placeholder="example@hola.group" className="w-full bg-gray-100 border-none rounded-xl p-3.5 text-sm outline-none focus:ring-2 focus:ring-[#00288E]/20 text-gray-700" />
            </div>
          </div>

          {/* Box Địa chỉ liên lạc */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-[#0f172a] flex items-center gap-2 mb-6">
              <span className="text-[#00288E]">📍</span> Địa chỉ liên lạc
            </h3>
            
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">ĐỊA CHỈ THƯỜNG TRÚ</label>
              <textarea 
                rows="3" 
                placeholder="Số nhà, tên đường, Phường/Xã, Quận/Huyện..." 
                className="w-full bg-gray-100 border-none rounded-xl p-4 text-sm outline-none focus:ring-2 focus:ring-[#00288E]/20 text-gray-700 resize-none"
              ></textarea>
            </div>

           
          </div>

        </div>

        {/* CỘT PHẢI (Phân loại & Ghi chú) */}
        <div className="col-span-1 flex flex-col gap-6">
          
          {/* Box Phân loại đối tượng */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-[#0f172a] flex items-center gap-2 mb-6">
              <span className="text-[#00288E]">🏷️</span> Phân loại đối tượng
            </h3>

            <div className="mb-6">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 block">LOẠI KHÁCH HÀNG</label>
              <div className="flex bg-gray-100 rounded-xl p-1.5">
                <button 
                  onClick={() => setCustomerType('Cá nhân')}
                  className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${customerType === 'Cá nhân' ? 'bg-white text-[#00288E] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Cá nhân
                </button>
                <button 
                  onClick={() => setCustomerType('Doanh nghiệp')}
                  className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${customerType === 'Doanh nghiệp' ? 'bg-white text-[#00288E] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Doanh nghiệp
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 block">HẠNG THÀNH VIÊN</label>
              <div className="flex flex-col gap-3">
                {/* VIP */}
                <div 
                  onClick={() => setMembership('VIP')}
                  className={`flex items-center justify-between p-4 border rounded-2xl cursor-pointer transition-all ${membership === 'VIP' ? 'border-[#00288E] bg-blue-50/30' : 'border-gray-100 hover:border-gray-300'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${membership === 'VIP' ? 'border-[#00288E]' : 'border-gray-300'}`}>
                      {membership === 'VIP' && <div className="w-2 h-2 bg-[#00288E] rounded-full"></div>}
                    </div>
                    <div>
                      <p className="font-bold text-[#0f172a] text-sm">VIP Member</p>
                      <p className="text-[10px] text-gray-400 mt-0.5 uppercase tracking-wide">ƯU TIÊN PHỤC VỤ HẠNG A</p>
                    </div>
                  </div>
                  <span className="text-orange-500 text-lg">🥇</span>
                </div>

                {/* GOLD */}
                <div 
                  onClick={() => setMembership('GOLD')}
                  className={`flex items-center justify-between p-4 border rounded-2xl cursor-pointer transition-all ${membership === 'GOLD' ? 'border-[#00288E] bg-blue-50/30' : 'border-gray-100 hover:border-gray-300'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${membership === 'GOLD' ? 'border-[#00288E]' : 'border-gray-300'}`}>
                      {membership === 'GOLD' && <div className="w-2 h-2 bg-[#00288E] rounded-full"></div>}
                    </div>
                    <div>
                      <p className="font-bold text-[#0f172a] text-sm">Gold Member</p>
                      <p className="text-[10px] text-gray-400 mt-0.5 uppercase tracking-wide">KHÁCH HÀNG THÂN THIẾT</p>
                    </div>
                  </div>
                </div>

                {/* SILVER */}
                <div 
                  onClick={() => setMembership('SILVER')}
                  className={`flex items-center justify-between p-4 border rounded-2xl cursor-pointer transition-all ${membership === 'SILVER' ? 'border-[#00288E] bg-blue-50/30' : 'border-gray-100 hover:border-gray-300'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${membership === 'SILVER' ? 'border-[#00288E]' : 'border-gray-300'}`}>
                      {membership === 'SILVER' && <div className="w-2 h-2 bg-[#00288E] rounded-full"></div>}
                    </div>
                    <div>
                      <p className="font-bold text-[#0f172a] text-sm">Silver Member</p>
                      <p className="text-[10px] text-gray-400 mt-0.5 uppercase tracking-wide">KHÁCH HÀNG MỚI/PHỔ THÔNG</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Box Ghi chú */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-[#0f172a] flex items-center gap-2 mb-6">
              <span className="text-[#00288E]">📝</span> Ghi chú nội bộ
            </h3>
            <textarea 
              rows="4" 
              placeholder="Nhập ghi chú hoặc yêu cầu đặc biệt từ khách hàng..." 
              className="w-full bg-gray-100 border-none rounded-xl p-4 text-sm outline-none focus:ring-2 focus:ring-[#00288E]/20 text-gray-700 resize-none mb-2"
            ></textarea>
            <div className="flex justify-between text-[10px] text-gray-400 font-medium">
              <span>Tối đa 500 ký tự</span>
              <span>Đã nhập: 0</span>
            </div>
          </div>

        </div>
      </div>

      {/* Footer Badges */}
    

    </div>
  );
};

export default CustomerCreate;