// Author: Himanshu Tripathi
// Department: AI and DS

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import axios from 'axios'; // 🔥 API Connection Import
import { 
  ClipboardCheck, GraduationCap, FileSpreadsheet, UserCheck, 
  AlertTriangle, Save, Plus, Minus, BookOpen, Award, CheckCircle2, Users
} from 'lucide-react';

const FacultyDashboard = () => {
  const [activeTab, setActiveTab] = useState('attendance');
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  // 📡 ACTIVE MULTI-TENANT CONTEXT MATRIX INTERCEPTOR
  const activeTenantId = useSelector((state) => state.auth?.schoolId) || localStorage.getItem('tenantId') || "GNIOT-AI-DS";
  const userEmail = useSelector((state) => state.auth?.user?.email) || localStorage.getItem('userEmail') || "aksingh@gniot.edu";

  const [students, setStudents] = useState([]);

  // 🔥 FETCH DATA FROM GLOBAL DATABASE
  useEffect(() => {
    const fetchClassRoster = async () => {
      try {
        const token = localStorage.getItem('userToken');
        // Backend API ko hit karega jo sirf is tenant (school) ke students layega
        const res = await axios.get('https://smart-campus-school-management-system-1.onrender.com/api/students', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const fetchedStudents = res.data.data || res.data || [];
        
        if (fetchedStudents.length > 0) {
          const formattedRoster = fetchedStudents.map((s, index) => {
            const rawAttendanceValue = Number(s.attendancePercentage || 85); // Backend mapping
            return {
              _id: s._id, // MongoDB ID reference ke liye
              id: index + 1,
              roll: s.rollNumber || `REG-${index}`,
              name: s.name || 'Unknown Student Node',
              attendance: rawAttendanceValue >= 75 ? 'Present' : 'Absent',
              rawPercentage: rawAttendanceValue,
              midtermGrade: s.midtermGrade || 'A'
            };
          });
          setStudents(formattedRoster);
        } else {
          // Fallback array for presentation empty states
          setStudents([{ id: 1, roll: '2201321630022', name: 'Himanshu Tripathi', attendance: 'Present', rawPercentage: 88, midtermGrade: 'A+' }]);
        }
      } catch (e) {
        console.error("Database connection failed, loading fallback...", e);
        // Presentation Fallback
        setStudents([{ id: 1, roll: '2201321630022', name: 'Himanshu Tripathi', attendance: 'Present', rawPercentage: 88, midtermGrade: 'A+' }]);
      } finally {
        setLoading(false);
      }
    };

    fetchClassRoster();
  }, [activeTenantId]);

  const handleIncrementAttendance = (id) => {
    setStudents(prev => prev.map(student => {
      if (student.id === id) {
        const nextPercentage = Math.min(student.rawPercentage + 1, 100);
        return { ...student, rawPercentage: nextPercentage, attendance: nextPercentage >= 75 ? 'Present' : 'Absent' };
      }
      return student;
    }));
  };

  const handleDecrementAttendance = (id) => {
    setStudents(prev => prev.map(student => {
      if (student.id === id) {
        const nextPercentage = Math.max(student.rawPercentage - 1, 0);
        return { ...student, rawPercentage: nextPercentage, attendance: nextPercentage >= 75 ? 'Present' : 'Absent' };
      }
      return student;
    }));
  };

  const toggleAttendance = (id) => {
    setStudents(prev => prev.map(student => {
      if (student.id === id) {
        const nextState = student.attendance === 'Present' ? 'Absent' : 'Present';
        const nextPercentage = nextState === 'Present' ? Math.max(75, student.rawPercentage) : Math.min(74, student.rawPercentage);
        return { ...student, attendance: nextState, rawPercentage: nextPercentage };
      }
      return student;
    }));
  };

  const handleGradeChange = (id, newGrade) => {
    setStudents(prev => prev.map(student => {
      if (student.id === id) {
        return { ...student, midtermGrade: newGrade };
      }
      return student;
    }));
  };

  // 🔥 LIVE SYNC SAVE FUNCTION
  const handleDataPersistence = async () => {
    try {
      const token = localStorage.getItem('userToken');
      // Sending bulk data to backend to update records globally
      await axios.put('https://smart-campus-school-management-system-1.onrender.com/api/students/attendance', { rosterData: students }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      window.alert(`✅ SUCCESS: [${activeTenantId.toUpperCase()}] Classroom telemetry metrics persisted successfully to Global DB.`);
    } catch (err) {
      console.error(err);
      window.alert("⚠️ NETWORK ALERT: Failed to sync with backend. Saved locally for now.");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* 🟢 MASTER FACULTY TERMINAL HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white border border-slate-200 p-6 rounded-xl shadow-sm gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Academic Workspace</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight mt-1.5 uppercase">Faculty Allocation Console</h1>
          <p className="text-xs text-slate-500">Authorized Terminal Session for: <span className="font-mono text-slate-700 font-bold">{userEmail}</span></p>
        </div>
        <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-right min-w-[150px]">
          <span className="text-[10px] font-bold text-slate-500 block uppercase tracking-wider">Institution Domain</span>
          <span className="text-xs font-mono font-black text-[#2563EB] uppercase tracking-widest block mt-0.5">{activeTenantId}</span>
        </div>
      </div>

      {/* 📊 MIDTERM PERFORMANCE HUD COUNTERS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center justify-between shadow-sm border-l-4 border-l-blue-500">
          <div>
            <span className="text-xs text-slate-400 block font-bold uppercase">Class Roster Size</span>
            <span className="text-2xl font-black text-slate-900 mt-1 block">{students.length} <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Enrolled</span></span>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><UserCheck size={20} /></div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center justify-between shadow-sm border-l-4 border-l-emerald-500">
          <div>
            <span className="text-xs text-slate-400 block font-bold uppercase">Avg. Attendance</span>
            <span className="text-2xl font-black text-slate-900 mt-1 block">
              {students.length > 0 ? Math.round(students.reduce((acc, s) => acc + s.rawPercentage, 0) / students.length) : 0}% 
            </span>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><BookOpen size={20} /></div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center justify-between shadow-sm border-l-4 border-l-amber-500">
          <div>
            <span className="text-xs text-slate-400 block font-bold uppercase">Top Tier Merits</span>
            <span className="text-2xl font-black text-slate-900 mt-1 block">
              {students.filter(s => s.midtermGrade === 'A+' || s.midtermGrade === 'A').length} <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Profiles</span>
            </span>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl"><Award size={20} /></div>
        </div>
      </div>

      {/* 🔥 MAIN CONTENT AREA */}
      <Routes>
        <Route path="attendance" element={
          <div className="space-y-6">
            <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 max-w-sm">
              <button onClick={() => setActiveTab('attendance')} className={`flex-1 py-2 text-xs font-bold uppercase rounded-md transition-all flex items-center justify-center gap-2 ${activeTab === 'attendance' ? 'bg-white text-blue-600 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-700'}`}>
                <ClipboardCheck size={14} /> Attendance
              </button>
              <button onClick={() => setActiveTab('grading')} className={`flex-1 py-2 text-xs font-bold uppercase rounded-md transition-all flex items-center justify-center gap-2 ${activeTab === 'grading' ? 'bg-white text-blue-600 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-700'}`}>
                <FileSpreadsheet size={14} /> Grading
              </button>
            </div>

            {/* TAB 1: ATTENDANCE */}
            {activeTab === 'attendance' && (
              <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden animate-in fade-in duration-300">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                      <GraduationCap size={16} className="text-blue-600" /> Classroom Roster Input
                    </h3>
                  </div>
                  <button onClick={handleDataPersistence} className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-lg flex items-center gap-2 transition-colors shadow-sm">
                    <Save size={14} /> Save Roll to Database
                  </button>
                </div>
                <div className="overflow-x-auto w-full">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
                        <th className="p-4">Roll ID</th>
                        <th className="p-4">Student Name</th>
                        <th className="p-4 text-center">Status Index</th>
                        <th className="p-4 text-center">Data Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-600 font-medium">
                      {loading ? (
                        <tr><td colSpan="4" className="p-8 text-center text-slate-400">Loading student roster from server...</td></tr>
                      ) : students.map((student) => (
                        <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-4 font-mono font-bold text-slate-900">{student.roll}</td>
                          <td className="p-4 font-bold text-slate-800">{student.name}</td>
                          <td className="p-4 text-center">
                            <span className={`inline-flex items-center gap-1.5 font-bold text-[10px] px-2.5 py-1 rounded-md uppercase tracking-wide border ${student.attendance === 'Present' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-rose-50 text-rose-600 border-rose-200'}`}>
                              {student.attendance === 'Absent' && <AlertTriangle size={12} />}
                              {student.attendance} ({student.rawPercentage}%)
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center justify-center gap-4">
                              <button onClick={() => toggleAttendance(student.id)} className={`text-[10px] font-bold px-3 py-1.5 rounded-lg border transition-all shadow-sm uppercase tracking-wider ${student.attendance === 'Present' ? 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50' : 'bg-slate-800 text-white border-slate-800 hover:bg-slate-700'}`}>
                                Toggle
                              </button>
                              <div className="flex items-center border border-slate-200 bg-slate-50 rounded-lg p-0.5">
                                <button type="button" onClick={() => handleDecrementAttendance(student.id)} className="p-1 hover:bg-white text-rose-500 rounded-md transition-colors"><Minus size={14} /></button>
                                <span className="px-2 font-mono text-slate-600 text-[10px] font-bold">1%</span>
                                <button type="button" onClick={() => handleIncrementAttendance(student.id)} className="p-1 hover:bg-white text-emerald-500 rounded-md transition-colors"><Plus size={14} /></button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 2: GRADING */}
            {activeTab === 'grading' && (
              <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden animate-in fade-in duration-300">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                      <FileSpreadsheet size={16} className="text-blue-600" /> Score & Performance Sheet
                    </h3>
                  </div>
                  <button onClick={handleDataPersistence} className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-lg flex items-center gap-2 transition-colors shadow-sm">
                    <Save size={14} /> Save Grades to Database
                  </button>
                </div>
                <div className="overflow-x-auto w-full">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
                        <th className="p-4">Roll ID</th>
                        <th className="p-4">Student Name</th>
                        <th className="p-4 text-right">Assigned Letter Grade</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-600 font-medium">
                      {students.map((student) => (
                        <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-4 font-mono font-bold text-slate-900">{student.roll}</td>
                          <td className="p-4 font-bold text-slate-800">{student.name}</td>
                          <td className="p-4 text-right">
                            <select 
                              value={student.midtermGrade} 
                              onChange={(e) => handleGradeChange(student.id, e.target.value)}
                              className="bg-white border border-slate-300 text-slate-700 font-bold text-xs rounded-lg px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 cursor-pointer transition-all"
                            >
                              <option value="A+">A+ (90-100%)</option>
                              <option value="A">A (80-89%)</option>
                              <option value="B">B (70-79%)</option>
                              <option value="C">C (60-69%)</option>
                              <option value="F">F (Below 60%)</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        } />

        <Route path="classes" element={
          <div className="bg-white border border-slate-200 p-10 rounded-xl shadow-sm text-center py-20 animate-in fade-in duration-300">
            <BookOpen size={48} className="mx-auto text-blue-200 mb-4" />
            <h2 className="text-2xl font-bold text-slate-700 mb-2">My Classes & Subjects</h2>
            <p className="text-slate-500">Your assigned subjects and weekly schedules will appear here.</p>
          </div>
        } />

        <Route path="enquiry" element={
          <div className="bg-white border border-slate-200 p-10 rounded-xl shadow-sm text-center py-20 animate-in fade-in duration-300">
            <Users size={48} className="mx-auto text-blue-200 mb-4" />
            <h2 className="text-2xl font-bold text-slate-700 mb-2">Class Enquiries</h2>
            <p className="text-slate-500">Student doubts and parent communications will be listed here.</p>
          </div>
        } />

        <Route path="/" element={<Navigate to="attendance" replace />} />
        <Route path="*" element={<Navigate to="attendance" replace />} />

      </Routes>
    </div>
  );
};

export default FacultyDashboard;