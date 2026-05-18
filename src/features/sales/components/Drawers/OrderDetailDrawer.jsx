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
  Inventory as InventoryIcon,
  Person as PersonIcon,
  Payments as PaymentsIcon
} from '@mui/icons-material';

// --- HÀM ĐỊNH DẠNG NGÀY HOẠT ĐỘNG (chỉ hiển thị ngày, DB dùng kiểu DATE) ---
const formatDate = (dateStr) => {
  if (!dateStr) return "N/A";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "N/A";
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

const OrderDetailDrawer = ({ open, onClose, order }) => {
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    if (!open) {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    }
  }, [open]);

  const orderBaseTime = useMemo(() => {
    if (!order || !order.date) return new Date();
    // Support DD/MM/YYYY hh:mm format if present
    const parts = order.date.match(/^(\d{2})\/(\d{2})\/(\d{4})(?:\s+(\d{2}):(\d{2}))?$/);
    if (parts) {
      const day = parseInt(parts[1], 10);
      const month = parseInt(parts[2], 10) - 1;
      const year = parseInt(parts[3], 10);
      const hour = parts[4] ? parseInt(parts[4], 10) : 0;
      const min = parts[5] ? parseInt(parts[5], 10) : 0;
      return new Date(year, month, day, hour, min);
    }
    const d = new Date(order.date);
    return isNaN(d.getTime()) ? new Date() : d;
  }, [order?.date]);

  const rawStatus = order?.rawStatus || 'PENDING';

  const dynamicActivities = useMemo(() => {
    const list = [];
    if (!order) return list;

    // orderDate là ngày tạo đơn (từ DB, kiểu DATE)
    const orderDate = orderBaseTime;

    // 1. Luôn có: Khởi tạo đơn hàng vào orderDate
    list.push({
      title: "Đơn hàng được khởi tạo thành công",
      time: formatDate(orderDate),
      user: "Hệ thống",
      color: "bg-blue-600",
      desc: "Khởi tạo",
      date: orderDate
    });

    if (rawStatus === 'CANCELLED') {
      list.push({
        title: "Đơn hàng đã bị hủy bỏ",
        time: formatDate(orderDate),
        user: "Nhân viên Sale",
        color: "bg-rose-500",
        desc: "Đã hủy",
        date: orderDate
      });
    } else {
      // PENDING: chờ xác nhận
      if (rawStatus === 'PENDING') {
        list.push({
          title: "Chờ xác nhận từ bộ phận kho",
          time: formatDate(orderDate),
          user: "Hệ thống",
          color: "bg-slate-300",
          desc: "Kiểm kho",
          date: orderDate
        });
      }

      // CONFIRMED hoặc cao hơn
      if (['CONFIRMED', 'SHIPPING', 'DELIVERED'].includes(rawStatus)) {
        list.push({
          title: "Đơn hàng đã được xác nhận",
          time: formatDate(orderDate),
          user: "Nhân viên Sale",
          color: "bg-indigo-500",
          desc: "Xác nhận",
          date: orderDate
        });
      }

      // SHIPPING hoặc DELIVERED: dùng deliveryDate nếu có
      if (['SHIPPING', 'DELIVERED'].includes(rawStatus)) {
        const deliveryDate = order.deliveryDate ? new Date(order.deliveryDate) : orderDate;
        list.push({
          title: "Đơn hàng bắt đầu được giao đi",
          time: formatDate(deliveryDate),
          user: "Bộ phận Kho",
          color: "bg-amber-500",
          desc: "Đang giao",
          date: deliveryDate
        });
      }

      // DELIVERED: hoàn thành
      if (rawStatus === 'DELIVERED') {
        const deliveryDate = order.deliveryDate ? new Date(order.deliveryDate) : orderDate;
        list.push({
          title: "Giao hàng và thanh toán thành công",
          time: formatDate(deliveryDate),
          user: "Hệ thống Logistics",
          color: "bg-emerald-500",
          desc: "Hoàn thành",
          date: deliveryDate
        });
      }
    }

    // Sắp xếp mới nhất lên đầu
    return list.sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [order, orderBaseTime, rawStatus]);

  if (!order) return null;

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

  const getOrderStatusLabel = (status) => {
    const statusMap = {
      'PENDING': 'Chờ xác nhận',
      'CONFIRMED': 'Đã xác nhận',
      'SHIPPING': 'Đang giao',
      'DELIVERED': 'Hoàn thành',
      'CANCELLED': 'Đã hủy'
    };
    return statusMap[status] || status;
  };

  const getOrderStatusStyle = (status) => {
    const styleMap = {
      'PENDING': 'bg-amber-50 border-amber-200 text-amber-700 font-bold',
      'CONFIRMED': 'bg-blue-50 border-blue-200 text-blue-700 font-bold',
      'SHIPPING': 'bg-indigo-50 border-indigo-200 text-indigo-700 font-bold',
      'DELIVERED': 'bg-emerald-50 border-emerald-200 text-emerald-700 font-bold',
      'CANCELLED': 'bg-rose-50 border-rose-200 text-rose-700 font-bold'
    };
    return styleMap[status] || 'bg-slate-50 border-slate-200 text-slate-600 font-bold';
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
          Chi tiết đơn hàng
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
                bgcolor: '#EBF0FF',
                color: '#00288E',
                fontSize: '1.75rem',
                fontWeight: 900,
                borderRadius: '20px',
                border: '2px solid white',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
              }}
            >
              <ReceiptIcon fontSize="large" />
            </Avatar>
            <Box className="flex-1">
              <Typography className="text-2xl font-black text-slate-900 leading-tight mb-1 font-inter">
                #{order.id}
              </Typography>
              <Typography className="text-xs font-bold text-slate-400 uppercase tracking-widest font-inter mb-2">
                Ngày đặt: {order.date}
              </Typography>
              <Box className="flex gap-2 items-center flex-wrap">
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 font-inter ${getOrderStatusStyle(rawStatus)}`}>
                  <div className={`w-2 h-2 rounded-full ${rawStatus === 'DELIVERED' ? 'bg-emerald-500' : 'bg-current'}`}></div>
                  <span className="text-[9px] font-black uppercase tracking-wider">
                    {getOrderStatusLabel(rawStatus)}
                  </span>
                </div>
              </Box>
            </Box>
          </Box>
 
          <Box className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-2">
            <div className="bg-white p-4 rounded-2xl border border-slate-300 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                  <PersonIcon sx={{ fontSize: 16 }} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">Khách hàng</p>
                  <p className="text-sm font-black text-slate-900 font-inter leading-tight">{order.customer}</p>
                </div>
              </div>
              <p className="text-xs font-bold text-slate-500 mt-1 pl-10 font-inter">{order.phone}</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-300 shadow-sm flex flex-col justify-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 font-inter">Tổng giá trị</p>
              <p className="text-xl font-black text-[#00288E] font-inter">{formatCurrency(order.total, 'text-xl text-[#00288E]')}</p>
            </div>
          </Box>

          {/* Mục Ghi chú Đơn hàng (dưới khách hàng & tổng giá trị, trên divider) */}
          <Box className="mt-4 bg-amber-50/40 border border-dashed border-amber-200 rounded-2xl p-4 shadow-sm select-none">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="material-symbols-outlined text-amber-600 text-[18px]">edit_note</span>
              <span className="text-[10px] font-black text-amber-700 uppercase tracking-widest leading-none">Ghi chú đơn hàng</span>
            </div>
            <p className="text-xs font-bold text-slate-600 font-inter leading-relaxed pl-6 italic">
              {(() => {
                const noteVal = order.notes || order.note;
                if (!noteVal || !noteVal.trim() || noteVal === 'Khởi tạo trực tiếp từ Dashboard') {
                  return "Không có ghi chú";
                }
                return noteVal;
              })()}
            </p>
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
            <Tab label="Sản phẩm" icon={<InventoryIcon sx={{ mb: '2px !important', fontSize: 18 }} />} iconPosition="start" />
            <Tab label="Thanh toán" icon={<PaymentsIcon sx={{ mb: '2px !important', fontSize: 18 }} />} iconPosition="start" />
            <Tab label="Lịch sử" icon={<HistoryIcon sx={{ mb: '2px !important', fontSize: 18 }} />} iconPosition="start" />
          </Tabs>
        </Box>

        {/* Tab Content */}
        <Box className="p-4">
          {tabValue === 0 && (
            <Box className="flex flex-col gap-3">
              {(order.items || []).map((item, idx) => (
                <Box key={idx} className="p-4 rounded-2xl border border-slate-300 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer bg-white flex items-center justify-between">
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black uppercase shadow-sm border border-slate-100 overflow-hidden shrink-0">
                      {item.imageURL ? (
                        <img src={item.imageURL} className="w-full h-full object-cover" alt={item.name} />
                      ) : (
                        <span className="material-symbols-outlined text-slate-400" style={{ fontSize: '1.5rem' }}>image</span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <Typography className="text-sm font-black text-slate-900 break-words whitespace-normal font-inter">
                        {item.name}
                      </Typography>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-inter border border-slate-200 px-1.5 py-0.5 rounded-md">
                          SL: {item.quantity}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="ml-4 shrink-0 text-right">
                    {formatCurrency(item.price * item.quantity, 'text-sm text-slate-900')}
                  </div>
                </Box>
              ))}
            </Box>
          )}

          {tabValue === 1 && (
            <Box className="flex flex-col gap-4">
              <div className="bg-white rounded-2xl p-5 border border-slate-300 shadow-sm">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2 font-inter">
                  <span className="material-symbols-outlined text-[#00288E] text-[18px]">receipt_long</span>
                  Tóm tắt đơn hàng
                </h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-inter">Tạm tính</span>
                    <span className="text-sm font-black text-slate-800 font-inter">{formatCurrency(order.total / 1.1, 'text-sm text-slate-800')}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-inter">Thuế (10%)</span>
                    <span className="text-sm font-black text-slate-800 font-inter">{formatCurrency(order.total - (order.total / 1.1), 'text-sm text-slate-800')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-black text-slate-900 uppercase tracking-wider font-inter">Tổng cộng</span>
                    <span className="text-xl font-black text-[#00288E] font-inter">{formatCurrency(order.total, 'text-xl text-[#00288E]')}</span>
                  </div>
                </div>
              </div>
            </Box>
          )}

          {tabValue === 2 && (
            <Box className="bg-white rounded-2xl p-6 shadow-sm border border-slate-300">
              <Box className="flex flex-col gap-6 relative pl-6 before:content-[''] before:absolute before:left-[11px] before:top-1 before:bottom-1 before:w-0.5 before:bg-slate-100 max-h-[350px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-200">
                {dynamicActivities.length > 0 ? (
                  dynamicActivities.map((act, index) => (
                    <ActivityItem 
                      key={index}
                      title={act.title} 
                      time={act.time} 
                      user={act.user} 
                      color={act.color}
                      desc={act.desc}
                    />
                  ))
                ) : (
                  <Typography className="text-xs text-slate-400 font-bold font-inter text-center py-4">
                    Không có lịch sử hoạt động
                  </Typography>
                )}
              </Box>
            </Box>
          )}
        </Box>
      </Box>

      {/* Footer Actions */}
      <div className="p-6 bg-white border-t border-slate-200 flex gap-4 shrink-0 font-inter">
        <button 
          className="flex-1 group flex items-center justify-center gap-2 bg-[#00288E] hover:bg-white text-white hover:text-[#00288E] py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all duration-300 shadow-lg shadow-blue-900/10 border-2 border-[#00288E] active:scale-95"
        >
          <span className="material-symbols-outlined text-sm group-hover:rotate-12 transition-transform">check_circle</span>
          Xác nhận đơn
        </button>
        <button 
          className="flex-1 group flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-700 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all duration-300 border-2 border-slate-300 active:scale-95"
        >
          <span className="material-symbols-outlined text-sm text-rose-500">cancel</span>
          Hủy đơn hàng
        </button>
      </div>
    </Drawer>
  );
};

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

export default OrderDetailDrawer;
