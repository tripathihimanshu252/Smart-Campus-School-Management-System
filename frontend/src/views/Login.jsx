// Author: Himanshu Tripathi
// Department: AI and DS

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { loginSuccess } from '/src/features/authSlice.js';
import { ShieldCheck, Mail, KeyRound, Building2, Loader2, AlertCircle, Eye, EyeOff, ChevronRight } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tenantId, setTenantId] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    const normalizedEmail = (email || '').trim().toLowerCase();
    const normalizedTenant = (tenantId || '').trim();

    try {
      // 🚀 ACTUAL BACKEND API CALL - LOCALHOST REMOVED, RENDER URL ADDED
      const response = await axios.post('https://smart-campus-school-management-system-1.onrender.com/api/auth/login', {
        email: normalizedEmail,
        password,
        tenantId: normalizedTenant
      });

      const resData = response.data;

      // 🔥 BULLETPROOF TOKEN CATCHER
      const token = resData.token || resData.usertoken || resData.userToken || resData.data?.token;
      const user = resData.user || resData.data?.user || resData.data || {};

      if (!token) {
        throw new Error('Authentication token missing from server response. Check backend controller.');
      }

      const role = user.role?.toLowerCase().trim() || 'student';

      // 💾 BROWSER STORAGE SAVE
      localStorage.setItem('userToken', token);
      localStorage.setItem('userRole', role);
      localStorage.setItem('tenantId', normalizedTenant);
      localStorage.setItem('userEmail', user.email || normalizedEmail);

      // 🔄 REDUX STATE UPDATE 
      dispatch(loginSuccess({
        role: role,
        email: user.email || normalizedEmail,
        schoolId: normalizedTenant,
        token: token,
        name: user.name || "Authorized Personnel", 
        department: user.department || "Administration" 
      }));

      // 🔥 UNIVERSAL ROLE-BASED REDIRECTION (RBAC)
      setTimeout(() => {
        if (role === 'super-admin' || role === 'superadmin') navigate('/superadmin');
        else if (role === 'director' || role === 'executive') navigate('/director');
        else if (role === 'principal') navigate('/principal'); 
        else if (role === 'hod') navigate('/hod');
        else if (role === 'accountant') navigate('/accountant');
        else if (role === 'receptionist') navigate('/receptionist'); 
        else if (role === 'teacher' || role === 'faculty') navigate('/faculty');
        else if (role === 'parent' || role === 'student') navigate('/student');
        else if (role === 'driver' || role === 'transport') navigate('/driver/dashboard');
        else navigate('/admin'); 
      }, 150);

    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Unable to sign in. Check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] px-4 py-10 text-slate-800 flex items-center justify-center font-sans antialiased">
      <div className="w-full max-w-5xl overflow-hidden rounded-[20px] shadow-lg border border-slate-200 bg-white">
        <div className="grid md:grid-cols-[1.1fr_0.9fr] h-full min-h-[500px]">
          
          {/* Left Branding Panel */}
          <div className="border-b border-slate-200 bg-[#F8FAFC] p-10 md:border-b-0 md:border-r flex flex-col justify-center relative overflow-hidden">
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
            
            <div className="relative z-10 flex items-center gap-2.5 text-sm font-bold uppercase tracking-widest text-[#2563EB]">
              <div className="p-2 bg-blue-100 rounded-lg"><ShieldCheck size={20} className="text-[#2563EB]" /></div>
              <span>SmartCampus ERP</span>
            </div>
            
            <div className="relative z-10 mt-10 space-y-4">
              <h1 className="text-3xl font-black text-slate-900 leading-tight">Unified Enterprise<br/>Access Gateway</h1>
              <p className="max-w-md text-sm leading-relaxed text-slate-500 font-medium">
                Securely authenticate into your institution's digital infrastructure. Role-based routing will automatically direct you to your designated command center.
              </p>
            </div>
          </div>

          {/* Right Login Form Panel */}
          <form onSubmit={handleLogin} className="bg-white p-10 flex flex-col justify-center">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900">Sign in</h2>
              <p className="mt-1.5 text-xs text-slate-500 font-medium">Enter your organizational credentials below.</p>
            </div>

            {error && (
              <div className="mb-6 flex items-start gap-3 rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-600">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-5">
              
              {/* TENANT ID FIELD */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Tenant ID (School Code)</label>
                <div className="flex items-center rounded-lg border-2 border-slate-200 bg-slate-50 px-3 py-2.5 focus-within:border-[#2563EB] focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-500/10 transition-all">
                  <Building2 size={16} className="mr-3 text-slate-400" />
                  <input
                    type="text"
                    value={tenantId}
                    onChange={(event) => setTenantId(event.target.value)}
                    placeholder="e.g. LLOYD-505"
                    className="w-full bg-transparent text-sm text-slate-700 font-medium outline-none uppercase placeholder:normal-case placeholder:font-normal placeholder:text-slate-400"
                    required
                  />
                </div>
              </div>

              {/* EMAIL FIELD */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Email Address</label>
                <div className="flex items-center rounded-lg border-2 border-slate-200 bg-slate-50 px-3 py-2.5 focus-within:border-[#2563EB] focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-500/10 transition-all">
                  <Mail size={16} className="mr-3 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="name@campus.edu"
                    className="w-full bg-transparent text-sm text-slate-700 font-medium outline-none placeholder:font-normal placeholder:text-slate-400"
                    required
                  />
                </div>
              </div>

              {/* PASSWORD FIELD */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Secure Password</label>
                <div className="flex items-center rounded-lg border-2 border-slate-200 bg-slate-50 px-3 py-2.5 focus-within:border-[#2563EB] focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-500/10 transition-all">
                  <KeyRound size={16} className="mr-3 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-transparent text-sm text-slate-700 font-medium outline-none placeholder:font-normal placeholder:text-slate-400"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="ml-2 text-slate-400 hover:text-[#2563EB] transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-lg bg-[#2563EB] hover:bg-blue-700 px-4 py-3.5 text-xs font-bold tracking-widest text-white transition-all shadow-md shadow-blue-500/20 disabled:cursor-not-allowed disabled:opacity-70 uppercase"
            >
              {isLoading ? (
                <><Loader2 size={16} className="animate-spin" /> AUTHENTICATING...</>
              ) : (
                <><span>ACCESS WORKSPACE</span><ChevronRight size={16} /></>
              )}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default Login;