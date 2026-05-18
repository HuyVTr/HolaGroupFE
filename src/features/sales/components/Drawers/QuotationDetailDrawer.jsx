import React, { useState, useEffect, useMemo } from 'react';
import { 
  Drawer, 
  Box, 
  Typography, 
  IconButton, 
  Avatar, 
  Tabs, 
  Tab,
  Divider,
} from '@mui/material';
import { 
  Close as CloseIcon, 
  History as HistoryIcon,
  Receipt as ReceiptIcon,
  Person as PersonIcon,
  Payments as PaymentsIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const ActivityItem = ({ title, time, user, color = 'bg-slate-400', desc }) => (
  <Box className="relative font-inter">
    <div className={`absolute -left-[20px] top-1.5 w-2.5 h-2.5 rounded-full ${color} border-2 border-white ring-4 ring-slate-50 z-10`}></div>
    <Typography className="text-xs font-black text-slate-800 leading-none mb-1.5 font-inter">
      {title} {desc && <span className={`ml-1 px-1.5 py-0.5 rounded text-[9px] text-white ${color}`}>{desc}</span>}
    </Typography>
    <Box className="flex gap-2 items-center">
      <span className="text-[10px] text-slate-400 font-bold font-inter">{time}</span>
      <div className="w-1 h-1 rounded-full bg-slate-300"></div>
      <Box className="flex items-center gap-1">
        <span className="text-[10px] text-slate-500 font-black uppercase font-inter">{user}</span>
      </Box>
    </Box>
  </Box>
);

const parseDateString = (str) => {
  if (!str) return new Date();
  if (str.includes('T') || str.includes('-')) {
    const d = new Date(str);
    if (!isNaN(d.getTime())) return d;
  }
  const parts = str.split('/');
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    return new Date(year, month, day);
  }
  const parsed = new Date(str);
  return isNaN(parsed.getTime()) ? new Date() : parsed;
};

