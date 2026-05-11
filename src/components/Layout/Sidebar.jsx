import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  // State để quản lý việc ẩn/hiện menu con (Product/Category và User Management)
  const [isCatalogOpen, setIsCatalogOpen] = useState(
    location.pathname.startsWith('/home/products') || 
    location.pathname.startsWith('/home/categories')
  );

  const [isUserOpen, setIsUserOpen] = useState(
    location.pathname.startsWith('/home/staffs') || 
    location.pathname.startsWith('/home/customers')
  );

  return (
    <aside className="w-64 bg-[#00288E] text-white flex flex-col h-screen shrink-0 transition-all duration-300">
      {/* Logo Area */}
      <div className="h-16 flex items-center justify-center border-b border-white/10 font-manrope font-bold text-2xl tracking-wider">
        HOLA GROUP
      </div>
      
      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
        <Link 
          to="/home" 
          className={`block px-4 py-3 rounded-lg font-medium transition-colors ${
            location.pathname === '/home' ? 'bg-white/15 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'
          }`}
        >
          📊 Bảng điều khiển
        </Link>

        {/* NHÓM NGƯỜI DÙNG (USER MANAGEMENT) */}
        <div>
          <button 
            onClick={() => setIsUserOpen(!isUserOpen)}
            className={`w-full flex justify-between items-center px-4 py-3 rounded-lg font-medium transition-colors text-left ${
              location.pathname.startsWith('/home/staff') || location.pathname.startsWith('/home/customers')
                ? 'bg-white/15 text-white' 
                : 'text-white/70 hover:bg-white/10 hover:text-white'
            }`}
          >
            <span className="flex items-center gap-2">👥 Người dùng (Users)</span>
            <span className={`text-xs transition-transform duration-200 ${isUserOpen ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </button>

          {/* Các mục con: Nhân sự & Khách hàng */}
          {isUserOpen && (
            <div className="pl-4 mt-1 space-y-1 border-l border-white/10 ml-6">
              <Link 
                to="/home/staffs" 
                className={`block px-4 py-2 text-sm rounded-lg transition-colors ${
                  location.pathname.startsWith('/home/staff') 
                    ? 'bg-white/10 text-white font-semibold' 
                    : 'text-white/60 hover:text-white'
                }`}
              >
                👤 Nhân sự
              </Link>
              <Link 
                to="/home/customers" 
                className={`block px-4 py-2 text-sm rounded-lg transition-colors ${
                  location.pathname.startsWith('/home/customers') 
                    ? 'bg-white/10 text-white font-semibold' 
                    : 'text-white/60 hover:text-white'
                }`}
              >
                💼 Khách hàng
              </Link>
            </div>
          )}
        </div>

        {/* NHÓM DANH MỤC & SẢN PHẨM */}
        <div>
          <button 
            onClick={() => setIsCatalogOpen(!isCatalogOpen)}
            className={`w-full flex justify-between items-center px-4 py-3 rounded-lg font-medium transition-colors text-left ${
              location.pathname.startsWith('/home/products') || location.pathname.startsWith('/home/categories')
                ? 'bg-white/15 text-white' 
                : 'text-white/70 hover:bg-white/10 hover:text-white'
            }`}
          >
            <span className="flex items-center gap-2">🛒 Danh mục & Sản phẩm</span>
            <span className={`text-xs transition-transform duration-200 ${isCatalogOpen ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </button>

          {isCatalogOpen && (
            <div className="pl-4 mt-1 space-y-1 border-l border-white/10 ml-6">
              <Link 
                to="/home/products" 
                className={`block px-4 py-2 text-sm rounded-lg transition-colors ${
                  location.pathname.startsWith('/home/products') 
                    ? 'bg-white/10 text-white font-semibold' 
                    : 'text-white/60 hover:text-white'
                }`}
              >
                📦 Quản lý Sản phẩm
              </Link>
              <Link 
                to="/home/categories" 
                className={`block px-4 py-2 text-sm rounded-lg transition-colors ${
                  location.pathname.startsWith('/home/categories') 
                    ? 'bg-white/10 text-white font-semibold' 
                    : 'text-white/60 hover:text-white'
                }`}
              >
                🏷️ Quản lý Danh mục
              </Link>
            </div>
          )}
        </div>

        <Link to="/home/orders"
          className={`block px-4 py-3 rounded-lg font-medium transition-colors ${
            location.pathname.startsWith('/home/order') ? 'bg-white/15 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'
          }`}
        >
          🛡️ Order
        </Link>
        <Link to="/home/prices"
          className={`block px-4 py-3 rounded-lg font-medium transition-colors ${
            location.pathname.startsWith('/home/prices') ? 'bg-white/15 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'
          }`}
        >
          🛡️ prices
        </Link>

        <Link to="#" className="block px-4 py-3 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-colors">
          📦 Warehouse
        </Link>

        <Link 
          to="/accounting" 
          className={`block px-4 py-3 rounded-lg font-medium transition-colors ${
            location.pathname.startsWith('/accounting') ? 'bg-white/15 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'
          }`}
        >
          💰 Accounting
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;