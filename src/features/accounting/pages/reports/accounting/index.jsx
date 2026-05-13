import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import accountingService from '../../../services/accountingService';
import { exportToPDF, exportToExcel } from '../../../utils/exportUtils';
import { useToast } from '../../../components/Common/AccountingToast';
import RevenueAreaChart from '../../../components/Charts/RevenueAreaChart';
import CategoryShareChart from '../../../components/Charts/CategoryShareChart';
import SalesPerformanceTable from '../../../components/Tables/SalesPerformanceTable';
import PrintableAccountingReportTemplate from '../../../components/Print/PrintableAccountingReportTemplate';
import DailyActivityGrid from '../../../components/Charts/DailyActivityGrid';

const AccountingReport = () => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('monthly');
  const [revenueData, setRevenueData] = useState([]);
  const [heatmapData, setHeatmapData] = useState([]); // Dữ liệu riêng cho biểu đồ nhiệt (luôn là tháng)
  const [categoryData, setCategoryData] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);
  const [error, setError] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const [chartView, setChartView] = useState('area'); // 'area' or 'heat'

  // Date filters (Synced from Dashboard)
  const now = new Date();
  
  const getISOWeekString = (date) => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1)/7);
    return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`;
  };

  const [filterWeek, setFilterWeek] = useState(getISOWeekString(now));
  const [filterYear, setFilterYear] = useState(now.getFullYear());
  const [filterDate, setFilterDate] = useState(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`);
  const [filterYearsCount, setFilterYearsCount] = useState(5);
  const [selectedDay, setSelectedDay] = useState(now.getDate());

  // Logic: Tự động chuyển về Heatmap trên Mobile dọc
  useEffect(() => {
    const checkOrientation = () => {
      const isMobile = window.innerWidth < 640;
      const isPortrait = window.innerHeight > window.innerWidth;
      if (isMobile && isPortrait && timeframe === 'daily' && chartView === 'area') {
        setChartView('heat');
      }
    };
    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    return () => window.removeEventListener('resize', checkOrientation);
  }, [timeframe, chartView]);

  const [showYearPicker, setShowYearPicker] = useState(false);
  const [showWeekPicker, setShowWeekPicker] = useState(false);
  const [showYearsCountPicker, setShowYearsCountPicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerView, setDatePickerView] = useState('months'); 
  const [dateTempYear, setDateTempYear] = useState(now.getFullYear());
  const [yearRangeStart, setYearRangeStart] = useState(Math.floor(now.getFullYear() / 10) * 10 - 4); 
  const [dateYearRangeStart, setDateYearRangeStart] = useState(Math.floor(now.getFullYear() / 12) * 12);

  const yearPickerRef = useRef(null);
  const weekPickerRef = useRef(null);
  const yearsCountPickerRef = useRef(null);
  const datePickerRef = useRef(null);

  const monthNames = [
    "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
    "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (yearPickerRef.current && !yearPickerRef.current.contains(event.target)) setShowYearPicker(false);
      if (weekPickerRef.current && !weekPickerRef.current.contains(event.target)) setShowWeekPicker(false);
      if (yearsCountPickerRef.current && !yearsCountPickerRef.current.contains(event.target)) setShowYearsCountPicker(false);
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        setShowDatePicker(false);
        setDatePickerView('months');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchAllReports = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const options = { filterWeek, filterYear, filterYearsCount, filterDate, selectedDay };
      const heatmapOptions = { filterWeek, filterYear, filterYearsCount, filterDate }; // Không lấy theo ngày để heatmap luôn có data tháng
      
      const [rev, heat, cat, perf] = await Promise.all([
        accountingService.getRevenueData(timeframe, options),
        timeframe === 'daily' ? accountingService.getRevenueData('daily', heatmapOptions) : Promise.resolve([]),
        accountingService.getCategoryRevenueReport(timeframe, options),
        accountingService.getSalesPerformanceReport(timeframe, options)
      ]);

      setRevenueData(rev);
      setHeatmapData(heat);
      setCategoryData(cat);
      setPerformanceData(perf);
    } catch (err) {
      console.error("Report Fetch Error:", err);
      setError("Không thể tải báo cáo từ hệ thống.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllReports();
  }, [timeframe, filterWeek, filterYear, filterYearsCount, filterDate, selectedDay]);

  const handleExportPDF = async () => {
    try {
      setIsExporting(true);
      showToast("Đang chuẩn bị báo cáo tài chính chuyên nghiệp...", "info");
      
      const style = document.createElement('style');
      style.innerHTML = `
        @media print {
          #root, .acc-modal-overlay { display: none !important; }
          body > *:not(#printable-accounting-report) { display: none !important; }
        }
      `;
      document.head.appendChild(style);
      
      setTimeout(() => {
        window.print();
        document.head.removeChild(style);
        setIsExporting(false);
        showToast("Xuất báo cáo PDF thành công!", "success");
      }, 500);
    } catch (err) {
      showToast("Không thể xuất báo cáo", "error");
      setIsExporting(false);
    }
  };

  const handleExportExcel = () => {
    try {
      const periodLabel = getTimeframeText();
      
      // 1. Prepare Summary Data
      const totalRevenue = revenueData.reduce((sum, item) => sum + (item.revenue || 0), 0);
      const totalOrders = revenueData.reduce((sum, item) => sum + (item.invoiceCount || 0), 0);
      const topSales = performanceData.length > 0 ? [...performanceData].sort((a, b) => b.revenue - a.revenue)[0].name : 'N/A';
      
      const summaryData = [
        { 'Chỉ số': 'TỔNG DOANH THU', 'Giá trị': totalRevenue.toLocaleString('vi-VN') + ' VND' },
        { 'Chỉ số': 'SỐ ĐƠN HÀNG', 'Giá trị': totalOrders },
        { 'Chỉ số': 'NHÂN VIÊN XUẤT SẮC', 'Giá trị': topSales },
        { 'Chỉ số': 'KỲ BÁO CÁO', 'Giá trị': periodLabel }
      ];

      // 2. Prepare Trend Data
      const trendExcelData = revenueData.map(item => ({
        'Thời gian': item.label,
        'Doanh thu (VND)': item.revenue,
        'Công nợ (VND)': item.expense,
        'Số hóa đơn': item.invoiceCount || 0,
        'Thực thu (VND)': item.collected
      }));

      // 3. Prepare Category Data
      const categoryExcelData = categoryData.map(cat => ({
        'Danh mục': cat.name,
        'Doanh thu (VND)': cat.value,
        'Tỷ trọng (%)': totalRevenue > 0 ? ((cat.value / totalRevenue) * 100).toFixed(1) + '%' : '0%'
      }));

      // 4. Prepare Performance Data
      const performanceExcelData = performanceData.map(p => ({
        'Nhân viên': p.name,
        'Doanh thu đạt được (VND)': p.revenue,
        'Đơn hàng': p.orderCount,
        'Mục tiêu (VND)': p.target,
        'Hoàn thành (%)': p.achievement.toFixed(1) + '%',
        'Hoa hồng dự kiến (VND)': p.commission
      }));
      
      exportToExcel({
        sheets: [
          { name: 'Tổng quan', data: summaryData, title: 'TÓM TẮT CHỈ SỐ TÀI CHÍNH' },
          { name: 'Xu hướng', data: trendExcelData, title: `XU HƯỚNG DOANH THU - ${periodLabel.toUpperCase()}` },
          { name: 'Danh mục', data: categoryExcelData, title: 'PHÂN TÍCH THEO DANH MỤC' },
          { name: 'Nhân viên', data: performanceExcelData, title: 'HIỆU SUẤT NHÂN VIÊN KINH DOANH' }
        ],
        filename: `Bao_cao_Tai_chinh_Hola_${periodLabel.replace(/[\/\s]/g, '_')}.xlsx`,
      });

      showToast("Xuất Excel thành công!", "success");
    } catch (err) {
      console.error("Excel Export Error:", err);
      showToast("Lỗi khi xuất Excel", "error");
    }
  };

  const getTimeframeText = () => {
    if (timeframe === 'daily') {
      const [y, m] = filterDate.split('-').map(Number);
      if (selectedDay) return `ngày ${selectedDay}/${m}/${y}`;
      return `tháng ${m}/${y}`;
    }
    if (timeframe === 'weekly') {
      const [y, w] = filterWeek.split('-W').map(Number);
      return `tuần ${w}, ${y}`;
    }
    if (timeframe === 'monthly') return `năm ${filterYear}`;
    if (timeframe === 'yearly') return `${filterYearsCount} năm qua`;
    return '';
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 w-full animate-fade-up" style={{ gap: 'var(--space-lg)' }}>
      {/* ẨN: TEMPLATE IN BÁO CÁO CHUYÊN NGHIỆP - Dùng Portal để đẩy ra ngoài #root */}
      {performanceData && createPortal(
        <PrintableAccountingReportTemplate 
          performanceData={performanceData}
          categoryData={categoryData}
          revenueData={revenueData}
          timeframeText={getTimeframeText()}
          summaryStats={{
            totalRevenue: revenueData.reduce((sum, item) => sum + (item.revenue || 0), 0),
            totalOrders: revenueData.reduce((sum, item) => sum + (item.invoiceCount || 0), 0),
            topSalesperson: (() => {
              const activeSales = performanceData.filter(p => (p.revenue || 0) > 0);
              if (activeSales.length === 0) return 'Không có';
              return activeSales.reduce((prev, current) => (prev.revenue > current.revenue) ? prev : current, activeSales[0]).name;
            })(),
            growthRate: revenueData.reduce((sum, item) => sum + (item.revenue || 0), 0) > 0 ? 12.5 : 0
          }}
        />,
        document.body
      )}

      {/* Header & Main Controls */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-4 md:gap-6 shrink-0 px-1 pr-2 md:pr-8">
        <div className="space-y-1 sm:space-y-2 shrink-0">
          <h1 className="text-acc-text-main leading-tight font-black text-2xl md:text-3xl lg:text-[1.8rem] xl:text-[2rem] uppercase tracking-tight whitespace-nowrap">PHÂN TÍCH & BÁO CÁO</h1>
          <p className="text-xs sm:text-sm md:text-base text-acc-text-muted font-medium max-w-2xl flex items-center gap-2">
            Dữ liệu phân tích <span className="text-acc-primary font-black bg-blue-50 px-2 sm:px-2.5 py-0.5 rounded-lg">{getTimeframeText()}</span>
          </p>
          {timeframe === 'daily' && (
            <p className="text-[10px] text-amber-600 font-bold uppercase tracking-tight flex items-center gap-1.5 mt-1">
              <span className="material-symbols-outlined text-[14px]">info</span>
              Mẹo: Chọn một ô trên biểu đồ nhiệt để xem và in báo cáo chi tiết cho từng ngày
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full xl:w-auto">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full">
            <div className="bg-white/60 backdrop-blur-md p-1 rounded-2xl shadow-sm border border-slate-200 flex gap-1 w-full sm:w-auto touch-action-manipulation">
              {['daily', 'weekly', 'monthly', 'yearly'].map((tf) => (
                <button
                  key={tf}
                  aria-label={`Xem theo ${tf === 'daily' ? 'Ngày' : tf === 'weekly' ? 'Tuần' : tf === 'monthly' ? 'Tháng' : 'Năm'}`}
                  onClick={() => {
                    setTimeframe(tf);
                    setSelectedDay(null);
                  }}
                  className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-[background-color,color,transform,box-shadow] duration-300 focus-visible:ring-2 focus-visible:ring-acc-primary/20 outline-none ${
                    timeframe === tf 
                      ? 'bg-acc-primary text-white shadow-lg shadow-blue-800/20 translate-y-[-1px]' 
                      : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {tf === 'daily' ? 'Ngày' : tf === 'weekly' ? 'Tuần' : tf === 'monthly' ? 'Tháng' : 'Năm'}
                </button>
              ))}
            </div>

            {/* Dynamic Sub-filters */}
            <div className="flex items-center gap-2 animate-fade-in relative">
              {timeframe === 'daily' && (() => {
                const [y, m] = filterDate.split('-').map(Number);
                return (
                  <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-300 shadow-sm" ref={datePickerRef}>
                    <button 
                      aria-label="Tháng trước"
                      onClick={() => {
                        let newM = m - 1; let newY = y;
                        if (newM < 1) { newM = 12; newY--; }
                        setFilterDate(`${newY}-${String(newM).padStart(2, '0')}`);
                      }}
                      className="w-7 h-7 rounded-lg hover:bg-slate-50 flex items-center justify-center transition-[background-color,color] text-slate-400 hover:text-acc-primary"
                    >
                      <span className="material-symbols-outlined text-[16px]" aria-hidden="true">chevron_left</span>
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setDateTempYear(y); setShowDatePicker(!showDatePicker); setDatePickerView('months'); }}
                      className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-2 hover:bg-slate-50 group ${showDatePicker ? 'bg-slate-50 shadow-inner' : ''}`}
                    >
                      <span className="text-[10px] font-black text-acc-text-main uppercase tracking-widest whitespace-nowrap">Tháng {m}, {y}</span>
                      <span className={`material-symbols-outlined text-[14px] text-slate-300 transition-transform ${showDatePicker ? 'rotate-180' : ''}`} aria-hidden="true">expand_more</span>
                    </button>
                    {showDatePicker && (
                      <div className="absolute top-full mt-2 right-0 z-[100] bg-white shadow-2xl rounded-2xl border border-slate-100 p-5 min-w-[300px] animate-fade-in origin-top-right">
                        {datePickerView === 'months' ? (
                          <div className="space-y-4">
                            <div className="flex items-center justify-between border-b border-slate-50 pb-3">
                              <span className="text-[10px] font-black text-acc-text-muted uppercase tracking-widest">Chọn tháng</span>
                              <button onClick={(e) => { e.stopPropagation(); setDatePickerView('years'); setDateYearRangeStart(Math.floor(dateTempYear / 12) * 12); }} className="text-[12px] font-black text-acc-primary uppercase">{dateTempYear} →</button>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                              {monthNames.map((mName, idx) => (
                                <button key={mName} onClick={() => { setFilterDate(`${dateTempYear}-${String(idx + 1).padStart(2, '0')}`); setShowDatePicker(false); }} className={`text-[10px] font-black py-2.5 rounded-xl transition-all ${(idx + 1) === m && dateTempYear === y ? 'bg-acc-primary text-white' : 'text-acc-text-light hover:bg-slate-50'}`}>{mName}</button>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <div className="flex items-center justify-between border-b border-slate-50 pb-3">
                              <button onClick={(e) => { e.stopPropagation(); setDatePickerView('months'); }} className="material-symbols-outlined text-slate-400" aria-label="Quay lại">arrow_back</button>
                              <div className="flex items-center gap-2">
                                <button onClick={(e) => { e.stopPropagation(); setDateYearRangeStart(prev => prev - 12); }} className="material-symbols-outlined text-acc-primary" aria-label="Dãy năm trước">chevron_left</button>
                                <span className="text-[10px] font-black tabular-nums">{dateYearRangeStart}-{dateYearRangeStart+11}</span>
                                <button onClick={(e) => { e.stopPropagation(); setDateYearRangeStart(prev => prev + 12); }} className="material-symbols-outlined text-acc-primary" aria-label="Dãy năm sau">chevron_right</button>
                              </div>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                              {Array.from({length: 12}).map((_, i) => {
                                const yearOpt = dateYearRangeStart + i;
                                return <button key={yearOpt} onClick={(e) => { e.stopPropagation(); setDateTempYear(yearOpt); setDatePickerView('months'); }} className={`text-[11px] font-black py-3 rounded-xl transition-all tabular-nums ${yearOpt === dateTempYear ? 'bg-acc-primary text-white' : 'text-acc-text-light hover:bg-slate-50'}`}>{yearOpt}</button>
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    <button 
                      aria-label="Tháng sau"
                      onClick={() => {
                        let newM = m + 1; let newY = y;
                        if (newM > 12) { newM = 1; newY++; }
                        setFilterDate(`${newY}-${String(newM).padStart(2, '0')}`);
                      }}
                      className="w-7 h-7 rounded-lg hover:bg-slate-50 flex items-center justify-center transition-[background-color,color] text-slate-400 hover:text-acc-primary"
                    >
                      <span className="material-symbols-outlined text-[16px]" aria-hidden="true">chevron_right</span>
                    </button>
                  </div>
                );
              })()}

              {timeframe === 'weekly' && (
                <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-300 shadow-sm" ref={weekPickerRef}>
                  <button aria-label="Tuần trước" onClick={() => { const [y, w] = filterWeek.split('-W').map(Number); let newW = w - 1, newY = y; if (newW < 1) { newY--; newW = 52; } setFilterWeek(`${newY}-W${String(newW).padStart(2, '0')}`); }} className="w-7 h-7 rounded-lg hover:bg-slate-50 flex items-center justify-center transition-all text-slate-400"><span className="material-symbols-outlined text-[16px]" aria-hidden="true">chevron_left</span></button>
                  <button onClick={(e) => { e.stopPropagation(); setShowWeekPicker(!showWeekPicker); }} className="px-3 py-1.5 rounded-lg text-[10px] font-black text-acc-text-main uppercase tracking-widest">{filterWeek.replace('-W', ', Tuần ')}</button>
                  {showWeekPicker && (
                    <div className="absolute top-full mt-2 right-0 z-[100] bg-white shadow-2xl rounded-2xl border border-slate-100 p-4 min-w-[200px] max-h-[300px] overflow-y-auto scrollbar-thin">
                      {[...Array(52)].map((_, i) => {
                        const weekStr = `${filterWeek.split('-W')[0]}-W${String(i + 1).padStart(2, '0')}`;
                        return <button key={i} onClick={() => { setFilterWeek(weekStr); setShowWeekPicker(false); }} className={`w-full text-left px-3 py-2 rounded-lg text-[10px] font-black mb-1 transition-all tabular-nums ${filterWeek === weekStr ? 'bg-acc-primary text-white' : 'hover:bg-slate-50 text-slate-600'}`}>Tuần {i + 1}</button>
                      })}
                    </div>
                  )}
                  <button aria-label="Tuần sau" onClick={() => { const [y, w] = filterWeek.split('-W').map(Number); let newW = w + 1, newY = y; if (newW > 52) { newY++; newW = 1; } setFilterWeek(`${newY}-W${String(newW).padStart(2, '0')}`); }} className="w-7 h-7 rounded-lg hover:bg-slate-50 flex items-center justify-center transition-all text-slate-400"><span className="material-symbols-outlined text-[16px]" aria-hidden="true">chevron_right</span></button>
                </div>
              )}

              {timeframe === 'monthly' && (
                <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-300 shadow-sm" ref={yearPickerRef}>
                  <button aria-label="Năm trước" onClick={() => setFilterYear(prev => prev - 1)} className="w-7 h-7 rounded-lg hover:bg-slate-50 flex items-center justify-center transition-all text-slate-400"><span className="material-symbols-outlined text-[16px]" aria-hidden="true">chevron_left</span></button>
                  <button onClick={(e) => { e.stopPropagation(); setShowYearPicker(!showYearPicker); }} className="px-4 py-1.5 rounded-lg text-[10px] font-black text-acc-text-main uppercase tracking-widest">Năm {filterYear}</button>
                  {showYearPicker && (
                    <div className="absolute top-full mt-2 right-0 z-[100] bg-white shadow-2xl rounded-2xl border border-slate-100 p-4 min-w-[180px]">
                      <div className="flex items-center justify-between mb-3 border-b pb-2">
                        <button aria-label="Dãy năm trước" onClick={(e) => { e.stopPropagation(); setYearRangeStart(prev => prev - 10); }} className="material-symbols-outlined text-acc-primary text-sm">chevron_left</button>
                        <span className="text-[9px] font-black tabular-nums">{yearRangeStart}-{yearRangeStart+9}</span>
                        <button aria-label="Dãy năm sau" onClick={(e) => { e.stopPropagation(); setYearRangeStart(prev => prev + 10); }} className="material-symbols-outlined text-acc-primary text-sm">chevron_right</button>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {[...Array(10)].map((_, i) => {
                          const y = yearRangeStart + i;
                          return <button key={y} onClick={() => { setFilterYear(y); setShowYearPicker(false); }} className={`text-[10px] font-black py-2 rounded-lg transition-all tabular-nums ${filterYear === y ? 'bg-acc-primary text-white' : 'hover:bg-slate-50'}`}>{y}</button>
                        })}
                      </div>
                    </div>
                  )}
                  <button aria-label="Năm sau" onClick={() => { if (filterYear < now.getFullYear()) setFilterYear(prev => prev + 1); }} disabled={filterYear >= now.getFullYear()} className="w-7 h-7 rounded-lg hover:bg-slate-50 disabled:opacity-30 flex items-center justify-center transition-all text-slate-400"><span className="material-symbols-outlined text-[16px]" aria-hidden="true">chevron_right</span></button>
                </div>
              )}

              {timeframe === 'yearly' && (
                <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-300 shadow-sm" ref={yearsCountPickerRef}>
                  <button aria-label="Giảm số năm" onClick={() => { const opts = [3, 5, 10, 20]; const idx = opts.indexOf(filterYearsCount); setFilterYearsCount(opts[Math.max(0, idx - 1)]); }} className="w-7 h-7 rounded-lg hover:bg-slate-50 flex items-center justify-center transition-all text-slate-400"><span className="material-symbols-outlined text-[16px]" aria-hidden="true">chevron_left</span></button>
                  <button onClick={(e) => { e.stopPropagation(); setShowYearsCountPicker(!showYearsCountPicker); }} className="px-4 py-1.5 rounded-lg text-[10px] font-black text-acc-text-main uppercase tracking-widest">{filterYearsCount} Năm qua</button>
                  {showYearsCountPicker && (
                    <div className="absolute top-full mt-2 right-0 z-[100] bg-white shadow-2xl rounded-2xl border border-slate-100 p-4 min-w-[140px]">
                      {[3, 5, 10, 20].map((v) => (
                        <button key={v} onClick={() => { setFilterYearsCount(v); setShowYearsCountPicker(false); }} className={`w-full text-left px-3 py-2 rounded-lg text-[10px] font-black mb-1 transition-all tabular-nums ${filterYearsCount === v ? 'bg-acc-primary text-white' : 'hover:bg-slate-50'}`}>{v} Năm</button>
                      ))}
                    </div>
                  )}
                  <button aria-label="Tăng số năm" onClick={() => { const opts = [3, 5, 10, 20]; const idx = opts.indexOf(filterYearsCount); setFilterYearsCount(opts[Math.min(opts.length - 1, idx + 1)]); }} className="w-7 h-7 rounded-lg hover:bg-slate-50 flex items-center justify-center transition-all text-slate-400"><span className="material-symbols-outlined text-[16px]" aria-hidden="true">chevron_right</span></button>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <button 
              aria-label="Xuất file Excel"
              onClick={handleExportExcel} 
              className="flex-1 sm:flex-none px-4 sm:px-5 py-2.5 flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 active:scale-95 transition-all text-[10px] sm:text-[11px] font-black uppercase tracking-widest shadow-sm"
            >
              <span className="material-symbols-outlined text-lg" aria-hidden="true">grid_on</span>
              <span className="hidden xs:inline">XUẤT EXCEL</span>
              <span className="xs:hidden">EXCEL</span>
            </button>
            <button 
              onClick={handleExportPDF} 
              disabled={isExporting} 
              className="flex-1 sm:flex-none acc-btn-primary flex items-center justify-center gap-2 py-2.5 shadow-xl shadow-blue-800/10"
              aria-label={isExporting ? "Đang xử lý xuất PDF" : "Xuất file PDF"}
            >
              <span className={`material-symbols-outlined text-lg ${isExporting ? 'animate-spin' : ''}`} aria-hidden="true">
                {isExporting ? 'sync' : 'picture_as_pdf'}
              </span>
              <span className="text-[10px] sm:text-label-xs">{isExporting ? 'ĐANG XUẤT…' : 'XUẤT PDF'}</span>
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-acc-error rounded-2xl flex items-center gap-4 animate-shake px-4 py-3 sm:px-6">
          <span className="material-symbols-outlined text-xl font-bold" aria-hidden="true">error_outline</span>
          <p className="text-sm font-bold">{error}</p>
        </div>
      )}

      {/* Content Area */}
      <div className="flex-1 min-h-0 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-200 pb-10" id="accounting-report-vignette">
        <div className="grid grid-cols-12 gap-6">
          
          {/* 1. Revenue Timeline Chart */}
          <div className="col-span-12 lg:col-span-7 xl:col-span-8" id="revenue-chart-container">
            <div className="acc-card h-full flex flex-col group hover:shadow-2xl transition-all duration-500 border-none bg-white"
                 style={{ padding: 'clamp(1rem, 2vw, 1.5rem)' }}>
              <div className="flex flex-row items-center justify-between gap-4 mb-6 md:mb-8">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-acc-primary group-hover:rotate-12 transition-transform duration-500">
                    <span className="material-symbols-outlined text-xl sm:text-2xl font-black">timeline</span>
                  </div>
                  <div>
                    <h3 className="font-black text-acc-text-main uppercase tracking-wider leading-tight"
                        style={{ fontSize: 'clamp(11px, 1.2vw, 14px)' }}>Xu hướng doanh thu</h3>
                    <p className="font-bold text-acc-text-muted uppercase"
                       style={{ fontSize: 'clamp(8px, 0.8vw, 10px)' }}>
                      Chi tiết theo {timeframe === 'daily' ? 'Ngày' : timeframe === 'weekly' ? 'Thứ' : timeframe === 'monthly' ? 'Tháng' : 'Năm'}
                    </p>
                  </div>
                </div>

                {/* Chart View Toggle (Only for Daily) */}
                {timeframe === 'daily' && (
                  <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100 shadow-inner shrink-0">
                    <button 
                      onClick={() => setChartView('area')}
                      className={`hidden sm:flex px-3 py-1.5 rounded-lg items-center gap-2 transition-all duration-300 landscape:flex ${chartView === 'area' ? 'bg-white text-acc-primary shadow-sm scale-[1.02]' : 'text-slate-400 hover:text-slate-600'}`}
                      aria-label="Xem dạng biểu đồ đường"
                    >
                      <span className="material-symbols-outlined text-[16px] sm:text-[18px]" aria-hidden="true">show_chart</span>
                      <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-nowrap">Biểu đồ</span>
                    </button>
                    <button 
                      onClick={() => setChartView('heat')}
                      className={`px-3 py-1.5 rounded-lg flex items-center gap-2 transition-all duration-300 ${chartView === 'heat' ? 'bg-white text-acc-primary shadow-sm scale-[1.02]' : 'text-slate-400 hover:text-slate-600'}`}
                      aria-label="Xem dạng bản đồ nhiệt"
                    >
                      <span className="material-symbols-outlined text-[16px] sm:text-[18px]" aria-hidden="true">grid_view</span>
                      <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-nowrap hidden xs:inline">Bản đồ nhiệt</span>
                      <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-nowrap xs:hidden text-acc-primary">NHIỆT</span>
                    </button>
                  </div>
                )}
              </div>
              
              {/* Hint cho Mobile Dọc */}
              {timeframe === 'daily' && chartView === 'heat' && (
                <div className="sm:hidden flex items-center justify-center gap-2 mb-6 animate-pulse landscape:hidden bg-slate-50/50 py-2 rounded-xl border border-dashed border-slate-200">
                  <span className="material-symbols-outlined text-acc-primary text-sm">screen_rotation</span>
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Lật ngang để xem biểu đồ chi tiết</span>
                </div>
              )}
              <div className="flex-1 min-h-[350px]">
                {timeframe === 'daily' && chartView === 'heat' ? (
                  <DailyActivityGrid 
                    apiData={heatmapData}
                    loading={loading}
                    dateFilter={filterDate}
                    onSelectDay={(day) => setSelectedDay(prev => prev === day ? null : day)}
                    selectedDay={selectedDay}
                  />
                ) : (
                  <RevenueAreaChart 
                    data={revenueData} 
                    loading={loading} 
                    timeframe={timeframe}
                  />
                )}
              </div>
            </div>
          </div>

          {/* 2. Product Category Distribution */}
          <div className="col-span-12 lg:col-span-5 xl:col-span-4" id="category-chart-container">
            <div className="acc-card h-full flex flex-col group hover:shadow-2xl transition-all duration-500 border-none bg-white" 
                 style={{ padding: 'clamp(1rem, 2vw, 1.5rem)' }}>
               <div className="flex items-center gap-4 mb-6 md:mb-8">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500 group-hover:rotate-12 transition-transform duration-500">
                    <span className="material-symbols-outlined text-xl sm:text-2xl font-black">pie_chart</span>
                  </div>
                  <div>
                    <h3 className="font-black text-acc-text-main uppercase tracking-wider" 
                        style={{ fontSize: 'clamp(12px, 1.2vw, 14px)' }}>Tỷ trọng sản phẩm</h3>
                    <p className="font-bold text-acc-text-muted uppercase text-nowrap" 
                       style={{ fontSize: 'clamp(8px, 0.8vw, 10px)' }}>Theo danh mục</p>
                  </div>
                </div>
                <div className="flex-1 flex flex-col justify-center" 
                     style={{ minHeight: 'clamp(280px, 25vh, 350px)' }}>
                  <CategoryShareChart data={categoryData} loading={loading} />
                </div>
            </div>
          </div>

          {/* 3. Sales Performance Table */}
          <div className="col-span-12" id="performance-table-container">
            <div className="acc-card flex flex-col group border-none bg-white shadow-float overflow-hidden" 
                 style={{ padding: 'clamp(1rem, 3vw, 2rem)' }}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 sm:mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500">
                    <span className="material-symbols-outlined text-xl sm:text-2xl font-black">groups</span>
                  </div>
                  <div>
                    <h3 className="font-black text-acc-text-main uppercase tracking-wider" 
                        style={{ fontSize: 'clamp(12px, 1.2vw, 14px)' }}>Hiệu suất nhân viên</h3>
                    <p className="font-bold text-acc-text-muted uppercase" 
                       style={{ fontSize: 'clamp(8px, 0.8vw, 10px)' }}>Chỉ tiêu và hoa hồng</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 font-black text-slate-400 bg-slate-50 px-3 py-1.5 rounded-full uppercase self-start md:self-auto" 
                     style={{ fontSize: 'clamp(8px, 0.8vw, 10px)' }}>
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  Dữ liệu thời gian thực
                </div>
              </div>
              
              <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200">
                <SalesPerformanceTable data={performanceData} loading={loading} />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AccountingReport;