const formatDate = (dateStr) => {
  if (!dateStr) return '---';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '---';
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

const QuotationDetailDrawer = ({ open, onClose, quotation }) => {
  const [tabValue, setTabValue] = useState(0);
  const navigate = useNavigate();

  const handleConvertToOrder = () => {
    onClose();
    navigate('/sales/orders', { state: { quotation } });
  };

  useEffect(() => {
    if (!open) {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    }
  }, [open]);

  const dynamicActivities = useMemo(() => {
    if (!quotation) return [];
    const list = [];
    const quotationDate = parseDateString(quotation.date);
    const rawStatus = quotation.status || 'DRAFT';

    if (rawStatus === 'DRAFT') {
      list.push({ title: "Khởi tạo báo giá bản nháp", time: formatDate(quotationDate), user: "Hệ thống", color: "bg-slate-400", desc: "Bản nháp" });
    } else if (rawStatus === 'SENT') {
      list.push({ title: "Khởi tạo báo giá", time: formatDate(quotationDate), user: "Hệ thống", color: "bg-blue-500", desc: "Khởi tạo" });
      list.push({ title: "Gửi báo giá tới khách hàng", time: formatDate(quotationDate), user: "Nhân viên kinh doanh", color: "bg-indigo-500", desc: "Đã gửi" });
    } else if (rawStatus === 'APPROVED') {
      list.push({ title: "Khởi tạo báo giá", time: formatDate(quotationDate), user: "Hệ thống", color: "bg-blue-500", desc: "Khởi tạo" });
      list.push({ title: "Gửi báo giá tới khách hàng", time: formatDate(quotationDate), user: "Nhân viên kinh doanh", color: "bg-indigo-500", desc: "Đã gửi" });
      list.push({ title: "Khách hàng đồng ý báo giá", time: formatDate(quotation.approvedDate || quotationDate), user: quotation.name || "Khách hàng", color: "bg-emerald-500", desc: "Phản hồi" });
      list.push({ title: "Đã duyệt báo giá thành công", time: formatDate(quotation.approvedDate || quotationDate), user: "Quản lý kinh doanh", color: "bg-teal-500", desc: "Đã duyệt" });
    } else if (rawStatus === 'CANCELLED') {
      list.push({ title: "Khởi tạo báo giá", time: formatDate(quotationDate), user: "Hệ thống", color: "bg-blue-500", desc: "Khởi tạo" });
      list.push({ title: "Đã hủy báo giá", time: formatDate(quotationDate), user: "Quản lý kinh doanh", color: "bg-rose-500", desc: "Đã hủy" });
    } else {
      list.push({ title: "Khởi tạo báo giá", time: formatDate(quotationDate), user: "Hệ thống", color: "bg-blue-500", desc: "Khởi tạo" });
    }

    return list;
  }, [quotation]);

  if (!quotation) return null;

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const formatCurrency = (val, customColorClass = 'text-[#00288E]') => {
    if (val === undefined || val === null) return "0 VND";
    const num = typeof val === 'number' ? val : Number(val.toString().replace(/[đ₫\sVND.]/g, ''));
    const formatted = new Intl.NumberFormat('vi-VN').format(num);
    return (
      <span className="inline-flex items-baseline gap-0.5 font-inter">
        <span className={`font-black ${customColorClass}`}>{formatted}</span>
        <span className="text-[10px] font-black uppercase tracking-tighter text-slate-400 ml-0.5">VND</span>
      </span>
    );
  };


  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: { 
            width: { xs: '100%', sm: 550 }, 
            borderRadius: { xs: 0, sm: '2.5rem 0 0 2.5rem' }, 
            overflow: 'hidden',
            borderLeft: '1px solid #e2e8f0', 
            boxShadow: '-20px 0 50px rgba(0,0,0,0.05)',
            display: 'flex',
            flexDirection: 'column',
            height: '100%'
          }
        }
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 bg-white border-b border-slate-200 shrink-0 font-inter">
        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
          Chi tiết báo giá
        </h2>
        <IconButton onClick={onClose} className="bg-slate-50 hover:bg-slate-100 transition-all">
          <span className="material-symbols-outlined text-slate-400">close</span>
        </IconButton>
      </div>

      <Box className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 bg-slate-50/30">
        <Box className="p-6 bg-gradient-to-br from-white to-slate-50">
          <Box className="flex items-start gap-5 mb-6">
            <Avatar 
              sx={{ 
                width: 80, 
                height: 80, 
                bgcolor: '#FFF5F0',
                color: '#EA580C',
                fontSize: '1.75rem',
                fontWeight: 900,
                borderRadius: '20px',
                border: '2px solid white',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
              }}
            >
              <AssignmentIcon fontSize="large" />
            </Avatar>
            <Box className="flex-1">
              <Typography className="text-2xl font-black text-slate-900 leading-tight mb-1 font-inter">
                {quotation.id}
              </Typography>
              <Typography className="text-xs font-bold text-slate-400 uppercase tracking-widest font-inter mb-2">
                Ngày báo giá: {quotation.date}
              </Typography>
              <Box className="flex gap-2 items-center flex-wrap">
                {(() => {
                  const s = (quotation.status || '').toUpperCase();
                  let details = { label: 'Chờ duyệt', bg: 'bg-amber-50 border-amber-200 text-amber-700', dot: 'bg-amber-500' };
                  if (s === 'APPROVED' || s === 'ĐỒNG Ý' || s === 'ĐÃ DUYỆT') {
                    details = { label: 'Đồng ý', bg: 'bg-emerald-50 border-emerald-200 text-emerald-700', dot: 'bg-emerald-500' };
                  } else if (s === 'CANCELLED' || s === 'TỪ CHỐI' || s === 'ĐÃ HỦY') {
                    details = { label: 'Từ chối', bg: 'bg-red-50 border-red-200 text-red-700', dot: 'bg-red-500' };
                  }
                  return (
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 font-inter ${details.bg} font-bold`}>
                      <div className={`w-2 h-2 rounded-full ${details.dot}`}></div>
                      <span className="text-[9px] font-black uppercase tracking-wider">
                        {details.label}
                      </span>
                    </div>
                  );
                })()}
              </Box>
            </Box>
          </Box>
 
          <Box className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-2">
            <div className="bg-white p-4 rounded-2xl border border-slate-300 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600">
                  <PersonIcon sx={{ fontSize: 16 }} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">Đối tác</p>
                  <p className="text-sm font-black text-slate-900 font-inter leading-tight truncate w-32" title={quotation.name}>{quotation.name}</p>
                </div>
              </div>
              <p className="text-[10px] font-bold text-slate-500 mt-1 pl-10 font-inter">{quotation.email}</p>
            </div>
            
            <div className="bg-white p-4 rounded-2xl border border-slate-300 shadow-sm flex flex-col justify-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 font-inter">Tổng cộng (VAT)</p>
              <p className="text-xl font-black text-[#00288E] font-inter">{formatCurrency(quotation.value * 1.1, 'text-xl text-[#00288E]')}</p>
            </div>
          </Box>
        </Box>

        <Divider />

        {/* Tabs Section */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{
              '& .MuiTab-root': {
                fontFamily: 'Inter, sans-serif',
                fontSize: '11px',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                color: '#64748b',
                minHeight: '56px',
                minWidth: 'auto !important',
                padding: '6px 8px !important',
                whiteSpace: 'nowrap !important'
              },
              '& .Mui-selected': {
                color: '#00288E !important',
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#00288E',
                height: '3px',
                borderRadius: '3px 3px 0 0'
              }
            }}
          >
            <Tab label="Tổng quan" icon={<ReceiptIcon sx={{ mb: '2px !important', fontSize: 18 }} />} iconPosition="start" />
            <Tab label="Lịch sử xử lý" icon={<HistoryIcon sx={{ mb: '2px !important', fontSize: 18 }} />} iconPosition="start" />
          </Tabs>
        </Box>

        {/* Tab Content */}
        <Box className="p-4">
          {tabValue === 0 && (
            <Box className="flex flex-col gap-4">
              <div className="bg-white rounded-2xl p-5 border border-slate-300 shadow-sm">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2 font-inter">
                  <span className="material-symbols-outlined text-[#00288E] text-[18px]">person</span>
                  Thông tin khách hàng
                </h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-inter">Nhóm KH</span>
                    <span className="text-xs font-black text-slate-800 font-inter bg-slate-100 px-2 py-1 rounded">{quotation.group}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-inter">Mã số thuế</span>
                    <span className="text-xs font-black text-slate-800 font-inter">0102345678-001</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-inter">Số điện thoại</span>
                    <span className="text-xs font-black text-slate-800 font-inter">0982 • 334 • 999</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-300 shadow-sm">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2 font-inter">
                  <span className="material-symbols-outlined text-[#00288E] text-[18px]">payments</span>
                  Giá trị báo giá
                </h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-inter">Giá trị dự kiến</span>
                    <span className="text-sm font-black text-slate-800 font-inter">{formatCurrency(quotation.value, 'text-sm text-slate-800')}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-inter">Thuế GTGT (10%)</span>
                    <span className="text-sm font-black text-slate-800 font-inter">{formatCurrency(quotation.value * 0.1, 'text-sm text-slate-800')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-black text-slate-900 uppercase tracking-wider font-inter">Tổng cộng</span>
                    <span className="text-xl font-black text-[#00288E] font-inter">{formatCurrency(quotation.value * 1.1, 'text-xl text-[#00288E]')}</span>
                  </div>
                </div>
              </div>
            </Box>
          )}

          {tabValue === 1 && (
            <Box className="bg-white rounded-2xl p-6 shadow-sm border border-slate-300">
              <Box className="flex flex-col gap-6 relative pl-6 before:content-[''] before:absolute before:left-[11px] before:top-1 before:bottom-1 before:w-0.5 before:bg-slate-100">
                {dynamicActivities.map((act, idx) => (
                  <ActivityItem
                    key={idx}
                    title={act.title}
                    time={act.time}
                    user={act.user}
                    color={act.color}
                    desc={act.desc}
                  />
                ))}
              </Box>
            </Box>
          )}
        </Box>
      </Box>

      {/* Footer Actions */}
      <div className="p-4 bg-white border-t border-slate-200 flex gap-2.5 w-full shrink-0 font-inter items-center justify-between">
        {(quotation.status === 'APPROVED' || quotation.status === 'ĐỒNG Ý' || quotation.status === 'ĐÃ DUYỆT') ? (
          <>
            <button 
              onClick={handleConvertToOrder}
              className="flex-1 min-w-0 group flex items-center justify-center gap-1.5 bg-[#10B981] border border-[#10B981] hover:bg-emerald-600 text-white py-3.5 rounded-2xl font-black text-[10px] sm:text-xs uppercase tracking-wider transition-all duration-300 shadow-md shadow-emerald-500/10 active:scale-95 whitespace-nowrap cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm sm:text-base group-hover:rotate-180 transition-transform duration-500">sync_alt</span>
              <span>Đơn hàng</span>
            </button>
            <button 
              className="flex-1 min-w-0 group flex items-center justify-center gap-1.5 bg-[#00288E] border border-[#00288E] hover:bg-blue-800 text-white py-3.5 rounded-2xl font-black text-[10px] sm:text-xs uppercase tracking-wider transition-all duration-300 shadow-md shadow-blue-500/10 active:scale-95 whitespace-nowrap cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm sm:text-base group-hover:scale-110 transition-transform">print</span>
              <span>In báo giá</span>
            </button>
            <button 
              className="flex-1 min-w-0 group flex items-center justify-center gap-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-600 py-3.5 rounded-2xl font-black text-[10px] sm:text-xs uppercase tracking-wider transition-all duration-300 active:scale-95 whitespace-nowrap cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm sm:text-base">send</span>
              <span>Gửi lại Email</span>
            </button>
          </>
        ) : (
          <>
            <button 
              className="flex-1 group flex items-center justify-center gap-1.5 bg-[#00288E] border border-[#00288E] hover:bg-blue-800 text-white py-3.5 rounded-2xl font-black text-[10px] sm:text-xs uppercase tracking-wider transition-all duration-300 shadow-md shadow-blue-500/10 active:scale-95 whitespace-nowrap cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm sm:text-base group-hover:scale-110 transition-transform">print</span>
              <span>In báo giá</span>
            </button>
            <button 
              className="flex-1 group flex items-center justify-center gap-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-600 py-3.5 rounded-2xl font-black text-[10px] sm:text-xs uppercase tracking-wider transition-all duration-300 active:scale-95 whitespace-nowrap cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm sm:text-base">send</span>
              <span>Gửi lại Email</span>
            </button>
          </>
        )}
      </div>
    </Drawer>
  );
};

export default QuotationDetailDrawer;
