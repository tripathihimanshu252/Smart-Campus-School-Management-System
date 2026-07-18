// Author: Himanshu Tripathi
// Department: AI and DS

import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Users, Briefcase, Shield, UserPlus, Trash2, Loader2, 
  Bell, ChevronUp, Clock, Activity, LogIn, CheckCircle2,
  GraduationCap, BookOpen, Truck, MapPin, 
  School, UserCheck, CalendarCheck, FileText, 
  TrendingUp, FileBarChart, Wallet, AlertTriangle, RefreshCcw 
} from 'lucide-react';

// =========================================================================
// REUSABLE PREMIUM METRIC CARD (SLEEK & SHARP)
// =========================================================================
const MetricCard = ({ title, value, icon, subtitle }) => (
  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-slate-300 hover:shadow transition-all group">
    <div className="flex justify-between items-start mb-3">
      <div className="p-2 bg-slate-50 text-slate-600 rounded-lg group-hover:bg-slate-900 group-hover:text-white transition-colors">
        {icon}
      </div>
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{title}</span>
    </div>
    <div>
      {/* 🔥 Mota font hataya, sharp font-bold lagaya */}
      <h3 className="text-2xl font-bold text-slate-800 tracking-tight">{value}</h3>
      {subtitle && <p className="text-[11px] font-medium text-slate-500 mt-1">{subtitle}</p>}
    </div>
  </div>
);

