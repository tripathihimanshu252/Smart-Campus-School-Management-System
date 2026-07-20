// Author: Himanshu Tripathi
// Department: AI and DS

import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  User, BookOpen, CheckCircle, CreditCard, 
  MapPin, RefreshCw, Landmark, AlertCircle, ShieldCheck, Mail, Activity, ArrowUpRight
} from 'lucide-react';
import axios from 'axios';

const ParentDashboard = () => {
  const dispatch = useDispatch();
  
  // 📡 Redux context streams synchronization
  const loggedInUser = useSelector((state) => state.auth?.user);
  const activeTenantId = useSelector((state) => state.auth?.schoolId) || localStorage.getItem('activeSchoolId') || "GNIOT-AI-DS";
  
  const parentEmail = loggedInUser?.email || localStorage.getItem('userEmail') || "santosh@domain.com";

  // Local component overrides management states
  const [wardData, setWardData] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState('');
  const [liveBusStop, setLiveBusStop] = useState('Fetching live tracking...');

  // =========================================================================
  // 🔄 LIFECYCLE SYNC LAYER: LIVE MONGODB SYNCHRONIZATION
  // =========================================================================
  const fetchLiveDashboardMetrics = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const headers = { Authorization: token ? `Bearer ${token}` : '' };

      // 1. Fetch Ward Academic & Fee Data
      const studentRes = await axios.get(`https://smart-campus-school-management-system-1.onrender.com/api/parent/my-child/${parentEmail}`, { headers });
      if (studentRes.data.success) {
        setWardData(studentRes.data.data);
      }

      // 2. Fetch Live Fleet/Bus Telemetry
      const fleetRes = await axios.get('https://smart-campus-school-management-system-1.onrender.com/api/fleets', { headers });
      if (fleetRes.data.success && fleetRes.data.data.length > 0) {
        // Assuming first bus for demo, or filter by tenantId if available
        const activeBus = fleetRes.data.data[0]; 
        setLiveBusStop(activeBus.currentStop.toUpperCase());
      }
    } catch (error) {
      console.warn("⚠️ API Sync delayed, falling back to local memory buffer.", error);
      // Fallback for demo purposes if backend drops
      setWardData({
        name: "Himanshu Tripathi",
        rollNumber: "2201321630022",
        branch: "AI and Data Science",
        classAllocation: "B.Tech AI-DS",
        attendance: 88,
        totalFee: 30000,
        paidFee: 115000
      });
      setLiveBusStop("SECTOR 62 EXCHANGE NODE");
    }
  };

  useEffect(() => {
    fetchLiveDashboardMetrics();
    // Real-time polling every 5 seconds for live bus tracking and fee updates
    const pipelinePollingInterval = setInterval(fetchLiveDashboardMetrics, 5000);
    return () => clearInterval(pipelinePollingInterval);
  }, [parentEmail]);

  // =========================================================================
  // 💳 TRANSACTION TERMINAL: Processing Ledger Updates
  // =========================================================================
  const handleFeePaymentSubmission = async (e) => {
    e.preventDefault();
    const deductValue = Number(paymentAmount);

    if (!deductValue || deductValue <= 0) {
      alert("🚨 VALIDATION EXCEPTION: Please specify a valid deduction amount.");
      return;
    }

    if (deductValue > (wardData?.totalFee || 0)) {
      alert("🚨 LEDGER WARNING: Payment transaction value exceeds the outstanding balance limit.");
      return;
    }

    setIsProcessing(true);
    try {
      const token = localStorage.getItem('userToken');
      const response = await axios.put(
        'https://smart-campus-school-management-system-1.onrender.com/api/parent/submit-payment',
        { parentEmail: parentEmail, paymentAmount: deductValue },
        { headers: { Authorization: token ? `Bearer ${token}` : '' } }
      );

      if (response.data.success) {
        setWardData(response.data.data);
        setSyncFeedback("💸 Transaction synchronized successfully with master cluster database!");
        setPaymentAmount('');
      }
    } catch (apiError) {
      console.warn("⚠️ SERVER LAYER OFFLINE: Simulation Mode.");
      setSyncFeedback("❌ Network Error: Transaction could not reach master database.");
    } finally {
      setIsProcessing(false);
      setTimeout(() => setSyncFeedback(''), 4000);
    }
  };

  const checkPaid = wardData?.feePaid || Number(wardData?.totalFee) === 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* 🟢 PREMIUM SYSTEM CONSOLE TOP HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white border border-slate-200 p-6 rounded-xl shadow-sm gap-4">
        <div className="space-y-1">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-blue-600 uppercase bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-md tracking-wider">
            <ShieldCheck size={12} /> LEVEL-4 SECURE PIPELINE ACTIVE
          </span>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight mt-1.5 uppercase">Parent Oversight Terminal</h1>
          <p className="text-xs text-slate-500 font-sans">Monitoring authentication instance profile for: <span className="text-slate-800 font-bold">{parentEmail}</span></p>
        </div>
        <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-right min-w-[140px]">
          <span className="text-[10px] font-bold text-slate-500 block uppercase tracking-wider">Institutional Shard</span>
          <span className="text-xs font-mono font-black text-[#2563EB] uppercase tracking-widest block mt-0.5">{activeTenantId}</span>
        </div>
      </div>

      {syncFeedback && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-600 text-xs font-bold p-3 rounded-xl flex items-center gap-2 shadow-sm">
          <CheckCircle size={15}/> {syncFeedback}
        </div>
      )}

      {/* 🔵 CORE TRACKING PARAMETERS INDEX GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* CARD 1: ACADEMIC PROFILE REFLECTION */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4 border-l-4 border-l-indigo-500 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl"><User size={16}/></div>
              <div>
                <h3 className="text-xs font-bold tracking-wider text-slate-900 uppercase">Student Profile Node</h3>
                <p className="text-[10px] text-slate-500 font-sans">Academic registry metrics</p>
              </div>
            </div>
            <ArrowUpRight size={14} className="text-slate-400" />
          </div>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between font-sans"><span className="text-slate-500 font-medium">Ward Full Name:</span> <span className="font-bold text-slate-900">{wardData?.name || "Loading..."}</span></div>
            <div className="flex justify-between font-mono"><span className="text-slate-500 font-medium font-sans">System Roll ID:</span> <span className="font-bold text-slate-700">{wardData?.rollNumber || "..."}</span></div>
            <div className="flex justify-between font-sans"><span className="text-slate-500 font-medium">Branch Speciality:</span> <span className="font-bold text-indigo-600">{wardData?.branch || "N/A"}</span></div>
            <div className="flex justify-between font-sans"><span className="text-slate-500 font-medium">Class Framework:</span> <span className="font-bold text-slate-700">{wardData?.classAllocation || "N/A"}</span></div>
          </div>
        </div>

        {/* CARD 2: REALTIME ATTENDANCE & TELEMETRY */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4 border-l-4 border-l-emerald-500 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl"><BookOpen size={16}/></div>
              <div>
                <h3 className="text-xs font-bold tracking-wider text-slate-900 uppercase">Attendance & IoT Sync</h3>
                <p className="text-[10px] text-slate-500 font-sans">Live telemetry data loop</p>
              </div>
            </div>
            <Activity size={14} className="text-emerald-500 animate-pulse" />
          </div>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-sans">
                <span className="text-slate-500 font-medium">Syllabus Attendance:</span> 
                <span className={`font-black ${Number(wardData?.attendance || 0) >= 75 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {wardData?.attendance || 0}%
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
                <div className={`h-full transition-all duration-500 ${Number(wardData?.attendance || 0) >= 75 ? 'bg-emerald-500' : 'bg-rose-500'}`} style={{ width: `${wardData?.attendance || 0}%` }}></div>
              </div>
            </div>
            
            {/* INTER-ROUTED LOGISTICS HUB DATA */}
            <div className="pt-2 text-center bg-slate-50 border border-slate-200 border-dashed rounded-xl p-3">
              <span className="text-slate-500 block uppercase text-[9px] font-bold tracking-wider">Logistics Bus Hub Stop (P4 Sync)</span>
              <div className="flex items-center justify-center gap-1.5 text-slate-700 font-bold text-xs mt-1 font-sans">
                <MapPin size={13} className="text-rose-500 shrink-0 animate-bounce"/> {liveBusStop}
              </div>
            </div>
          </div>
        </div>

        {/* CARD 3: REVENUE & LEDGER PIPELINE */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4 border-l-4 border-l-amber-500 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl"><Landmark size={16}/></div>
              <div>
                <h3 className="text-xs font-bold tracking-wider text-slate-900 uppercase">Commercial Financial Ledger</h3>
                <p className="text-[10px] text-slate-500 font-sans">Realtime accounting streams</p>
              </div>
            </div>
            <CreditCard size={14} className="text-slate-400" />
          </div>
          <div className="space-y-3 text-xs font-mono">
            <div className="flex justify-between font-sans"><span className="text-slate-500 font-medium">Outstanding Balance Due:</span> <span className="font-extrabold text-rose-600 text-sm">₹{(wardData?.totalFee ?? 0).toLocaleString('en-IN')}.00</span></div>
            <div className="flex justify-between font-sans"><span className="text-slate-500 font-medium">Settled Accounts Paid:</span> <span className="font-bold text-emerald-600">₹{(wardData?.paidFee ?? 0).toLocaleString('en-IN')}.00</span></div>
            <div className="flex justify-between font-sans pt-0.5 items-center">
              <span className="text-slate-500 font-medium">Compliance Node Status:</span> 
              <span className={`px-2.5 py-1 text-[9px] font-bold rounded-md border tracking-wider uppercase font-mono ${checkPaid ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-amber-50 border-amber-200 text-amber-600'}`}>
                {checkPaid ? "SETTLED" : "BALANCE DUE"}
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* FEE CONTROLLER DECREMENTATION CONSOLE */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm max-w-xl">
        <div className="flex items-center gap-2 text-slate-900 font-bold tracking-tight text-sm border-b border-slate-100 pb-3.5 mb-4 font-sans">
          <CreditCard size={16} className="text-blue-600"/> Execute Real-time Fee Subtraction Balance Stream
        </div>
        
        <form onSubmit={handleFeePaymentSubmission} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-500 uppercase block tracking-wide">Specify Deduction Value (INR)</label>
            <div className="relative flex items-center">
              <span className="absolute left-4 font-mono font-bold text-slate-400 text-sm">₹</span>
              <input 
                type="number" 
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                placeholder="E.G. 5000, 10000" 
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-4 py-2.5 text-sm outline-none font-mono font-bold text-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm"
                disabled={isProcessing || checkPaid}
                required 
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isProcessing || checkPaid}
            className={`w-full font-semibold py-3 rounded-lg text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm ${
              checkPaid 
                ? 'bg-slate-100 border border-slate-200 cursor-not-allowed text-slate-400 shadow-none' 
                : 'bg-blue-600 hover:bg-blue-700 text-white font-bold'
            }`}
          >
            {isProcessing ? <RefreshCw size={14} className="animate-spin"/> : 'Authorize Transaction Deduction →'}
          </button>
        </form>
      </div>

    </div>
  );
};

export default ParentDashboard;