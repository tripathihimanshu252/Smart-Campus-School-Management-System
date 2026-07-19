// Author: Himanshu Tripathi
// Department: AI and DS
// AccountantDashboard.jsx

import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import { 
  CreditCard, Search, CheckCircle, TrendingDown, TrendingUp,
  Plus, Receipt, IndianRupee, Users, FileBarChart2, FileText, Printer, Settings, Edit3, Shield 
} from 'lucide-react';

// =========================================================================
// 1. STUDENT FEES STRUCTURE & LEDGER COMPONENT
// =========================================================================
const StudentFees = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [feeStructure, setFeeStructure] = useState([
    { id: 'LKG', name: 'LKG', amount: 25000 },
    { id: 'UKG', name: 'UKG', amount: 25000 },
    { id: 'C1', name: 'Class 1', amount: 30000 },
    { id: 'C2', name: 'Class 2', amount: 30000 },
    { id: 'C3', name: 'Class 3', amount: 35000 },
    { id: 'C4', name: 'Class 4', amount: 35000 },
    { id: 'C5', name: 'Class 5', amount: 35000 },
    { id: 'C6', name: 'Class 6', amount: 40000 },
    { id: 'C7', name: 'Class 7', amount: 40000 },
    { id: 'C8', name: 'Class 8', amount: 40000 },
    { id: 'C9', name: 'Class 9', amount: 45000 },
    { id: 'C10', name: 'Class 10', amount: 45000 },
    { id: 'C11', name: 'Class 11', amount: 65000 },
    { id: 'C12', name: 'Class 12', amount: 65000 }
  ]);
  const [editClassId, setEditClassId] = useState(null);
  const [newAmount, setNewAmount] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    axios.get('https://smart-campus-school-management-system-1.onrender.com/api/principal/students', { 
      headers: { Authorization: `Bearer ${token}` } 
    })
    .then(res => { setStudents(res.data?.data || []); setLoading(false); })
    .catch(err => { console.error(err); setLoading(false); });
  }, []);

  const handlePayFee = (id) => {
    const token = localStorage.getItem('userToken');
    const amount = prompt("Enter fee payment amount (₹):", "145000");
    if(!amount) return;

    axios.put(`https://smart-campus-school-management-system-1.onrender.com/api/accountant/fees/update/${id}`, 
      { amount: Number(amount) }, 
      { headers: { Authorization: `Bearer ${token}` } }
    )
    .then(res => {
      alert("💰 Fees updated and synced globally!");
      window.location.reload();
    })
    .catch(err => alert("Error updating fee: " + err.message));
  };

  const handleSaveFeeStructure = (id) => {
    if (!newAmount) {
      setEditClassId(null);
      return;
    }
    const updated = feeStructure.map(c => c.id === id ? { ...c, amount: Number(newAmount) } : c);
    setFeeStructure(updated);
    setEditClassId(null);
    setNewAmount('');
    alert("✅ Base Fee Structure Updated Successfully!");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm">
        <div className="mb-6 border-b border-slate-100 pb-4">
          <h2 className="text-lg font-black text-slate-800 flex items-center gap-2 uppercase tracking-wide">
            <Settings className="text-emerald-600" size={20}/> Manage Class-wise Fee Structure
          </h2>
          <p className="text-sm text-slate-500 mt-1">Configure the base yearly fees for LKG to Class 12. Updates will apply to new admissions.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {feeStructure.map((cls) => (
            <div key={cls.id} className="border border-slate-200 p-3 rounded-xl bg-slate-50 text-center hover:shadow-md transition-shadow">
              <h3 className="text-xs font-black text-slate-600 uppercase mb-2">{cls.name}</h3>
              {editClassId === cls.id ? (
                <div className="space-y-2">
                  <input 
                    type="number" 
                    placeholder={cls.amount} 
                    className="w-full text-center border border-slate-300 rounded p-1 text-sm outline-none focus:border-emerald-500"
                    onChange={(e) => setNewAmount(e.target.value)}
                  />
                  <button onClick={() => handleSaveFeeStructure(cls.id)} className="w-full bg-emerald-600 text-white text-[10px] font-bold py-1 rounded hover:bg-emerald-700">Save</button>
                </div>
              ) : (
                <div>
                  <p className="font-mono font-bold text-slate-900 text-sm mb-2">₹{cls.amount}</p>
                  <button onClick={() => { setEditClassId(cls.id); setNewAmount(cls.amount); }} className="text-blue-600 text-[10px] font-bold flex items-center justify-center gap-1 mx-auto hover:text-blue-800">
                    <Edit3 size={12}/> Update
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm">
        <div className="mb-6 border-b border-slate-100 pb-4">
          <h2 className="text-lg font-black text-slate-800 flex items-center gap-2 uppercase tracking-wide">
            <CreditCard className="text-blue-600" size={20}/> Active Student Fee Ledger
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-50 text-[10px] uppercase text-slate-500 font-bold border-y border-slate-200">
                <th className="p-4">Roll No</th>
                <th className="p-4">Student Name</th>
                <th className="p-4">Class / Branch</th>
                <th className="p-4">Fee Status</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y text-slate-700">
              {loading ? (
                <tr><td colSpan="5" className="p-8 text-center">Loading Fees...</td></tr>
              ) : students.length === 0 ? (
                <tr><td colSpan="5" className="p-8 text-center text-slate-400">No student records found.</td></tr>
              ) : students.map(s => (
                <tr key={s._id} className="hover:bg-slate-50">
                  <td className="p-4 font-mono font-bold">{s.rollNumber}</td>
                  <td className="p-4 font-bold text-slate-900">{s.name}</td>
                  <td className="p-4">{s.classAllocation} <span className="text-xs text-slate-400 block">{s.branch}</span></td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-wider ${s.feePaid || s.feeStatus === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                      {s.feeStatus || 'Pending'}
                    </span>
                  </td>
                  <td className="p-4">
                    {s.feeStatus !== 'Paid' ? (
                      <button onClick={() => handlePayFee(s._id)} className="bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">Collect Fee</button>
                    ) : (
                      <span className="text-emerald-500 flex items-center gap-1 text-xs font-bold"><CheckCircle size={14}/> Cleared</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// 2. EXPENSE MANAGEMENT COMPONENT
// =========================================================================
const ExpenseTracker = () => {
  const [expenses, setExpenses] = useState([
    { id: 1, title: 'Server Hosting (Vercel/AWS)', amount: 12000, category: 'Utilities', date: '2026-07-10' },
    { id: 2, title: 'Office Stationery', amount: 3500, category: 'Maintenance', date: '2026-07-12' }
  ]);
  const [formData, setFormData] = useState({ title: '', amount: '', category: 'Maintenance' });

  const handleAddExpense = (e) => {
    e.preventDefault();
    const newExp = {
      id: Date.now(),
      title: formData.title,
      amount: Number(formData.amount),
      category: formData.category,
      date: new Date().toISOString().split('T')[0]
    };
    setExpenses([newExp, ...expenses]);
    setFormData({ title: '', amount: '', category: 'Maintenance' });
    alert("📉 Expense entry registered successfully!");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-500">
      <div className="col-span-1 bg-white border border-slate-200 p-6 rounded-xl shadow-sm h-fit">
        <h2 className="text-md font-black text-slate-800 flex items-center gap-2 uppercase tracking-wide mb-4">
          <Plus className="text-rose-600" size={18}/> Add New Expense
        </h2>
        <form onSubmit={handleAddExpense} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-600 uppercase">Expense Description</label>
            <input type="text" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} placeholder="e.g. Internet Bill" className="w-full mt-1 border border-slate-300 rounded-lg p-2.5 text-sm outline-none focus:border-rose-600"/>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-600 uppercase">Amount (₹)</label>
            <input type="number" required value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} placeholder="0.00" className="w-full mt-1 border border-slate-300 rounded-lg p-2.5 text-sm outline-none focus:border-rose-600"/>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-600 uppercase">Category</label>
            <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full mt-1 border border-slate-300 rounded-lg p-2.5 text-sm outline-none focus:border-rose-600">
              <option>Maintenance</option>
              <option>Utilities</option>
              <option>Events</option>
              <option>Miscellaneous</option>
            </select>
          </div>
          <button type="submit" className="bg-rose-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-rose-700 w-full flex justify-center items-center gap-2">
            Record Expense
          </button>
        </form>
      </div>

      <div className="col-span-2 bg-white border border-slate-200 p-6 rounded-xl shadow-sm">
        <h2 className="text-md font-black text-slate-800 flex items-center gap-2 uppercase tracking-wide mb-4 border-b border-slate-100 pb-4">
          <TrendingDown className="text-rose-600" size={18}/> Expense Audit Trail
        </h2>
        <div className="space-y-3">
          {expenses.map(exp => (
            <div key={exp.id} className="flex justify-between items-center p-4 border border-slate-100 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg border border-slate-200"><Receipt size={16} className="text-slate-500"/></div>
                <div>
                  <p className="font-bold text-sm text-slate-800">{exp.title}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">{exp.category} | {exp.date}</p>
                </div>
              </div>
              <div className="font-mono font-black text-rose-600 text-sm">- ₹{exp.amount}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// 3. INCOME MANAGEMENT COMPONENT
// =========================================================================
const IncomeTracker = () => {
  const [incomes, setIncomes] = useState([
    { id: 1, title: 'External Trust Donation', amount: 50000, source: 'Donations', date: '2026-07-14' },
    { id: 2, title: 'Bus Transport Fee Batch-A', amount: 25000, source: 'Transport Fee', date: '2026-07-15' }
  ]);
  const [formData, setFormData] = useState({ title: '', amount: '', source: 'Other Income' });

  const handleAddIncome = (e) => {
    e.preventDefault();
    const newInc = {
      id: Date.now(),
      title: formData.title,
      amount: Number(formData.amount),
      source: formData.source,
      date: new Date().toISOString().split('T')[0]
    };
    setIncomes([newInc, ...incomes]);
    setFormData({ title: '', amount: '', source: 'Other Income' });
    alert("🟢 Income source added to operational cash flow!");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-500">
      <div className="col-span-1 bg-white border border-slate-200 p-6 rounded-xl shadow-sm h-fit">
        <h2 className="text-md font-black text-slate-800 flex items-center gap-2 uppercase tracking-wide mb-4">
          <Plus className="text-emerald-600" size={18}/> Add Institution Income
        </h2>
        <form onSubmit={handleAddIncome} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-600 uppercase">Income Source / Title</label>
            <input type="text" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} placeholder="e.g. Government Grant" className="w-full mt-1 border border-slate-300 rounded-lg p-2.5 text-sm outline-none focus:border-emerald-600"/>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-600 uppercase">Amount Received (₹)</label>
            <input type="number" required value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} placeholder="0.00" className="w-full mt-1 border border-slate-300 rounded-lg p-2.5 text-sm outline-none focus:border-emerald-600"/>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-600 uppercase">Income Category</label>
            <select value={formData.source} onChange={(e) => setFormData({...formData, source: e.target.value})} className="w-full mt-1 border border-slate-300 rounded-lg p-2.5 text-sm outline-none focus:border-emerald-600">
              <option>Donations</option>
              <option>Transport Fee</option>
              <option>Sponsorships</option>
              <option>Other Income</option>
            </select>
          </div>
          <button type="submit" className="bg-emerald-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-emerald-700 w-full flex justify-center items-center gap-2">
            Record Income Streams
          </button>
        </form>
      </div>

      <div className="col-span-2 bg-white border border-slate-200 p-6 rounded-xl shadow-sm">
        <h2 className="text-md font-black text-slate-800 flex items-center gap-2 uppercase tracking-wide mb-4 border-b border-slate-100 pb-4">
          <TrendingUp className="text-emerald-600" size={18}/> Incoming Cash Flow Audit
        </h2>
        <div className="space-y-3">
          {incomes.map(inc => (
            <div key={inc.id} className="flex justify-between items-center p-4 border border-slate-100 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg border border-slate-200"><TrendingUp size={16} className="text-emerald-600"/></div>
                <div>
                  <p className="font-bold text-sm text-slate-800">{inc.title}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">{inc.source} | {inc.date}</p>
                </div>
              </div>
              <div className="font-mono font-black text-emerald-600 text-sm">+ ₹{inc.amount}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// 4. INVOICES & RECEIPTS GENERATOR FORM
// =========================================================================
const InvoiceReceiptManager = () => {
  const [invoices, setInvoices] = useState([
    { id: "INV-2026-001", target: "Amit Kumar", item: "Tuition Fee Quarter-1", total: 36250, status: "Generated" }
  ]);
  const [formData, setFormData] = useState({ target: '', item: '', total: '', status: 'Generated' });

  const handleCreateInvoice = (e) => {
    e.preventDefault();
    const newInv = {
      id: `INV-2026-0${invoices.length + 1}`,
      target: formData.target,
      item: formData.item,
      total: Number(formData.total),
      status: formData.status
    };
    setInvoices([newInv, ...invoices]);
    setFormData({ target: '', item: '', total: '', status: 'Generated' });
    alert(`📄 Invoice ${newInv.id} compiled and finalized by Administrator context!`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-500">
      <div className="col-span-1 bg-white border border-slate-200 p-6 rounded-xl shadow-sm h-fit">
        <h2 className="text-md font-black text-slate-800 flex items-center gap-2 uppercase tracking-wide mb-4">
          <Plus className="text-blue-600" size={18}/> Form: Generate Invoice
        </h2>
        <form onSubmit={handleCreateInvoice} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-600 uppercase">Student Name / Particular</label>
            <input type="text" required value={formData.target} onChange={(e) => setFormData({...formData, target: e.target.value})} placeholder="e.g. Himanshu Tripathi" className="w-full mt-1 border border-slate-300 rounded-lg p-2.5 text-sm outline-none focus:border-blue-600"/>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-600 uppercase">Fee Description / Component</label>
            <input type="text" required value={formData.item} onChange={(e) => setFormData({...formData, item: e.target.value})} placeholder="e.g. Admission Charges / Lab Fee" className="w-full mt-1 border border-slate-300 rounded-lg p-2.5 text-sm outline-none focus:border-blue-600"/>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-600 uppercase">Billing Amount Total (₹)</label>
            <input type="number" required value={formData.total} onChange={(e) => setFormData({...formData, total: e.target.value})} placeholder="0.00" className="w-full mt-1 border border-slate-300 rounded-lg p-2.5 text-sm outline-none focus:border-blue-600"/>
          </div>
          <button type="submit" className="bg-slate-900 text-white font-bold py-3 px-4 rounded-lg hover:bg-slate-800 w-full flex justify-center items-center gap-2">
            <FileText size={16}/> Build Legal Invoice
          </button>
        </form>
      </div>

      <div className="col-span-2 bg-white border border-slate-200 p-6 rounded-xl shadow-sm">
        <h2 className="text-md font-black text-slate-800 flex items-center gap-2 uppercase tracking-wide mb-4 border-b border-slate-100 pb-4">
          <FileText className="text-blue-600" size={18}/> Active Invoices & Print Queue
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-50 text-[10px] uppercase text-slate-500 font-bold border-y border-slate-200">
                <th className="p-4">Invoice ID</th>
                <th className="p-4">Billing Context</th>
                <th className="p-4">Particulars</th>
                <th className="p-4">Total Price</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y text-slate-700">
              {invoices.map(inv => (
                <tr key={inv.id} className="hover:bg-slate-50">
                  <td className="p-4 font-mono font-bold text-blue-600">{inv.id}</td>
                  <td className="p-4 font-bold text-slate-900">{inv.target}</td>
                  <td className="p-4 text-xs font-semibold text-slate-500">{inv.item}</td>
                  <td className="p-4 font-mono font-black text-slate-800">₹{inv.total}</td>
                  <td className="p-4">
                    <button onClick={() => alert(`🖨️ Redirecting execution window matrix to system print node stack for receipt layout: ${inv.id}`)} className="text-slate-700 bg-slate-100 border border-slate-300 p-2 rounded-lg hover:bg-slate-200 transition-colors">
                      <Printer size={14}/>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// 5. SALARY MANAGEMENT COMPONENT (UPGRADED WITH SUPPORT STAFF)
// =========================================================================
const SalaryManagement = () => {
  const [faculty, setFaculty] = useState([]);
  // Dummy data for support staff based on earlier implementation
  const [supportStaff, setSupportStaff] = useState([
    { _id: 's1', name: 'Ramesh Kumar', role: 'Security Guard', aadharNumber: 'XXXX-XXXX-1234', shiftType: 'Night Shift' },
    { _id: 's2', name: 'Suresh Das', role: 'Peon', aadharNumber: 'XXXX-XXXX-5678', shiftType: 'Day Shift' }
  ]);

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    axios.get('https://smart-campus-school-management-system-1.onrender.com/api/principal/teachers', { 
      headers: { Authorization: `Bearer ${token}` } 
    })
    .then(res => setFaculty(res.data?.data || []))
    .catch(err => console.error(err));
  }, []);

  const handlePaySalary = (name, type = 'Faculty') => {
    alert(`💳 Monthly payroll processed successfully for ${type}: ${name}!`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Faculty Payroll Block */}
      <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm">
        <h2 className="text-lg font-black text-slate-800 flex items-center gap-2 uppercase tracking-wide mb-6 border-b border-slate-100 pb-4">
          <IndianRupee className="text-emerald-600" size={20}/> Faculty Payroll Management
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-50 text-[10px] uppercase text-slate-500 font-bold border-y border-slate-200">
                <th className="p-4">Faculty Member</th>
                <th className="p-4">Email Address</th>
                <th className="p-4">Role Designation</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y text-slate-700">
              {faculty.length === 0 ? (
                <tr><td colSpan="4" className="p-8 text-center text-slate-400">No active faculty found for payroll processing.</td></tr>
              ) : faculty.map(t => (
                <tr key={t._id} className="hover:bg-slate-50">
                  <td className="p-4 font-bold flex items-center gap-2 text-slate-900"><Users size={16} className="text-slate-400"/> {t.name}</td>
                  <td className="p-4 font-mono text-xs">{t.email}</td>
                  <td className="p-4"><span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-wider">{t.role || 'Teacher'}</span></td>
                  <td className="p-4">
                    <button onClick={() => handlePaySalary(t.name)} className="bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors">Disburse Payout</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Support Staff Payroll Block (New Feature Integration) */}
      <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm">
        <h2 className="text-lg font-black text-slate-800 flex items-center gap-2 uppercase tracking-wide mb-6 border-b border-slate-100 pb-4">
          <Shield className="text-amber-600" size={20}/> Support Staff Payroll (Offline Workers)
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-50 text-[10px] uppercase text-slate-500 font-bold border-y border-slate-200">
                <th className="p-4">Staff Member</th>
                <th className="p-4">ID Reference</th>
                <th className="p-4">Role & Shift</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y text-slate-700">
              {supportStaff.length === 0 ? (
                <tr><td colSpan="4" className="p-8 text-center text-slate-400">No active support staff found.</td></tr>
              ) : supportStaff.map(s => (
                <tr key={s._id} className="hover:bg-slate-50">
                  <td className="p-4 font-bold flex items-center gap-2 text-slate-900"><Users size={16} className="text-slate-400"/> {s.name}</td>
                  <td className="p-4 font-mono text-xs text-slate-500">{s.aadharNumber}</td>
                  <td className="p-4">
                    <span className="bg-amber-50 text-amber-700 px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-wider block w-fit">{s.role}</span>
                    <span className="text-[10px] text-slate-400 mt-1 block font-semibold">{s.shiftType}</span>
                  </td>
                  <td className="p-4">
                    <button onClick={() => handlePaySalary(s.name, 'Support Staff')} className="bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors">Disburse Fixed Wage</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// 6. FINANCIAL REPORTS COMPONENT
// =========================================================================
const FinancialReports = () => (
  <div className="bg-white border border-slate-200 p-10 rounded-xl text-center shadow-sm animate-in fade-in duration-500">
    <div className="p-4 bg-blue-50 text-blue-600 rounded-full w-fit mx-auto mb-4"><FileBarChart2 size={32}/></div>
    <h2 className="text-xl font-black text-slate-800 uppercase tracking-wide">Financial Node Analytics</h2>
    <p className="text-slate-500 text-sm mt-2 max-w-md mx-auto">Export operational intelligence, centralized balance sheet matrices, ledger accounts, and custom statements seamlessly.</p>
    <button onClick={() => alert("📊 Exporting system reports metrics data stream...")} className="mt-6 bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-2.5 rounded-lg text-sm transition-all">Generate Summary Sheet</button>
  </div>
);

// =========================================================================
// 🔥 MAIN ACCOUNTANT DASHBOARD ROUTER GATEWAY (DEEP NESTED)
// =========================================================================
const AccountantDashboard = () => {
  return (
    <div className="flex-1 w-full p-6 lg:p-8 bg-slate-50 min-h-screen">
      <Routes>
        <Route path="/" element={<Navigate to="dashboard/overview" replace />} />
        
        {/* STUDENT FEES ROUTES */}
        {/* These match the new Sidebar URLs for fees */}
        <Route path="dashboard/*" element={<StudentFees />} />
        <Route path="fees/*" element={<StudentFees />} />
        
        {/* SALARY MANAGEMENT ROUTES */}
        {/* Matches /accountant/salary/staff etc from Sidebar */}
        <Route path="salary/*" element={<SalaryManagement />} />
        
        {/* EXPENSES ROUTES */}
        <Route path="expenses/*" element={<ExpenseTracker />} />
        
        {/* INCOME ROUTES */}
        <Route path="income/*" element={<IncomeTracker />} />
        
        {/* INVOICES & RECEIPTS ROUTES */}
        <Route path="invoices/*" element={<InvoiceReceiptManager />} />
        
        {/* REPORTS ROUTES */}
        <Route path="reports/*" element={<FinancialReports />} />
        
        <Route path="*" element={
          <div className="bg-white p-10 rounded-xl border border-slate-200 text-center">
            <h2 className="text-xl font-bold text-slate-700">Accountant Sub-Module Activated</h2>
            <p className="text-slate-500 mt-2">Use the primary sidebar modules navigation links to interact with specific balance streams.</p>
          </div>
        } />
      </Routes>
    </div>
  );
};

export default AccountantDashboard;