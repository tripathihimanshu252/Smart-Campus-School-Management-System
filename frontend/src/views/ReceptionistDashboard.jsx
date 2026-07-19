// Author: Himanshu Tripathi
// Department: AI and DS
// ReceptionistDashboard.jsx

import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import { 
  HeartPulse, Calendar, UserCheck, AlertCircle, CheckCircle2, 
  PlusSquare, ShieldAlert, Zap, LayoutDashboard, Users, Bell,
  UserPlus, ClipboardList, School, BookOpen, Clock, Phone
} from 'lucide-react';

// ==========================================
// 1. FRONT DESK OVERVIEW (Home)
// ==========================================
const FrontDeskOverview = () => (
  <div className="space-y-6 animate-in fade-in duration-500">
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex justify-between items-center border-l-4 border-[#2563EB]">
      <div>
        <h2 className="text-xl font-black text-slate-900 uppercase tracking-wide">Front Desk & Wellness Terminal</h2>
        <p className="text-sm font-medium text-slate-500 mt-1">Manage campus entries, medical emergencies, and student counseling sessions.</p>
      </div>
      <div className="bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-sm">
        <Zap size={14} className="text-emerald-600 animate-pulse" />
        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Systems Active</span>
      </div>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
        <div>
          <span className="text-xs text-slate-400 font-bold uppercase tracking-widest block">Today's Visitors</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">45 <span className="text-sm font-semibold text-slate-500">Checked-in</span></span>
        </div>
        <div className="p-3 bg-blue-50 text-[#2563EB] rounded-xl"><Users size={24}/></div>
      </div>
      <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
        <div>
          <span className="text-xs text-slate-400 font-bold uppercase tracking-widest block">Active Gate Passes</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">03 <span className="text-sm font-semibold text-slate-500">Issued</span></span>
        </div>
        <div className="p-3 bg-rose-50 text-rose-600 rounded-xl"><ShieldAlert size={24}/></div>
      </div>
      <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
        <div>
          <span className="text-xs text-slate-400 font-bold uppercase tracking-widest block">Pending Inquiries</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">08 <span className="text-sm font-semibold text-slate-500">Pending</span></span>
        </div>
        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl"><Bell size={24}/></div>
      </div>
    </div>

    {/* System Status Analytics */}
    <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm space-y-4">
      <h4 className="text-sm font-black uppercase tracking-widest text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-4">
        <UserCheck size={18} className="text-[#2563EB]"/> Security & Integration Status
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex justify-between items-center hover:bg-white hover:shadow-sm transition-all">
          <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">Gate Security</span>
          <span className="text-[10px] font-black text-emerald-600 bg-emerald-100/50 px-2.5 py-1 rounded border border-emerald-200 tracking-wider">LOCKED</span>
        </div>
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex justify-between items-center hover:bg-white hover:shadow-sm transition-all">
          <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">Parent Notify Sys</span>
          <span className="text-[10px] font-black text-emerald-600 bg-emerald-100/50 px-2.5 py-1 rounded border border-emerald-200 tracking-wider">READY</span>
        </div>
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex justify-between items-center hover:bg-white hover:shadow-sm transition-all">
          <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">Exit Vector Link</span>
          <span className="text-[10px] font-black text-emerald-600 bg-emerald-100/50 px-2.5 py-1 rounded border border-emerald-200 tracking-wider">ACTIVE</span>
        </div>
      </div>
    </div>
  </div>
);

// =========================================================================
// 2. LIVE SMART ADMISSION FORM (Syncs with Database)
// =========================================================================
const NewAdmission = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    studentName: '', admissionClass: '1', stream: '', previousSchool: '', fatherName: '', parentEmail: '', parentPassword: ''
  });

  const isJunior = formData.admissionClass === 'LKG' || formData.admissionClass === 'UKG';
  const isSenior = formData.admissionClass === '11';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('userToken');
      
      const payload = {
        name: formData.studentName,
        rollNumber: 'UID' + Math.floor(1000 + Math.random() * 9000), 
        password: formData.parentPassword, 
        parentName: formData.fatherName,
        parentEmail: formData.parentEmail,
        parentPhone: "0000000000",          
        tenantId: localStorage.getItem('tenantId') || "GTI-2026", 
        classAllocation: formData.admissionClass + (formData.stream ? ` - ${formData.stream}` : ''),
        previousInstitute: isJunior ? 'Fresher' : formData.previousSchool,
        branch: "AI and DS"
      };

      await axios.post('https://smart-campus-school-management-system-1.onrender.com/api/receptionist/new-admission', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert("✅ Admission Successful! Parent ID generated.");
      setFormData({ studentName: '', admissionClass: '1', stream: '', previousSchool: '', fatherName: '', parentEmail: '', parentPassword: '' });
    } catch (error) {
      console.error("Payload Error:", error.response?.data);
      alert('❌ Admission Error: Check Console for Schema Details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm animate-in fade-in duration-300">
      <h3 className="text-lg font-black text-slate-800 uppercase tracking-wide flex items-center gap-2 border-b border-slate-100 pb-4 mb-6">
        <UserPlus size={20} className="text-[#2563EB]"/> New Student Admission Form
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Student Full Name *</label>
            <input type="text" required value={formData.studentName} placeholder="e.g. Rahul Kumar" 
              className="w-full border-2 border-slate-200 rounded-lg p-2.5 text-sm outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-blue-500/10 font-semibold text-slate-800 transition-all placeholder:font-normal bg-slate-50 focus:bg-white" 
              onChange={(e) => setFormData({...formData, studentName: e.target.value})} />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Admission Class *</label>
            <select className="w-full border-2 border-slate-200 rounded-lg p-2.5 text-sm outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-blue-500/10 font-semibold text-slate-800 transition-all bg-slate-50 focus:bg-white cursor-pointer"
              value={formData.admissionClass} onChange={(e) => setFormData({...formData, admissionClass: e.target.value, stream: '', previousSchool: ''})}>
              <option value="LKG">LKG</option>
              <option value="UKG">UKG</option>
              {[1,2,3,4,5,6,7,8,9,10,11,12].map(num => <option key={num} value={num}>Class {num}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 bg-blue-50/50 rounded-xl border border-blue-100">
          {isSenior ? (
            <div>
              <label className="text-[10px] font-bold text-blue-800 uppercase tracking-widest mb-1.5 flex items-center gap-1"><BookOpen size={14}/> Select Stream (Class 11) *</label>
              <select required className="w-full border-2 border-blue-200 rounded-lg p-2.5 text-sm outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-blue-500/10 font-semibold text-slate-800 transition-all bg-white cursor-pointer"
                value={formData.stream} onChange={(e) => setFormData({...formData, stream: e.target.value})}>
                <option value="">-- Choose Stream --</option>
                <option value="PCM">Science (PCM)</option>
                <option value="PCB">Science (PCB)</option>
                <option value="Commerce">Commerce</option>
                <option value="Arts">Arts / Humanities</option>
              </select>
            </div>
          ) : (
            <div className="text-xs text-slate-400 italic font-medium flex items-center h-full pt-6">Stream selection only applicable for Class 11.</div>
          )}

          {!isJunior ? (
            <div>
              <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1.5 flex items-center gap-1"><School size={14}/> Previous School Details *</label>
              <input type="text" required value={formData.previousSchool} placeholder="Name of previous school" 
                className="w-full border-2 border-slate-200 rounded-lg p-2.5 text-sm outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-blue-500/10 font-semibold text-slate-800 transition-all bg-white placeholder:font-normal"
                onChange={(e) => setFormData({...formData, previousSchool: e.target.value})} />
            </div>
          ) : (
            <div className="text-[11px] text-emerald-700 font-bold bg-emerald-100/50 p-3 rounded-lg border border-emerald-200 flex items-center gap-2 mt-4 md:mt-0">
               <CheckCircle2 size={16}/> Fresher (LKG/UKG) - No previous school required.
            </div>
          )}
        </div>

        <div className="p-6 border border-slate-200 rounded-xl bg-slate-50 space-y-5">
          <h4 className="text-sm font-black text-slate-800 uppercase tracking-wide border-b border-slate-200 pb-3 flex items-center gap-2">
            <Users size={16} className="text-slate-400"/> Parent Portal Credentials
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Father's Full Name *</label>
              <input type="text" required value={formData.fatherName} placeholder="Father Name" 
                className="w-full border-2 border-slate-200 rounded-lg p-2.5 text-sm outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-blue-500/10 font-semibold text-slate-800 transition-all bg-white placeholder:font-normal"
                onChange={(e) => setFormData({...formData, fatherName: e.target.value})} />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Parent Email (Login ID) *</label>
              <input type="email" required value={formData.parentEmail} placeholder="parent@email.com" 
                className="w-full border-2 border-slate-200 rounded-lg p-2.5 text-sm outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-blue-500/10 font-semibold text-slate-800 transition-all bg-white placeholder:font-normal"
                onChange={(e) => setFormData({...formData, parentEmail: e.target.value})} />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Set App Password *</label>
              <input type="password" required value={formData.parentPassword} placeholder="••••••••" 
                className="w-full border-2 border-slate-200 rounded-lg p-2.5 text-sm outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-blue-500/10 font-semibold text-slate-800 transition-all bg-white placeholder:font-normal"
                onChange={(e) => setFormData({...formData, parentPassword: e.target.value})} />
            </div>
          </div>
        </div>

        <button type="submit" disabled={loading} className="bg-[#2563EB] text-white font-bold text-xs uppercase tracking-widest px-8 py-3.5 rounded-lg hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/20 disabled:opacity-50 mt-2">
          {loading ? 'Syncing to Database...' : 'Confirm Admission & Generate ID'}
        </button>
      </form>
    </div>
  );
};

// ==========================================
// 3. NEW VISITOR ENTRY FORM
// ==========================================
const VisitorEntryForm = () => {
  const [visitor, setVisitor] = useState({ name: '', purpose: '', meetingWhom: '', phone: '' });

  const handleVisitorSubmit = (e) => {
    e.preventDefault();
    alert(`Visitor Pass Generated for: ${visitor.name}\nMeeting: ${visitor.meetingWhom}\nGate Alert Sent!`);
    setVisitor({ name: '', purpose: '', meetingWhom: '', phone: '' });
  };

  return (
    <div className="bg-white border border-slate-200 p-8 rounded-xl shadow-sm max-w-3xl animate-in fade-in duration-300">
      <h3 className="text-lg font-black text-slate-800 uppercase tracking-wide flex items-center gap-2 border-b border-slate-100 pb-4 mb-6">
        <Users size={20} className="text-indigo-600"/> Visitor Entry Registration
      </h3>
      <form onSubmit={handleVisitorSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Visitor Name *</label>
            <input type="text" required value={visitor.name} placeholder="Full Name" 
              className="w-full border-2 border-slate-200 rounded-lg p-2.5 text-sm outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/10 font-semibold text-slate-800 transition-all bg-slate-50 focus:bg-white placeholder:font-normal" 
              onChange={(e) => setVisitor({...visitor, name: e.target.value})} />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Phone Number *</label>
            <div className="flex relative">
              <Phone size={14} className="absolute left-3.5 top-3.5 text-slate-400" />
              <input type="tel" required value={visitor.phone} placeholder="9876543210" 
                className="w-full border-2 border-slate-200 rounded-lg pl-10 p-2.5 text-sm outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/10 font-semibold text-slate-800 transition-all bg-slate-50 focus:bg-white placeholder:font-normal" 
                onChange={(e) => setVisitor({...visitor, phone: e.target.value})} />
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Whom to Meet *</label>
            <select required value={visitor.meetingWhom} onChange={(e) => setVisitor({...visitor, meetingWhom: e.target.value})} 
              className="w-full border-2 border-slate-200 rounded-lg p-2.5 text-sm outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/10 font-semibold text-slate-800 transition-all bg-slate-50 focus:bg-white cursor-pointer">
              <option value="">-- Select Authority --</option>
              <option value="Principal">Principal</option>
              <option value="Director">Director</option>
              <option value="Accountant">Account Department</option>
              <option value="Teacher">Class Teacher</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Purpose of Visit *</label>
            <textarea required value={visitor.purpose} placeholder="e.g. Discuss academic performance..." rows="3" 
              className="w-full border-2 border-slate-200 rounded-lg p-3 text-sm outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/10 font-semibold text-slate-800 transition-all bg-slate-50 focus:bg-white placeholder:font-normal resize-none"
              onChange={(e) => setVisitor({...visitor, purpose: e.target.value})}></textarea>
          </div>
        </div>
        <button type="submit" className="bg-indigo-600 text-white font-bold text-xs uppercase tracking-widest px-8 py-3.5 rounded-lg hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-500/20 flex items-center gap-2 mt-2">
          <Clock size={16}/> Generate Gate Pass
        </button>
      </form>
    </div>
  );
};

// ==========================================
// 4. Visitor & Medical Logs (Gate Pass)
// ==========================================
const VisitorMedicalLogs = () => {
  const [medicalLogs, setMedicalLogs] = useState([]);
  const [targetRoll, setTargetRoll] = useState('2201321630022');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleMedicalEmergency = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const newIncident = {
        id: Date.now(),
        roll: targetRoll,
        name: targetRoll === '2201321630022' ? 'Himanshu Tripathi' : 'Guest Student',
        urgency: 'HIGH (Immediate Exit)',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        gatePass: 'AUTHORIZED_ACTIVE'
      };
      setMedicalLogs([newIncident, ...medicalLogs]);
      setIsProcessing(false);
    }, 1000);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden animate-in fade-in duration-300">
      <div className="p-6 border-b border-slate-100">
        <h3 className="text-lg font-black text-slate-800 uppercase tracking-wide flex items-center gap-2">
          <HeartPulse className="text-rose-600" size={20} /> Campus Infirmary & Gate Pass Logs
        </h3>
        <p className="text-sm font-medium text-slate-500 mt-1">Authorize immediate campus exits and monitor medical logs.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-0">
        <div className="md:col-span-2 p-6 border-b md:border-b-0 md:border-r border-slate-100 bg-slate-50/50 space-y-5">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Select Patient / Student</label>
            <select value={targetRoll} onChange={(e) => setTargetRoll(e.target.value)} 
              className="w-full border-2 border-slate-200 rounded-lg p-2.5 text-sm outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 font-semibold text-slate-800 transition-all bg-white cursor-pointer">
              <option value="2201321630022">UID: 2201321630022 (Himanshu Tripathi)</option>
              <option value="2201321639999">UID: 2201321639999 (Unknown / Guest)</option>
            </select>
          </div>
          <button onClick={handleMedicalEmergency} disabled={isProcessing} className="w-full bg-rose-600 hover:bg-rose-700 text-white text-xs uppercase tracking-widest font-bold py-3.5 rounded-lg flex items-center justify-center gap-2 transition-all shadow-md shadow-rose-500/20">
            {isProcessing ? 'Processing Pass...' : <><PlusSquare size={16}/> Authorize Medical Pass</>}
          </button>
        </div>

        <div className="md:col-span-3 p-6 space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar">
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Recent Authorizations</h4>
          {medicalLogs.length === 0 ? (
            <div className="text-center py-10 text-slate-400 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
              <p className="text-xs font-bold uppercase tracking-wide">No critical incidents logged today.</p>
            </div>
          ) : (
            medicalLogs.map(log => (
              <div key={log.id} className="bg-white border border-slate-200 p-4 rounded-xl flex justify-between items-center shadow-sm hover:shadow-md transition-all mb-3">
                <div>
                  <p className="text-sm font-black text-slate-900">{log.name}</p>
                  <p className="text-[10px] font-bold text-slate-500 mt-0.5 uppercase tracking-wide">{log.roll} • {log.time}</p>
                </div>
                <div className="text-right">
                  <span className="bg-rose-50 text-rose-600 text-[9px] font-black border border-rose-200 px-2.5 py-1.5 rounded flex items-center gap-1.5 tracking-wider">
                    <ShieldAlert size={12}/> GATE CLEARANCE ACTIVE
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 5. Inquiries & Appointments
// ==========================================
const InquiriesAppointments = () => {
  const [appointments, setAppointments] = useState([
    { id: 1, student: 'Ashish Kumar Singh', issue: 'Academic Stress & Placement Anxiety', date: 'Today', time: '03:30 PM', status: 'Pending' },
    { id: 2, student: 'Gaurav Kumar', issue: 'Time Management Strategy', date: 'Tomorrow', time: '11:00 AM', status: 'Pending' },
  ]);

  const handleScheduleSession = (id) => {
    setAppointments(prev => prev.map(app => app.id === id ? { ...app, status: 'Scheduled' } : app));
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden animate-in fade-in duration-300">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-black text-slate-800 uppercase tracking-wide flex items-center gap-2">
            <Calendar size={20} className="text-indigo-600"/> Counseling & Appointments
          </h3>
          <p className="text-sm font-medium text-slate-500 mt-1">Manage student counseling requests and general inquiries.</p>
        </div>
      </div>
      
      <div className="p-6 space-y-4">
        {appointments.map((app) => (
          <div key={app.id} className="bg-white hover:bg-slate-50 border border-slate-200 p-5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors shadow-sm">
            <div className="space-y-1.5">
              <div className="flex items-center gap-3">
                <span className="text-sm font-black text-slate-900 uppercase tracking-wide">{app.student}</span>
                <span className={`px-2.5 py-1 text-[9px] font-black rounded uppercase tracking-widest border ${app.status === 'Scheduled' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-amber-50 text-amber-600 border-amber-200'}`}>
                  {app.status}
                </span>
              </div>
              <p className="text-xs font-bold text-slate-600">{app.issue}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{app.date} • {app.time}</p>
            </div>
            {app.status === 'Pending' ? (
              <button onClick={() => handleScheduleSession(app.id)} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-6 rounded-lg text-xs uppercase tracking-widest transition-all shadow-md shadow-indigo-500/20">
                Schedule Session
              </button>
            ) : (
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 flex items-center gap-1.5 shrink-0 bg-emerald-50 px-4 py-2.5 rounded-lg border border-emerald-100">
                <CheckCircle2 size={16} /> Scheduled Successfully
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// Generic Placeholder
// ==========================================
const GenericPage = ({ title }) => (
  <div className="bg-white border border-slate-200 rounded-xl p-12 shadow-sm text-center animate-in fade-in duration-300">
    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
      <LayoutDashboard size={28} />
    </div>
    <h2 className="text-xl font-black text-slate-800 uppercase tracking-wide">{title}</h2>
    <p className="text-slate-500 mt-2 font-medium">This module is active and ready for database integration.</p>
  </div>
);

// ==========================================
// 🔥 MAIN EXPORT & ROUTING
// ==========================================
const ReceptionistDashboard = () => {
  return (
    <div className="flex-1 w-full p-6 lg:p-8 bg-slate-50 min-h-screen overflow-y-auto">
      <Routes>
        <Route path="/" element={<Navigate to="dashboard" replace />} />
        
        {/* Front Desk Overview */}
        <Route path="dashboard" element={<FrontDeskOverview />} />
        
        {/* Admission & Enquiry */}
        <Route path="new-admission" element={<NewAdmission />} />
        <Route path="new-enquiry" element={<GenericPage title="New Enquiry Form" />} />
        <Route path="enquiry-list" element={<GenericPage title="Active Enquiries List" />} />
        <Route path="verify-docs" element={<GenericPage title="Document Verification System" />} />
        
        {/* Visitor & Gate Pass */}
        <Route path="visitor-entry" element={<VisitorEntryForm />} />
        <Route path="visitor-log" element={<GenericPage title="Detailed Visitor Logs" />} />
        <Route path="gate-pass" element={<VisitorMedicalLogs />} />
        
        {/* Communication & Appointments */}
        <Route path="appointments" element={<InquiriesAppointments />} />
        <Route path="call-log" element={<GenericPage title="Telephone Call Logs" />} />
        <Route path="message-log" element={<GenericPage title="Message Register" />} />
        
        {/* Reports */}
        <Route path="reports" element={<GenericPage title="Reception Reports Generator" />} />
        
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Routes>
    </div>
  );
};

export default ReceptionistDashboard;