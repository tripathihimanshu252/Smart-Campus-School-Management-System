// Author: Himanshu Tripathi
// Department: AI and DS
// SuperAdminDashboard.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Routes, Route, Navigate } from 'react-router-dom';
import { 
  Building2, Users, GraduationCap, UserCheck, Activity, 
  Clock, Shield, Search, Radio, Plus, Eye, EyeOff, Database, Download, Filter 
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast'; 

// =========================================================================
// 1. OVERVIEW HUB COMPONENT
// =========================================================================
const OverviewHub = ({ tenants }) => (
  <div className="space-y-6 animate-in fade-in duration-500">
    <div className="bg-white border border-slate-200 rounded-[10px] p-6 shadow-sm border-l-4 border-blue-600">
      <h2 className="text-lg font-bold text-slate-900">SaaS Multi-Tenant Global Architecture</h2>
      <p className="text-xs text-slate-500 mt-1">Real-time system HUD metrics across all decentralized institutional branches.</p>
    </div>
    
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <div className="bg-white border border-slate-200 rounded-[10px] p-5 flex items-center justify-between shadow-sm">
        <div>
          <span className="text-xs text-slate-500 font-semibold uppercase">Campuses</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">{tenants?.length || 0}</span>
        </div>
        <div className="p-3 bg-blue-50 text-[#2563EB] rounded-[10px]"><Building2 size={20} /></div>
      </div>
      <div className="bg-white border border-slate-200 rounded-[10px] p-5 flex items-center justify-between shadow-sm">
        <div>
          <span className="text-xs text-slate-500 font-semibold uppercase">Uptime</span>
          <span className="text-2xl font-black text-emerald-600 mt-1 block">99.9%</span>
        </div>
        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-[10px]"><Activity size={20} /></div>
      </div>
      <div className="bg-white border border-slate-200 rounded-[10px] p-5 flex items-center justify-between shadow-sm">
        <div>
          <span className="text-xs text-slate-500 font-semibold uppercase">Staff</span>
          <span className="text-2xl font-black text-amber-600 mt-1 block">{tenants?.reduce((acc, t) => acc + (t?.stats?.teachers || 0), 0) || 0}</span>
        </div>
        <div className="p-3 bg-amber-50 text-amber-600 rounded-[10px]"><UserCheck size={20} /></div>
      </div>
      <div className="bg-white border border-slate-200 rounded-[10px] p-5 flex items-center justify-between shadow-sm">
        <div>
          <span className="text-xs text-slate-500 font-semibold uppercase">Students</span>
          <span className="text-2xl font-black text-violet-600 mt-1 block">{tenants?.reduce((acc, t) => acc + (t?.stats?.students || 0), 0) || 0}</span>
        </div>
        <div className="p-3 bg-violet-50 text-violet-600 rounded-[10px]"><GraduationCap size={20} /></div>
      </div>
    </div>
  </div>
);

// =========================================================================
// 2. TENANT REGISTRY COMPONENT 
// =========================================================================
const TenantRegistry = ({ 
  tenants, instName, setInstName, tenantCode, setTenantCode,
  directorName, setDirectorName, directorEmail, setDirectorEmail, directorPassword, setDirectorPassword,
  handleDeployTenant, executeDownloadDumpBackup, handleDecommission 
}) => {
  const [showCardPassword, setShowCardPassword] = useState({});
  const [showFormPassword, setShowFormPassword] = useState(false);
  const [searchTerm, setSearchTerm] = useState(''); 

  const toggleCardPassword = (id) => setShowCardPassword(prev => ({ ...prev, [id]: !prev[id] }));

  const handleExportCSV = () => {
    toast.loading("Generating CSV Report...", { id: 'csv-toast' });
    setTimeout(() => {
      const headers = "Campus Name,Tenant Code,Status,Director Name,Director Email,Staff Count,Student Count\n";
      const rows = tenants.map(t => 
        `"${t.name}","${t.code}","${t.status || 'Active'}","${t.directorDetails?.name || 'N/A'}","${t.directorEmail}","${t.stats?.teachers || 0}","${t.stats?.students || 0}"`
      ).join("\n");
      
      const blob = new Blob([headers + rows], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `SaaS_Campuses_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      toast.success("CSV Exported Successfully!", { id: 'csv-toast' });
    }, 1000);
  };

  const filteredTenants = tenants.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col w-full gap-8 animate-in fade-in duration-500">
      <div className="bg-white border border-slate-200 rounded-[10px] p-6 shadow-sm border-t-4 border-[#2563EB]">
        <h3 className="text-sm font-bold text-slate-900 tracking-wide flex items-center gap-2 mb-6">
          <Plus size={16} className="text-[#2563EB]" /> Create Campus Profile
        </h3>
        <form onSubmit={handleDeployTenant} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-slate-700 font-bold text-[10px] uppercase tracking-wider">Institution Name</label>
              <input type="text" value={instName} onChange={(e) => setInstName(e.target.value)} placeholder="Enter institution name" className="w-full bg-white border-2 border-slate-300 text-slate-900 rounded-[8px] px-4 py-2.5 text-sm outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-blue-500/10 transition-all" required />
            </div>
            <div className="space-y-1.5">
              <label className="text-slate-700 font-bold text-[10px] uppercase tracking-wider">ID Code (Tenant ID)</label>
              <input type="text" value={tenantCode} onChange={(e) => setTenantCode(e.target.value)} placeholder="E.g. LLOYD-01" className="w-full bg-white border-2 border-slate-300 text-slate-900 rounded-[8px] px-4 py-2.5 text-sm outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-blue-500/10 transition-all font-mono uppercase" required />
            </div>
          </div>
          
          <div className="space-y-4 pt-5 border-t border-slate-200 mt-2">
            <p className="text-[10px] font-black text-[#2563EB] uppercase tracking-widest bg-blue-50 inline-block px-3 py-1 rounded-full">Director Credentials</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-slate-700 font-bold text-[10px] uppercase tracking-wider">Director Name</label>
                <input type="text" value={directorName} onChange={(e) => setDirectorName(e.target.value)} placeholder="Full Name" className="w-full bg-white border-2 border-slate-300 text-slate-900 rounded-[8px] px-4 py-2.5 text-sm outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-blue-500/10 transition-all" required />
              </div>
              <div className="space-y-1.5">
                <label className="text-slate-700 font-bold text-[10px] uppercase tracking-wider">Director Email</label>
                <input type="email" value={directorEmail} onChange={(e) => setDirectorEmail(e.target.value)} placeholder="director@domain.com" className="w-full bg-white border-2 border-slate-300 text-slate-900 rounded-[8px] px-4 py-2.5 text-sm outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-blue-500/10 transition-all" required />
              </div>
              <div className="space-y-1.5 relative">
                <label className="text-slate-700 font-bold text-[10px] uppercase tracking-wider">Director Password</label>
                <div className="relative">
                  <input type={showFormPassword ? "text" : "password"} value={directorPassword} onChange={(e) => setDirectorPassword(e.target.value)} placeholder="••••••••" className="w-full bg-white border-2 border-slate-300 text-slate-900 rounded-[8px] px-4 py-2.5 text-sm outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-blue-500/10 transition-all pr-10" required />
                  <button type="button" onClick={() => setShowFormPassword(!showFormPassword)} className="absolute right-3 top-2.5 text-slate-400 hover:text-[#2563EB] transition-colors">
                    {showFormPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <button type="submit" className="w-full md:w-auto bg-[#2563EB] hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-[8px] uppercase tracking-widest text-xs mt-4 shadow-md shadow-blue-500/20 transition-all">
            Deploy & Initialize
          </button>
        </form>
      </div>

      <div className="bg-white border border-slate-200 rounded-[10px] p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <h3 className="text-sm font-bold text-slate-900 tracking-wide flex items-center gap-2">
            <Building2 size={16} className="text-[#2563EB]" /> Active Campuses
          </h3>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search tenant..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-[#2563EB] transition-all"
              />
            </div>
            <button onClick={handleExportCSV} className="flex items-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap">
              <Download size={14} /> Export
            </button>
          </div>
        </div>

        {filteredTenants.length === 0 ? (
          <p className="text-center text-slate-500 py-8 text-sm font-medium">No campuses found.</p>
        ) : (
          filteredTenants.map((tenant) => (
            <div key={tenant.id} className="bg-white border border-slate-200 rounded-[10px] p-5 shadow-sm hover:border-blue-200 transition-colors">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-[10px] bg-blue-50 flex items-center justify-center text-[#2563EB] font-black text-xl border border-blue-100 shrink-0">
                  {tenant.name?.charAt(0) || 'C'}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-sm font-bold">{tenant.name}</h4>
                      <span className="bg-slate-100 text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded border border-slate-200">{tenant.code}</span>
                    </div>
                    <span className="bg-emerald-50 text-emerald-600 border border-emerald-200 text-[9px] font-bold px-2 py-0.5 rounded uppercase">
                      {tenant.status || 'Active'}
                    </span>
                  </div>
                  
                  <div className="bg-slate-50 p-4 rounded-[8px] border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-[9px] text-slate-400 font-bold uppercase block mb-1">Director Name</span>
                      <span className="text-xs font-semibold text-slate-800 flex items-center gap-1.5"><UserCheck size={14} className="text-[#2563EB]"/> {tenant.directorDetails?.name || 'Pending'}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 font-bold uppercase block mb-1">Email Access</span>
                      <span className="text-xs font-mono font-semibold text-slate-800 select-all">{tenant.directorEmail}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 font-bold uppercase block mb-1">Password</span>
                      <div className="flex items-center gap-2">
                        <input type={showCardPassword[tenant.id] ? "text" : "password"} value={tenant.directorPassword} readOnly className="bg-transparent border-none outline-none font-mono text-xs font-semibold text-slate-800 w-24 select-all" />
                        <button type="button" onClick={() => toggleCardPassword(tenant.id)} className="text-slate-400 hover:text-[#2563EB]">
                          {showCardPassword[tenant.id] ? <EyeOff size={14}/> : <Eye size={14}/>}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t border-slate-100">
                    <div className="flex gap-2">
                      <span className="text-[10px] font-bold text-slate-600">Staff: {tenant.stats?.teachers || 0}</span>
                      <span className="text-[10px] font-bold text-slate-600">Std: {tenant.stats?.students || 0}</span>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => executeDownloadDumpBackup(tenant.code)} className="text-[10px] font-bold bg-white border px-3 py-1.5 rounded hover:bg-slate-50 transition-colors shadow-sm">Backup Node</button>
                      <button onClick={() => handleDecommission(tenant.id, tenant.code)} className="text-[10px] font-bold text-rose-600 bg-rose-50 border border-rose-100 px-3 py-1.5 rounded hover:bg-rose-100 transition-colors shadow-sm">Remove</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// =========================================================================
// 3. BILLING LOGS & 4. SECURITY LOGS
// =========================================================================
const BillingLogs = ({ tenants }) => (
  <div className="bg-white border border-slate-200 rounded-[10px] p-6 shadow-sm animate-in fade-in duration-500">
    <h3 className="text-sm font-bold mb-4 flex items-center gap-2"><Clock size={16} className="text-[#2563EB]"/> Platform Licenses & Renewals</h3>
    <table className="w-full text-left text-xs">
      <thead>
        <tr className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
          <th className="p-4 rounded-l-lg">Campus</th><th className="p-4">Plan</th><th className="p-4">Fee</th><th className="p-4 text-right rounded-r-lg">Status</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100 border-t border-slate-100">
        {tenants?.map((t) => (
          <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
            <td className="p-4 font-bold">{t.name}</td>
            <td className="p-4 text-[#2563EB] font-semibold">{t.billing?.plan}</td>
            <td className="p-4 font-medium text-slate-700">{t.billing?.amount}</td>
            <td className="p-4 text-right"><span className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded text-[9px] font-bold uppercase tracking-wide border border-emerald-200">{t.billing?.status}</span></td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const SecurityLogs = ({ tenants, searchQuery, setSearchQuery, handleCrossNodeSearch, alertSubject, setAlertSubject, alertContent, setAlertContent, handleGlobalAlertBroadcast }) => (
  <div className="space-y-6 animate-in fade-in duration-500">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <form onSubmit={handleCrossNodeSearch} className="bg-white p-6 border border-slate-200 rounded-[10px] shadow-sm flex flex-col justify-between">
        <h3 className="text-sm font-bold mb-4 flex items-center gap-2 text-slate-900 tracking-wide"><Search size={16} className="text-[#2563EB]"/> System-Wide Student Finder</h3>
        <div className="space-y-3">
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full border-2 border-slate-300 rounded-[8px] p-2.5 outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-blue-500/10 text-sm transition-all" placeholder="Search student name..." />
          <button className="bg-[#2563EB] hover:bg-blue-700 text-white w-full py-2.5 rounded-[8px] font-bold text-xs uppercase tracking-wider transition-colors shadow-sm">Search Network</button>
        </div>
      </form>
      <form onSubmit={handleGlobalAlertBroadcast} className="bg-white p-6 border border-slate-200 rounded-[10px] shadow-sm flex flex-col justify-between">
        <h3 className="text-sm font-bold mb-4 flex items-center gap-2 text-slate-900 tracking-wide"><Radio size={16} className="text-emerald-500 animate-pulse"/> Network Announcements</h3>
        <div className="space-y-3">
          <input type="text" value={alertSubject} onChange={(e) => setAlertSubject(e.target.value)} className="w-full border-2 border-slate-300 rounded-[8px] p-2.5 outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-blue-500/10 text-sm transition-all" placeholder="Notice Title..." />
          <textarea value={alertContent} onChange={(e) => setAlertContent(e.target.value)} className="w-full border-2 border-slate-300 rounded-[8px] p-2.5 outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-blue-500/10 text-sm resize-none h-12 transition-all" placeholder="Announcement details..." />
          <button className="bg-emerald-600 hover:bg-emerald-500 text-white w-full py-2.5 rounded-[8px] font-bold text-xs uppercase tracking-wider transition-colors shadow-sm">Send Broadcast</button>
        </div>
      </form>
    </div>
  </div>
);

// =========================================================================
// 5. TENANT DATA RECOVERY CENTER 
// =========================================================================
const DataRecovery = () => {
  const [recoverTenantId, setRecoverTenantId] = useState('');
  const [loading, setLoading] = useState(false);
  const [deletedRecords, setDeletedRecords] = useState(null);

  const handleFetchDeleted = async (e) => {
    e.preventDefault();
    if (!recoverTenantId.trim()) return;
    
    setLoading(true);
    setDeletedRecords(null);
    toast.loading("Scanning audit nodes...", { id: 'fetch-toast' }); 

    try {
      setTimeout(() => {
        setDeletedRecords([
          { id: 'DEL-001', type: 'Student Profile', name: 'Rahul Sharma', deletedBy: 'principal@test.com', date: '2026-07-14' },
          { id: 'DEL-002', type: 'Fee Receipt', name: 'Receipt #INV-899', deletedBy: 'accountant@test.com', date: '2026-07-15' },
          { id: 'DEL-003', type: 'Teacher Record', name: 'Amit Singh (Maths)', deletedBy: 'admin@test.com', date: '2026-07-15' }
        ]);
        setLoading(false);
        toast.success("Deleted records found!", { id: 'fetch-toast' });
      }, 1500);
    } catch (error) {
      setLoading(false);
      toast.error("Error fetching data from server!", { id: 'fetch-toast' });
    }
  };

  const handleRestore = (id) => {
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 1000)), 
      {
        loading: 'Restoring to main database...',
        success: <b>Record {id} Restored Successfully!</b>,
        error: <b>Could not restore.</b>,
      }
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl">
      <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm border-t-4 border-[#2563EB]">
        <div className="mb-6 border-b border-slate-100 pb-4">
          <h2 className="text-lg font-black text-slate-900 uppercase flex items-center gap-2 tracking-wide">
            <Database size={20} className="text-[#2563EB]" /> Tenant Data Recovery Center
          </h2>
          <p className="text-sm text-slate-500 mt-1">Super Admin cloud backup node stack. Input a specific Institutional Tenant ID to scan Soft-Deleted document shards.</p>
        </div>
        <form onSubmit={handleFetchDeleted} className="flex flex-col sm:flex-row gap-3 max-w-lg">
          <input 
            type="text" placeholder="Enter Tenant ID (e.g., TEST-01)" 
            value={recoverTenantId} onChange={(e) => setRecoverTenantId(e.target.value)} 
            className="flex-1 border-2 border-slate-300 p-2.5 rounded-lg outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-blue-500/10 transition-all font-mono uppercase text-sm" required
          />
          <button type="submit" disabled={loading} className="bg-[#2563EB] hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold px-6 py-2.5 rounded-lg text-xs uppercase tracking-widest shadow-md transition-all flex items-center justify-center min-w-[180px]">
            {loading ? 'Scanning...' : 'Fetch Data Streams'}
          </button>
        </form>
      </div>

      {deletedRecords && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden animate-in fade-in duration-500">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-800">
              Found <span className="text-[#2563EB]">{deletedRecords.length}</span> deleted records for: <span className="font-mono">{recoverTenantId.toUpperCase()}</span>
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-slate-100 text-[10px] uppercase text-slate-500 font-bold border-b border-slate-200">
                  <th className="p-4">Doc ID</th><th className="p-4">Record Type</th><th className="p-4">Details</th>
                  <th className="p-4">Deleted By / Date</th><th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {deletedRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="p-4 font-mono font-bold text-slate-500 text-xs">{record.id}</td>
                    <td className="p-4 font-bold text-slate-900">{record.type}</td>
                    <td className="p-4 font-medium text-slate-600">{record.name}</td>
                    <td className="p-4">
                      <span className="block text-xs font-mono text-slate-500">{record.deletedBy}</span>
                      <span className="block text-[10px] text-slate-400 font-bold">{record.date}</span>
                    </td>
                    <td className="p-4 text-right">
                      <button onClick={() => handleRestore(record.id)} className="bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 font-bold px-4 py-2 rounded text-xs transition-colors">
                        RESTORE
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

// =========================================================================
// 6. MAIN SUPER ADMIN DASHBOARD COMPONENT
// =========================================================================
const SuperAdminDashboard = () => {
  const [instName, setInstName] = useState(''); 
  const [tenantCode, setTenantCode] = useState('');
  const [directorName, setDirectorName] = useState('');
  const [directorEmail, setDirectorEmail] = useState(''); 
  const [directorPassword, setDirectorPassword] = useState('');
  const [tenants, setTenants] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); 
  const [alertSubject, setAlertSubject] = useState('');
  const [alertContent, setAlertContent] = useState('');

  const fetchLiveDatabaseMetrics = async () => {
    try {
      const response = await axios.get('https://smart-campus-school-management-system-1.onrender.com/api/superadmin/dashboard-metrics');
      if (response.data && response.data.data) {
        setTenants(response.data.data.map(t => ({ 
          ...t, id: t._id, code: t.tenantCode,
          directorEmail: t.directorDetails?.email || 'N/A',
          directorPassword: t.directorDetails?.password || 'N/A',
          stats: { 
            teachers: t.stats?.teachers || 0, 
            students: t.stats?.students || 0 
          }, 
          billing: t.billing || { plan: 'Premium Academic Suite', amount: '₹25,000/mo', status: 'Paid' }, 
          security: t.security || { load: '12%', sessions: 8, lastBackup: 'Just Now', status: 'Optimal' } 
        })));
      }
    } catch (error) { 
      console.error("Dashboard Fetch Error:", error); 
    }
  };

  useEffect(() => { fetchLiveDatabaseMetrics(); }, []);

  const handleDeployTenant = async (e) => {
    e.preventDefault();
    toast.loading("Deploying new Campus Node...", { id: 'deploy-toast' });
    try {
      const payload = {
        name: instName, tenantCode, directorName, directorEmail,      
        directorPassword: directorPassword.split('Test@123')[0] || directorPassword 
      };
      await axios.post('https://smart-campus-school-management-system-1.onrender.com/api/superadmin/provision-tenant', payload);
      toast.success('Success! Campus Profile Created.', { id: 'deploy-toast' }); 
      setInstName(''); setTenantCode(''); setDirectorName(''); setDirectorEmail(''); setDirectorPassword('');
      fetchLiveDatabaseMetrics();
    } catch (err) { 
      toast.error('Provisioning Failed: ' + (err.response?.data?.message || 'Server Error'), { id: 'deploy-toast' }); 
    }
  };

  // 🔥 YAHAN PAR TOKEN FIX ADD KIYA GAYA HAI 🔥
  const handleDecommission = async (id, code) => {
    if(window.confirm(`Delete ${code}?`)){
      toast.loading("Decommissioning node...", { id: 'del-toast' });
      try {
        const token = localStorage.getItem('userToken'); // Token fetch kar rahe hain
        await axios.delete(`https://smart-campus-school-management-system-1.onrender.com/api/superadmin/decommission/${id}`, {
          headers: {
            Authorization: `Bearer ${token}` // Token bhej rahe hain
          }
        }); 
        toast.success(`${code} removed completely.`, { id: 'del-toast' });
        fetchLiveDatabaseMetrics();
      } catch (err) { 
        toast.error("Failed to delete", { id: 'del-toast' }); 
      }
    }
  };

  const executeDownloadDumpBackup = (code) => toast.success(`Database Backup initiated for ${code}`);
  const handleCrossNodeSearch = (e) => { e.preventDefault(); toast.success('Searching for: ' + searchQuery); };
  
  const handleGlobalAlertBroadcast = async (e) => {
    e.preventDefault();
    toast.loading("Broadcasting notice...", { id: 'broadcast-toast' });
    try {
      await axios.post('https://smart-campus-school-management-system-1.onrender.com/api/superadmin/broadcast-alert', {alertSubject, alertContent});
      toast.success('Notice Sent to all campuses!', { id: 'broadcast-toast' }); 
      setAlertSubject(''); setAlertContent('');
    } catch (err) { toast.error("Broadcast failed", { id: 'broadcast-toast' }); }
  };

  return (
    <div className="flex-1 w-full p-6 lg:p-8 overflow-y-auto bg-slate-50 min-h-screen relative">
      <Toaster position="top-right" reverseOrder={false} /> 
      
      <Routes>
        <Route path="/" element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<OverviewHub tenants={tenants} />} />
        
        <Route path="registry" element={
          <TenantRegistry 
            tenants={tenants} instName={instName} setInstName={setInstName} 
            tenantCode={tenantCode} setTenantCode={setTenantCode} 
            directorName={directorName} setDirectorName={setDirectorName} 
            directorEmail={directorEmail} setDirectorEmail={setDirectorEmail} 
            directorPassword={directorPassword} setDirectorPassword={setDirectorPassword}
            handleDeployTenant={handleDeployTenant} executeDownloadDumpBackup={executeDownloadDumpBackup} 
            handleDecommission={handleDecommission} 
          />} 
        />
        
        <Route path="billing" element={<BillingLogs tenants={tenants} />} />
        
        <Route path="security" element={
          <SecurityLogs 
            tenants={tenants} searchQuery={searchQuery} setSearchQuery={setSearchQuery} 
            alertSubject={alertSubject} setAlertSubject={setAlertSubject} 
            alertContent={alertContent} setAlertContent={setAlertContent} 
            handleCrossNodeSearch={handleCrossNodeSearch} 
            handleGlobalAlertBroadcast={handleGlobalAlertBroadcast} 
          />} 
        />
        
        <Route path="data-recovery" element={<DataRecovery />} />
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Routes>
    </div>
  );
};

export default SuperAdminDashboard;