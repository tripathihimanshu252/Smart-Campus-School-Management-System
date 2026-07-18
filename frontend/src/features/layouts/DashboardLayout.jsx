// Author: Himanshu Tripathi
// Department: AI and DS

import React, { useState, useRef, useEffect } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Bell, Search, ChevronDown } from 'lucide-react'; 
// 🔥 FIXED IMPORT PATH: Added an extra '../' to reach the src folder
import Sidebar from '../../components/Sidebar'; 

const DashboardLayout = () => {
  // 🔥 Notification Modal State
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);

  const activeTenantId = useSelector((state) => state.auth?.schoolId) || localStorage.getItem('tenantId') || 'SYSTEM-ERP';

  // Dummy Notifications
  const notifications = [
    { id: 1, title: 'New Campus Registered', time: '5 mins ago', read: false },
    { id: 2, title: 'Server Backup Complete', time: '1 hour ago', read: false },
    { id: 3, title: 'Billing Alert: XYZ School', time: '2 hours ago', read: true },
  ];

  // Dialog box ke bahar click karne par band karne ka logic
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans antialiased text-slate-800">
      
      {/* 🟢 ASLI SIDEBAR COMPONENT (Abhi iske andar 10 options load honge) */}
      <Sidebar />

      {/* 🔵 MASTER CONTENT WORKSPACE PANEL */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#F8FAFC]">
        
        {/* Clean White Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0 relative z-10 shadow-sm">
          <div className="relative w-96">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Global Search Record Index..." className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-[10px] text-xs focus:outline-none focus:bg-white focus:border-[#2563EB] transition-all" />
          </div>
          
          <div className="flex items-center gap-5">
            {/* Functional Notification Bell */}
            <div className="relative" ref={notificationRef}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative text-slate-400 hover:text-slate-600 transition-colors p-1"
              >
                <Bell size={18} />
                <span className="absolute -top-0 -right-0 h-4 w-4 bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center rounded-full border border-white">
                  {notifications.filter(n => !n.read).length}
                </span>
              </button>

              {/* Notification Dialog Box */}
              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 bg-white border border-slate-200 rounded-[12px] shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                  <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex justify-between items-center">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">System Alerts</h3>
                    <span className="text-[10px] text-[#2563EB] font-bold cursor-pointer hover:underline">Mark all read</span>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.map((notify) => (
                      <div key={notify.id} className={`px-4 py-3 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors cursor-pointer flex gap-3 items-start ${notify.read ? 'opacity-60' : 'bg-blue-50/30'}`}>
                        <div className={`mt-0.5 h-2 w-2 rounded-full shrink-0 ${notify.read ? 'bg-slate-300' : 'bg-[#2563EB]'}`}></div>
                        <div>
                          <p className={`text-xs ${notify.read ? 'text-slate-600 font-medium' : 'text-slate-900 font-bold'}`}>{notify.title}</p>
                          <p className="text-[10px] text-slate-400 mt-1">{notify.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-slate-50 border-t border-slate-200 px-4 py-2.5 text-center">
                    <Link to="/notifications" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider hover:text-[#2563EB] transition-colors">View All Logs</Link>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 cursor-pointer border-l border-slate-200 pl-5">
              <span className="text-xs font-bold text-slate-600 font-mono bg-slate-100 px-2 py-1 rounded-[6px]">Node: {activeTenantId}</span>
              <ChevronDown size={14} className="text-slate-400"/>
            </div>
          </div>
        </header>

        {/* 🚀 OUTLET: Yahan center mein saare dashboards load honge (Director, HOD etc.) */}
        <main className="flex-1 overflow-y-auto bg-[#F8FAFC] p-0">
          <Outlet />
        </main>
      </div>

    </div>
  );
};

export default DashboardLayout;