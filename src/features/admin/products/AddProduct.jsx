import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

const AddProduct = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col relative min-h-full">
      {/* Breadcrumb & Tiêu đề */}
      <div className="mb-6">
        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex gap-2">
          <Link to="/home/products" className="hover:text-[#00288E] transition-colors">Kho hàng</Link>
          <span>›</span>
          <Link to="/home/products" className="hover:text-[#00288E] transition-colors">Sản phẩm</Link>
          <span>›</span>
          <span className="text-[#00288E]">Thêm mới</span>
        </div>
        <h1 className="text-3xl font-bold text-[#1e3a8a] font-manrope">Thêm sản phẩm mới</h1>
      </div>

      {/* Nội dung form chia 2 cột */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-24">
        
        {/* CỘT TRÁI (Rộng hơn - Chiếm 2 phần) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Box 1: Thông tin cơ bản */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
              <span className="text-[#00288E]">✎</span> Thông tin cơ bản
            </h3>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">Tên sản phẩm</label>
                <input type="text" placeholder="Nhập tên sản phẩm..." className="w-full bg-slate-100/50 border border-slate-200 p-3 rounded-lg text-sm outline-none focus:border-[#00288E] focus:bg-white transition-all" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">Mã SKU</label>
                <input type="text" placeholder="Ví dụ: SKU-2023-001" className="w-full bg-slate-100/50 border border-slate-200 p-3 rounded-lg text-sm outline-none focus:border-[#00288E] focus:bg-white transition-all" />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">Danh mục</label>
              <select className="w-full bg-slate-100/50 border border-slate-200 p-3 rounded-lg text-sm outline-none focus:border-[#00288E] focus:bg-white transition-all text-slate-600 appearance-none">
                <option value="">Chọn danh mục sản phẩm</option>
                <option value="1">Hàng xa xỉ</option>
                <option value="2">Công nghệ doanh nghiệp</option>
                <option value="3">Phần cứng</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">Mô tả sản phẩm</label>
              <textarea rows="4" placeholder="Mô tả chi tiết về tính năng, công dụng..." className="w-full bg-slate-100/50 border border-slate-200 p-3 rounded-lg text-sm outline-none focus:border-[#00288E] focus:bg-white transition-all resize-none"></textarea>
            </div>
          </div>

          {/* Box 2: Quản lý Giá & Kho */}
        

        </div>

        {/* CỘT PHẢI (Hẹp hơn - Chiếm 1 phần) */}
        <div className="flex flex-col gap-6">
          
          {/* Box 3: Hình ảnh */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span className="text-slate-500">🖼️</span> Hình ảnh sản phẩm
            </h3>
            <div className="border-2 border-dashed border-slate-300 bg-slate-50 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 transition-colors mb-4">
              <span className="text-3xl mb-2 text-slate-400">☁️</span>
              <p className="text-sm font-bold text-slate-700">Tải lên ảnh chính</p>
              <p className="text-xs text-slate-400 mt-1">Hỗ trợ JPG, PNG, WEBP</p>
            </div>
            {/* Thumbnails */}
            <div className="flex gap-2">
              <div className="w-12 h-12 border border-slate-200 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-50 cursor-pointer">+</div>
              <div className="w-12 h-12 border border-slate-200 bg-slate-50 rounded-lg flex items-center justify-center text-xs text-slate-300">img</div>
              <div className="w-12 h-12 border border-slate-200 bg-slate-50 rounded-lg flex items-center justify-center text-xs text-slate-300">img</div>
            </div>
          </div>

          {/* Box 4: Phân loại & Trạng thái */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span className="text-[#00288E]">🗂️</span> Phân loại & Trạng thái
            </h3>
            <div className="mb-6">
              <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">Đơn vị tính</label>
              <select className="w-full bg-slate-100/50 border border-slate-200 p-3 rounded-lg text-sm outline-none focus:border-[#00288E] transition-all text-slate-600 appearance-none">
                <option>Cái</option>
                <option>Hộp</option>
                <option>Bộ</option>
              </select>
            </div>
            
            <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div>
                <p className="text-sm font-bold text-slate-800">Trạng thái kinh doanh</p>
                <p className="text-xs text-slate-500 mt-0.5">Sản phẩm hiện có bán không?</p>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="w-1.5 h-1.5 bg-[#00288E] rounded-full"></span>
                  <span className="text-[10px] font-bold text-[#00288E] uppercase tracking-wider">Đang kinh doanh</span>
                </div>
              </div>
              {/* Toggle Switch */}
              <div className="w-11 h-6 bg-[#00288E] rounded-full relative cursor-pointer shadow-inner">
                <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5 shadow-sm"></div>
              </div>
            </div>
          </div>

         

        </div>
      </div>

      {/* Thanh công cụ nổi ở đáy (Sticky Bottom Bar) */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-slate-200 flex justify-end items-center gap-4 rounded-b-2xl z-10">
        <button 
          onClick={() => navigate('/home/products')}
          className="text-sm font-bold text-slate-500 hover:text-slate-800 px-4 py-2 transition-colors"
        >
          Hủy bỏ
        </button>
        <button className="bg-[#00288E] hover:bg-[#1e40af] text-white px-6 py-2.5 rounded-lg text-sm font-bold shadow-md transition-all flex items-center gap-2">
          <span>💾</span> Lưu sản phẩm
        </button>
      </div>

    </div>
  );
};

export default AddProduct;