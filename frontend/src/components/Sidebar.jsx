// Author: Himanshu Tripathi
// Department: AI and DS

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { logoutSuccess } from '../features/authSlice'; 
import { 
  ShieldCheck, LogOut, LayoutDashboard, Users, 
  CreditCard, Bell, BookOpen, UserCheck, FileText, Calculator, 
  CalendarDays, ClipboardCheck, FileSpreadsheet, ShieldAlert,
  ChevronDown, ChevronRight, Building2, UserPlus,
  Briefcase, TrendingDown, TrendingUp, Receipt, Truck, Database
} from 'lucide-react';

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const activeTenantId = useSelector((state) => state.auth?.user?.tenantMapping) || localStorage.getItem('tenantMapping') || "CLUSTER-AI-DS";
  const loggedInUser = useSelector((state) => state.auth?.user);
  const activeUserEmail = loggedInUser?.email || "admin@campus.edu";
  
  const rawRole = loggedInUser?.role || localStorage.getItem('userRole') || "admin";
  const activeUserRole = rawRole.toLowerCase().trim();

  // =========================================================================
  // 🧭 MEGA DYNAMIC ROLE-BASED MENU GENERATOR
  // =========================================================================
  const getMenuLinks = () => {
    let roleLinks = []; 

    switch (activeUserRole) {
      case 'super-admin':
      case 'superadmin':
      case 'super':
        roleLinks = [
          { title: 'SAAS DASHBOARD', path: '/superadmin/dashboard', icon: <LayoutDashboard size={16}/> },
          { title: 'CAMPUS REGISTRY', path: '/superadmin/registry', icon: <Building2 size={16}/> },
          { title: 'BILLING LOGS', path: '/superadmin/billing', icon: <CreditCard size={16}/> },
          { title: 'SYSTEM SECURITY', path: '/superadmin/security', icon: <ShieldCheck size={16}/> },
          { title: 'DATA RECOVERY', path: '/superadmin/data-recovery', icon: <Database size={16}/> }
        ];
        break;

      case 'principal':
        roleLinks = [
          { 
            title: 'DASHBOARD', icon: <LayoutDashboard size={16}/>,
            subItems: [
              { title: 'Overview', path: '/principal/dashboard/overview' },
              { title: "Summary", path: '/principal/dashboard/summary' },
              { title: 'Notifications', path: '/principal/dashboard/notifications' }
            ]
          },
          { 
            title: 'STUDENTS', icon: <Users size={16}/>,
            subItems: [
              { title: 'All Students', path: '/principal/student-management/all-students' },
              { title: 'Student Details', path: '/principal/student-management/details' }
            ]
          },
          { 
            title: 'TEACHERS', icon: <UserCheck size={16}/>,
            subItems: [
              { title: 'All Teachers', path: '/principal/teacher-management/all-teachers' },
              { title: 'Details', path: '/principal/teacher-management/details' }
            ]
          },
          { 
            title: 'ACADEMICS', icon: <BookOpen size={16}/>,
            subItems: [
              { title: 'Classes (LKG to 12)', path: '/principal/academics/classes' },
              { title: 'Manage Subjects', path: '/principal/academics/subjects' }
            ]
          },
          { 
            title: 'ATTENDANCE', icon: <ClipboardCheck size={16}/>,
            subItems: [
              { title: 'Students', path: '/principal/attendance/student' },
              { title: 'Teachers', path: '/principal/attendance/teacher' }
            ]
          },
          { 
            title: 'EXAMS', icon: <FileText size={16}/>,
            subItems: [
              { title: 'Create Exam', path: '/principal/exams/create' },
              { title: 'Marks', path: '/principal/exams/marks' },
              { title: 'Results', path: '/principal/exams/results' }
            ]
          },
          { 
            title: 'NOTICES', icon: <Bell size={16}/>,
            subItems: [
              { title: 'Create', path: '/principal/notices/create' },
              { title: 'All Notices', path: '/principal/notices/all' }
            ]
          },
          { 
            title: 'REPORTS', icon: <FileSpreadsheet size={16}/>,
            subItems: [
              { title: 'Students', path: '/principal/reports/student' },
              { title: 'Attendance', path: '/principal/reports/attendance' },
              { title: 'Exams', path: '/principal/reports/exam' }
            ]
          },
          { 
            title: 'DISCIPLINE', icon: <ShieldAlert size={16}/>,
            subItems: [
              { title: 'Incidents', path: '/principal/discipline/incidents' },
              { title: 'Warnings', path: '/principal/discipline/warnings' }
            ]
          },
          { 
            title: 'TIMETABLE', icon: <CalendarDays size={16}/>,
            subItems: [
              { title: 'Class Timetable', path: '/principal/timetable/class' },
              { title: 'Teacher Timetable', path: '/principal/timetable/teacher' }
            ]
          }
        ];
        break;
      
      case 'director':
      case 'executive':
        roleLinks = [
          { title: 'DIRECTOR OVERVIEW', path: '/director/director-overview', icon: <LayoutDashboard size={16}/> },
          { title: 'MANAGE PERSONNEL', path: '/director/manage-personnel', icon: <Users size={16}/> },
          { title: 'BROADCAST NOTICES', path: '/director/broadcast-notices', icon: <Bell size={16}/> },
          { title: 'SYSTEM ACCESS LOGS', path: '/director/system-access-logs', icon: <ShieldCheck size={16}/> }
        ];
        break;

      case 'hod':
        roleLinks = [
          { title: 'Department Hub', path: '/hod', icon: <LayoutDashboard size={16}/> },
          { title: 'Subject Allocation', path: '/hod/subjects', icon: <BookOpen size={16}/> },
          { title: 'Faculty Monitoring', path: '/hod/faculty', icon: <Users size={16}/> }
        ];
        break;

      case 'accountant':
        roleLinks = [
          { 
            title: 'DASHBOARD', icon: <LayoutDashboard size={16}/>,
            subItems: [
              { title: 'Overview', path: '/accountant/dashboard/overview' },
              { title: "Today's Collection", path: '/accountant/dashboard/todays-collection' }
            ]
          },
          { 
            title: 'STUDENT FEES', icon: <CreditCard size={16}/>,
            subItems: [
              { title: 'Collect Fees', path: '/accountant/fees/collect' },
              { title: 'Fee Records', path: '/accountant/fees/records' }
            ]
          },
          { 
            title: 'SALARY', icon: <Briefcase size={16}/>,
            subItems: [
              { title: 'Staff Salary', path: '/accountant/salary/staff' },
              { title: 'Payslips', path: '/accountant/salary/payslips' }
            ]
          },
          { 
            title: 'EXPENSES', icon: <TrendingDown size={16}/>,
            subItems: [
              { title: 'Add Expense', path: '/accountant/expenses/add' },
              { title: 'Expense List', path: '/accountant/expenses/list' }
            ]
          },
          { 
            title: 'INCOME', icon: <TrendingUp size={16}/>,
            subItems: [
              { title: 'Add Income', path: '/accountant/income/add' },
              { title: 'Income History', path: '/accountant/income/history' }
            ]
          }
        ];
        break;

      case 'receptionist':
        roleLinks = [
          { title: 'FRONT DESK', path: '/receptionist/dashboard', icon: <LayoutDashboard size={16}/> },
          { 
            title: 'VISITOR & ENTRY', icon: <Users size={16}/>,
            subItems: [
              { title: 'Visitor Entry', path: '/receptionist/visitor-entry' },
              { title: 'Visitor Log', path: '/receptionist/visitor-log' }
            ]
          },
          { 
            title: 'ENQUIRY', icon: <UserPlus size={16}/>,
            subItems: [
              { title: 'New Enquiry', path: '/receptionist/new-enquiry' },
              { title: 'Enquiry List', path: '/receptionist/enquiry-list' }
            ]
          }
        ];
        break;

      case 'faculty':
      case 'teacher':
        roleLinks = [
          { title: 'Teacher Portal', path: '/faculty/attendance', icon: <LayoutDashboard size={16}/> },
          { title: 'My Classes', path: '/faculty/classes', icon: <BookOpen size={16}/> }
        ];
        break;

      case 'parent':
      case 'guardian':
        roleLinks = [
          { title: 'Parent Portal', path: '/parent/dashboard', icon: <ShieldCheck size={16}/> }
        ];
        break;
      
      case 'driver':
      case 'transport':
        roleLinks = [
          { title: 'Transit Console', path: '/driver/dashboard', icon: <Truck size={16}/> }
        ];
        break;

      default:
        roleLinks = [{ title: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={16}/> }];
    }

    return roleLinks;
  };

  const menuItems = getMenuLinks();
  const [openMenuIndex, setOpenMenuIndex] = useState(null);

  useEffect(() => {
    const currentActiveIndex = menuItems.findIndex(item => 
      item.subItems?.some(sub => location.pathname.includes(sub.path))
    );
    if (currentActiveIndex !== -1) {
      setOpenMenuIndex(currentActiveIndex);
    }
  }, [location.pathname]);

  const handleTerminateSession = () => {
    dispatch(logoutSuccess());
    localStorage.clear(); 
    navigate('/');
  };

  return (
    <div className="w-64 h-screen bg-[#f8fafc] text-slate-700 border-r border-slate-200 flex flex-col shadow-lg shrink-0 z-10 font-sans">
      
      <div className="p-4 border-b border-slate-200 bg-white sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="bg-[#2563EB] p-2 rounded-lg shadow-sm text-white flex items-center justify-center">
            <ShieldCheck size={18} />
          </div>
          <div>
            <h2 className="font-black text-[11px] uppercase tracking-wider text-slate-900 leading-tight">
              {activeUserRole === 'admin' ? 'School Admin' : activeUserRole.replace('-', ' ')}
            </h2>
            <p className="text-[9px] font-mono text-[#2563EB] font-bold uppercase tracking-widest">{activeTenantId}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-4 custom-scrollbar">
        <p className="px-1 text-[9px] font-black tracking-widest uppercase text-slate-400 mb-3">Command Center</p>
        
        <div className="space-y-1.5">
          {menuItems.map((item, index) => {
            const hasSubItems = !!item.subItems;
            const isExpanded = openMenuIndex === index;
            
            const isParentActive = hasSubItems 
              ? item.subItems.some(sub => location.pathname === sub.path)
              : location.pathname === item.path || location.pathname.startsWith(item.path + '/');
            
            return (
              <div 
                key={index} 
                className={`flex flex-col bg-white border rounded-lg overflow-hidden transition-all duration-200 ${
                  isParentActive 
                    ? 'border-[#2563EB] shadow-sm' 
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div 
                  onClick={() => {
                    if (hasSubItems) {
                      setOpenMenuIndex(isExpanded ? null : index);
                    } else {
                      navigate(item.path);
                    }
                  }}
                  className={`flex items-center justify-between p-2 cursor-pointer transition-all duration-200 group ${
                    isParentActive ? 'bg-blue-50/50' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`w-7 h-7 flex items-center justify-center rounded-md transition-colors ${isParentActive ? 'bg-[#2563EB] text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200 group-hover:text-slate-800'}`}>
                      {item.icon}
                    </div>
                    <span className={`text-[11px] uppercase tracking-wider ${isParentActive ? 'font-black text-[#2563EB]' : 'font-bold text-slate-600'}`}>
                      {item.title}
                    </span>
                  </div>
                  
                  {hasSubItems && (
                    <div className={isParentActive ? 'text-[#2563EB]' : 'text-slate-400 group-hover:text-slate-600'}>
                      {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </div>
                  )}
                </div>

                {hasSubItems && isExpanded && (
                  <div className="px-2 pb-2 pt-1 space-y-0.5 bg-slate-50/50 border-t border-slate-100">
                    {item.subItems.map((subItem, subIndex) => {
                      const isSubActive = location.pathname === subItem.path;
                      
                      return (
                        <div
                          key={subIndex}
                          onClick={() => navigate(subItem.path)}
                          className={`py-1.5 px-3 rounded-md cursor-pointer transition-all text-[11px] font-bold tracking-wide flex items-center gap-2 ${
                            isSubActive
                            ? 'bg-blue-100/50 text-[#2563EB]'
                            : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'
                          }`}
                        >
                          <div className={`w-1 h-1 rounded-full ${isSubActive ? 'bg-[#2563EB]' : 'bg-slate-300'}`}></div>
                          {subItem.title}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="p-3 bg-white border-t border-slate-200">
        <div className="bg-slate-50 border border-slate-200 p-2 rounded-lg mb-2 flex items-center justify-between">
          <div className="overflow-hidden">
            <span className="text-[8px] font-mono text-slate-400 font-bold uppercase tracking-widest block">Session</span>
            <div className="text-[10px] font-mono font-black text-slate-700 truncate max-w-[120px]">{activeUserEmail}</div>
          </div>
        </div>
        
        <button 
          onClick={handleTerminateSession}
          className="w-full bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-600 text-[11px] font-black py-2.5 rounded-lg flex items-center justify-center gap-1.5 border border-slate-200 hover:border-rose-200 transition-all uppercase tracking-widest shadow-sm"
        >
          <LogOut size={14}/>
          <span>Terminate</span>
        </button>
      </div>
      
    </div>
  );
};

export default Sidebar;