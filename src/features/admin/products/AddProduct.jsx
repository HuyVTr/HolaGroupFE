import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

const AddProduct = () => {
  const navigate = useNavigate();

  return (
    <div className="font-inter flex flex-col w-full h-full bg-slate-50 animate-fade-in gap-4 md:gap-6">
      
      {/* Header */}
      <div className="flex justify-between items-start shrink-0 px-2 md:px-0">
        <div>
          <h1 className="text-3xl sm:text-4xl lg:text-[2rem] font-black text-slate-900 uppercase tracking-tight leading-tight">Thêm sản phẩm mới</h1>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={() => navigate('/admin/products')}
            className="px-5 py-2.5 rounded-lg font-semibold text-sm border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm"
          >
            Hủy bỏ
          </button>
          <button className="bg-[#00288E] hover:bg-[#00288E]/90 text-white px-5 py-2.5 rounded-lg font-semibold text-sm shadow-sm transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined text-xl">save</span> Lưu sản phẩm
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 pr-1 md:pr-2 pb-4">
        <div className="flex flex-col xl:flex-row gap-6 mx-2 md:mx-0">
          
          {/* CỘT TRÁI (Rộng hơn - Chiếm 2 phần) */}
          <div className="xl:flex-[2] flex flex-col gap-6">
          
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
        <div className="xl:flex-[1] flex flex-col gap-6">
          
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
    </div>
  </div>
  );
};

export default AddProduct;