// =========================================================================
// 1. SEQUENTIAL & DYNAMIC DIRECTOR OVERVIEW
// =========================================================================
const DirectorHomeOverview = () => {
  const [metrics, setMetrics] = useState({
    schools: 1, students: 0, teachers: 0, staff: 0,
    studentAtt: '92%', teacherAtt: '98%', 
    totalFee: 0, pendingFee: 0, todayFee: 0
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    setIsRefreshing(true);
    try {
      const token = localStorage.getItem('userToken');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const [studentRes, staffRes] = await Promise.all([
        axios.get('http://localhost:5000/api/students', config).catch(() => ({ data: { data: [] } })),
        axios.get('http://localhost:5000/api/admin/faculties', config).catch(() => ({ data: { data: [] } }))
      ]);

      const students = studentRes.data.data || [];
      const staffList = staffRes.data.data || [];

      const totalStudents = students.length;
      const totalStaff = staffList.length;
      const totalTeachers = staffList.filter(s => s.role === 'faculty' || s.role === 'teacher').length;

      let totalRevenueCollected = 0;
      let totalOutstanding = 0;

      students.forEach(student => {
        totalRevenueCollected += (student.paidFee || 0);
        totalOutstanding += (student.totalFee || 0); 
      });

      setMetrics({
        schools: 1, 
        students: totalStudents, 
        teachers: totalTeachers, 
        staff: totalStaff,
        studentAtt: '92%', 
        teacherAtt: '98%',
        totalFee: totalRevenueCollected, 
        pendingFee: totalOutstanding, 
        todayFee: 0 
      });
    } catch (error) {
      console.error("Failed to sync live metrics:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData(); 
    const intervalId = setInterval(fetchDashboardData, 10000); 
    return () => clearInterval(intervalId);
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN').format(amount || 0);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Executive Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">Real-time enterprise metrics & institutional overview.</p>
        </div>
        <button 
          onClick={fetchDashboardData}
          className="mt-4 md:mt-0 flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-sm hover:bg-slate-800 transition-colors"
        >
          <RefreshCcw size={14} className={isRefreshing ? 'animate-spin' : ''} />
          {isRefreshing ? 'Syncing...' : 'Live Sync'}
        </button>
      </div>

      {/* SEQUENCE 1: FINANCIAL INTELLIGENCE */}
      <section className="bg-white border border-slate-200 rounded-xl p-5 md:p-6 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none text-slate-900">
          <Wallet size={150} />
        </div>
        
        <h2 className="text-[11px] font-bold text-slate-700 uppercase tracking-widest mb-5 flex items-center gap-2 relative z-10 border-l-2 border-slate-900 pl-2">
          <Wallet size={14} /> Financial Intelligence
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Total Revenue Collected</p>
            {/* 🔥 Fonts ko sleek kiya (text-3xl font-bold) */}
            <p className="text-3xl font-bold text-slate-800">₹{formatCurrency(metrics.totalFee)}</p>
          </div>
          <div className="md:border-l md:border-slate-200 md:pl-6">
            <p className="text-[10px] font-bold text-rose-500 uppercase tracking-wider mb-1">Outstanding / Pending</p>
            <p className="text-3xl font-bold text-rose-600">₹{formatCurrency(metrics.pendingFee)}</p>
          </div>
          <div className="md:border-l md:border-slate-200 md:pl-6">
            <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-1">Today's Collection</p>
            <p className="text-3xl font-bold text-emerald-600">₹{formatCurrency(metrics.todayFee)}</p>
          </div>
        </div>
      </section>
      
      {/* SEQUENCE 2: INSTITUTIONAL SUMMARY */}
      <section>
        <h2 className="text-[11px] font-bold text-slate-700 uppercase tracking-widest mb-3 flex items-center gap-2 border-l-2 border-slate-900 pl-2">
          <School size={14} /> Core Demographics
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard title="Total Schools" value={metrics.schools} icon={<School size={16} />} subtitle="Active Branches" />
          <MetricCard title="Total Students" value={metrics.students} icon={<Users size={16} />} subtitle="Enrolled Database" />
          <MetricCard title="Total Teachers" value={metrics.teachers} icon={<Briefcase size={16} />} subtitle="Active Faculty" />
          <MetricCard title="Total Staff" value={metrics.staff} icon={<UserCheck size={16} />} subtitle="Admin & Support" />
        </div>
      </section>

      {/* SEQUENCE 3: OPERATIONAL STATUS (TODAY) */}
      <section>
        <h2 className="text-[11px] font-bold text-slate-700 uppercase tracking-widest mb-3 flex items-center gap-2 border-l-2 border-slate-900 pl-2">
          <Activity size={14} /> Today's Operations
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard title="Student Attendance" value={metrics.studentAtt} icon={<CalendarCheck size={16} />} subtitle="Overall Campus" />
          <MetricCard title="Teacher Attendance" value={metrics.teacherAtt} icon={<CalendarCheck size={16} />} subtitle="Available Today" />
          <MetricCard title="New Admissions" value="0" icon={<UserPlus size={16} />} subtitle="Applications Received" />
          <MetricCard title="Leave Requests" value="0" icon={<FileText size={16} />} subtitle="Pending Approvals" />
        </div>
      </section>

    </div>
  );
};

// =========================================================================
// 2. FLAWLESS FORM & STAFF MANAGEMENT
// =========================================================================
const DirectorStaffManagement = () => {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newStaff, setNewStaff] = useState({ 
    name: '', email: '', phone: '', password: '', 
    role: 'principal', 
    experienceType: 'Entry-Level',
    previousSchool: '', subject: '',
    busNumber: '', assignedRoute: ''
  });

  const isFaculty = newStaff.role === 'faculty';
  const isDriver = newStaff.role === 'driver'; 
  const showExperience = newStaff.role !== 'driver' && newStaff.role !== 'receptionist';

  const fetchStaff = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const res = await axios.get('http://localhost:5000/api/admin/faculties', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) setStaffList(res.data.data);
    } catch (error) {
      console.error("Error fetching staff:", error);
    }
  };

  useEffect(() => { fetchStaff(); }, []);

  const handleAddStaff = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('userToken');
      const tenantId = localStorage.getItem('tenantMapping'); 
      
      const finalPayload = { 
        ...newStaff, 
        tenantId,
        previousSchool: showExperience ? newStaff.previousSchool : '',
        busNumber: isDriver ? newStaff.busNumber : '', 
        assignedRoute: isDriver ? newStaff.assignedRoute : '' 
      };

      const res = await axios.post('http://localhost:5000/api/admin/register-staff', finalPayload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        alert(`${newStaff.role.toUpperCase()} Onboarded Successfully!`);
        setNewStaff({ 
          name: '', email: '', phone: '', password: '', role: 'principal', 
          experienceType: 'Entry-Level', previousSchool: '', subject: '',
          busNumber: '', assignedRoute: ''
        }); 
        fetchStaff(); 
      }
    } catch (error) {
      alert("Onboarding Error: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleTerminate = async (staffId, staffName) => {
    const isConfirmed = window.confirm(`WARNING: Are you sure you want to permanently terminate ${staffName}? This cannot be undone.`);
    if (isConfirmed) {
      try {
        const token = localStorage.getItem('userToken');
        const res = await axios.delete(`http://localhost:5000/api/admin/faculty/${staffId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (res.data.success) {
          alert(`${staffName} has been successfully terminated.`);
          fetchStaff(); 
        }
      } catch (error) {
        alert("Termination Error: " + (error.response?.data?.message || error.message));
      }
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-500">
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
          <UserPlus size={16} className="text-slate-900"/> Add New Personnel
        </h3>
        
        <form onSubmit={handleAddStaff} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">Assigned Role</label>
              <select value={newStaff.role} onChange={(e) => setNewStaff({...newStaff, role: e.target.value})} className="w-full h-9 px-3 border border-slate-300 rounded text-sm text-slate-700 bg-slate-50 outline-none focus:border-slate-900 cursor-pointer">
                <option value="principal">Principal</option>
                <option value="faculty">Faculty / Teacher</option>
                <option value="hod">Head of Department (HOD)</option>
                <option value="accountant">Accountant</option>
                <option value="receptionist">Receptionist</option>
                <option value="driver">Driver / Transport Admin</option>
              </select>
            </div>

            {showExperience ? (
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">Employment Profile</label>
                <div className="flex items-center gap-4 h-9 px-3 border border-slate-300 rounded bg-slate-50">
                  <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                    <input type="radio" name="exp" className="w-3 h-3 text-slate-900" value="Entry-Level" checked={newStaff.experienceType === 'Entry-Level'} onChange={() => setNewStaff({...newStaff, experienceType: 'Entry-Level', previousSchool: ''})} /> 
                    Entry-Level
                  </label>
                  <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                    <input type="radio" name="exp" className="w-3 h-3 text-slate-900" value="Industry-Experienced" checked={newStaff.experienceType === 'Industry-Experienced'} onChange={() => setNewStaff({...newStaff, experienceType: 'Industry-Experienced'})} /> 
                    Industry-Experienced
                  </label>
                </div>
              </div>
            ) : (
              <div className="hidden md:block"></div>
            )}

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">Full Legal Name</label>
              <input type="text" required value={newStaff.name} onChange={(e) => setNewStaff({...newStaff, name: e.target.value})} className="w-full h-9 px-3 border border-slate-300 rounded text-sm outline-none focus:border-slate-900" placeholder="e.g. Rahul Sharma" />
            </div>
          </div>

          {isFaculty && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in duration-300">
              <div className="space-y-1.5 md:col-span-1">
                <label className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpen size={14} className="text-slate-400"/> Subject Specialization
                </label>
                <input type="text" required placeholder="e.g. Mathematics, AI, Physics" 
                  value={newStaff.subject}
                  onChange={(e) => setNewStaff({...newStaff, subject: e.target.value})}
                  className="w-full h-9 px-3 border border-slate-300 rounded text-sm outline-none focus:border-slate-900 bg-white" />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">Official Email (Login ID)</label>
              <input type="email" required value={newStaff.email} onChange={(e) => setNewStaff({...newStaff, email: e.target.value})} className="w-full h-9 px-3 border border-slate-300 rounded text-sm outline-none focus:border-slate-900" placeholder="staff@school.edu" />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">Phone Number</label>
              <input type="text" required value={newStaff.phone} onChange={(e) => setNewStaff({...newStaff, phone: e.target.value})} className="w-full h-9 px-3 border border-slate-300 rounded text-sm outline-none focus:border-slate-900" placeholder="+91 XXXXX XXXXX" />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">System Password</label>
              <input type="password" required value={newStaff.password} onChange={(e) => setNewStaff({...newStaff, password: e.target.value})} className="w-full h-9 px-3 border border-slate-300 rounded text-sm outline-none focus:border-slate-900" placeholder="Assign a secure password" />
            </div>
          </div>

          {(newStaff.experienceType === 'Industry-Experienced' && showExperience) && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in duration-300">
              <div className="space-y-1.5 md:col-span-2 lg:col-span-1">
                <label className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">Previous Institution</label>
                <div className="relative">
                  <GraduationCap size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="text" required value={newStaff.previousSchool} onChange={(e) => setNewStaff({...newStaff, previousSchool: e.target.value})} className="w-full h-9 pl-8 pr-3 border border-slate-300 rounded text-sm outline-none focus:border-slate-900 bg-slate-50" placeholder="Where did they work?" />
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end pt-3 border-t border-slate-100">
            <button type="submit" disabled={loading} className="bg-slate-900 text-white font-bold text-xs px-6 h-9 rounded-lg hover:bg-slate-800 transition-colors flex items-center justify-center min-w-[180px] shadow-sm">
              {loading ? <Loader2 size={14} className="animate-spin" /> : "Authorize & Create Account"}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
          <h3 className="text-[11px] font-bold text-slate-800 uppercase tracking-wider">Active Staff & Leadership</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead>
              <tr className="bg-white border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                <th className="p-3 pl-4">Personnel Profile</th>
                <th className="p-3">Role & Status</th>
                <th className="p-3">Contact Details</th>
                <th className="p-3 text-right pr-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {staffList.length > 0 ? staffList.map((staff) => (
                <tr key={staff._id} className="hover:bg-slate-50 transition-colors group">
                  <td className="p-3 pl-4">
                    <div className="font-bold text-slate-900">{staff.name}</div>
                  </td>
                  <td className="p-3">
                    <div className="text-[9px] font-bold uppercase tracking-wider text-white bg-slate-800 px-2 py-0.5 rounded inline-block">
                      {staff.role}
                    </div>
                    {((staff.role !== 'driver' && staff.role !== 'receptionist') && staff.experienceType) && (
                      <div className="text-[11px] font-semibold text-slate-500 mt-1">
                        {staff.experienceType === 'Industry-Experienced' ? `Exp: ${staff.previousSchool}` : 'Entry-Level'}
                      </div>
                    )}
                    {(staff.role === 'driver' && staff.busNumber) && (
                      <div className="text-[11px] text-slate-600 font-bold mt-1 flex items-center gap-1">
                        <Truck size={10}/> {staff.busNumber} | {staff.assignedRoute}
                      </div>
                    )}
                  </td>
                  <td className="p-3 text-xs font-medium">
                    <div>{staff.email}</div>
                    <div className="mt-0.5 text-slate-500">{staff.phone}</div>
                  </td>
                  <td className="p-3 pr-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="text-slate-400 hover:text-slate-900 transition-colors p-1" title="Promote">
                        <ChevronUp size={14}/>
                      </button>
                      <button 
                        onClick={() => handleTerminate(staff._id, staff.name)} 
                        className="text-slate-400 hover:text-rose-600 transition-colors p-1" 
                        title="Terminate"
                      >
                        <Trash2 size={14}/>
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="4" className="p-6 text-center text-slate-400 font-medium text-xs">Registry is empty. Add personnel to see them here.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// 3. SYSTEM ACCESS LOGS
// =========================================================================
const DirectorSystemLogs = () => {
  const currentTime = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  const activeUserEmail = localStorage.getItem('userEmail') || "director@campus.edu";
  const activeRole = localStorage.getItem('userRole') || "Director";

  const mockLogs = [
    { id: 1, name: "Current Session", role: activeRole.toUpperCase(), email: activeUserEmail, time: currentTime, status: "Active Now", color: "text-emerald-600 bg-emerald-50 border border-emerald-100" },
    { id: 2, name: "Piyush Yadav", role: "PRINCIPAL", email: "piyush@school.edu", time: "11/07/2026, 09:15:22 am", status: "Logged In", color: "text-slate-700 bg-slate-100 border border-slate-200" },
    { id: 3, name: "Amit Verma", role: "ACCOUNTANT", email: "accounts@test.edu", time: "11/07/2026, 08:45:10 am", status: "Logged In", color: "text-slate-700 bg-slate-100 border border-slate-200" },
    { id: 4, name: "Neha Gupta", role: "RECEPTIONIST", email: "frontdesk@test.edu", time: "10/07/2026, 04:30:00 pm", status: "Logged Out", color: "text-slate-500 bg-white border border-slate-200" }
  ];

  return (
    <div className="space-y-5 animate-in fade-in duration-500">
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <h1 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Activity className="text-slate-900" size={18} /> System Access Logs
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">Live tracking of timestamps, user roles, and system logins.</p>
        </div>
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[9px] tracking-wider">
              <th className="p-3 pl-4">User Name & ID</th>
              <th className="p-3">Authorization Role</th>
              <th className="p-3"><span className="flex items-center gap-1.5"><Clock size={10}/> Login Timestamp</span></th>
              <th className="p-3 text-right pr-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {mockLogs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-3 pl-4">
                  <div className="font-bold text-slate-900 flex items-center gap-2 text-sm">
                    <LogIn size={14} className="text-slate-400" /> {log.name}
                  </div>
                  <div className="text-[11px] font-medium text-slate-500 mt-0.5">{log.email}</div>
                </td>
                <td className="p-3">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-600">
                    {log.role}
                  </span>
                </td>
                <td className="p-3 font-mono font-medium text-[11px] text-slate-600">{log.time}</td>
                <td className="p-3 pr-4 text-right">
                  <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${log.color}`}>
                    {log.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// =========================================================================
// 4. BROADCAST NOTICES
// =========================================================================
const DirectorNoticesPortal = () => (
  <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4 animate-in fade-in">
    <div className="border-b border-slate-100 pb-3">
      <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
        <Bell size={16} className="text-slate-900"/> Broadcast Directive Form
      </h3>
      <p className="text-xs text-slate-500 mt-1 font-medium">Send official notices to specific groups across the institution.</p>
    </div>
    
    <div className="space-y-4 max-w-2xl">
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Target Audience</label>
        <select className="w-full border border-slate-200 p-2 rounded-lg text-sm bg-slate-50 outline-none focus:border-slate-900 focus:bg-white transition-all font-medium text-slate-700 cursor-pointer">
          <option value="all">Institution Wide (Everyone)</option>
          <option value="leadership">Leadership Team (Principals & HODs)</option>
          <option value="faculty">Teaching Faculty Only</option>
          <option value="non_teaching">Non-Teaching Staff (Accountants, Receptionists)</option>
          <option value="transport">Transport Department (Drivers)</option>
        </select>
      </div>

      <div className="space-y-1.5">
         <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Directive Subject</label>
         <input 
            type="text" 
            placeholder="e.g. Mandatory Staff Meeting on Friday" 
            className="w-full border border-slate-200 rounded-lg p-2 text-sm outline-none focus:border-slate-900 focus:bg-white transition-all font-semibold text-slate-900 placeholder:font-normal placeholder:text-slate-400" 
         />
      </div>

      <div className="space-y-1.5">
        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Message Details</label>
        <textarea 
            placeholder="Write notice details here..." 
            className="w-full border border-slate-200 rounded-lg p-3 text-sm h-28 resize-none outline-none focus:border-slate-900 focus:bg-white transition-all text-slate-700 font-medium placeholder:font-normal placeholder:text-slate-400"
        ></textarea>
      </div>

      <div className="pt-2">
        <button className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-widest px-6 py-2.5 rounded-lg transition-all shadow-sm">
          Publish Directive
        </button>
      </div>
    </div>
  </div>
);

// =========================================================================
// 5. MAIN ROUTER
// =========================================================================
const DirectorDashboard = () => {
  return (
    <div className="flex-1 w-full p-4 lg:p-6 bg-slate-50 min-h-screen">
      <Routes>
        <Route path="director-overview" element={<DirectorHomeOverview />} />
        <Route path="manage-personnel" element={<DirectorStaffManagement />} />
        <Route path="broadcast-notices" element={<DirectorNoticesPortal />} />
        <Route path="system-access-logs" element={<DirectorSystemLogs />} />
        <Route path="/" element={<Navigate to="director-overview" replace />} />
        <Route path="*" element={<Navigate to="director-overview" replace />} />
      </Routes>
    </div>
  );
};

export default DirectorDashboard;