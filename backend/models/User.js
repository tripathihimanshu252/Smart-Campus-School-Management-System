// Author: Himanshu Tripathi
// Department: AI and DS
// Description: Multi-Tenant User Schema for strict role isolation and SaaS architecture.

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  tenantId: {
    type: String,
    required: true,
    trim: true,
    uppercase: true,
  },
  tenantMapping: {
    type: String,
    trim: true,
    uppercase: true,
    default: ''
  },
  branchCode: {
    type: String,
    trim: true,
    uppercase: true,
    default: ''
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  // 🔥 SMART VALIDATION: Email is required only if the user is NOT support staff
  email: {
    type: String,
    lowercase: true,
    trim: true,
    required: function() {
      return this.role !== 'support_staff';
    }
  },
  // 🔥 SMART VALIDATION: Password is required only if the user is NOT support staff
  password: {
    type: String,
    required: function() {
      return this.role !== 'support_staff';
    }
  },
  role: {
    type: String,
    enum: [
      'super-admin', 
      'director', 
      'principal', 
      'hod', 
      'accountant', 
      'receptionist', 
      'faculty', 
      'student', 
      'parent',
      'driver',         // 🔥 NEW ROLE ADDED
      'support_staff'   // 🔥 NEW ROLE ADDED (Offline workers)
    ], 
    default: 'student' 
  },
  status: {
    type: String,
    enum: ['Active', 'Blocked', 'Terminated'],
    default: 'Active'
  },
  createdBy: {
    type: String,
    default: 'super-admin'
  },

  // ==========================================
  // 🔥 DYNAMIC ROLES DATA FIELDS (Optional but mapped)
  // ==========================================
  aadharNumber: { type: String, trim: true }, // For Support Staff
  shiftType: { type: String, trim: true },    // For Support Staff
  busNumber: { type: String, trim: true },    // For Driver
  assignedRoute: { type: String, trim: true } // For Driver

}, {
  timestamps: true
});

// ✨ THE CRITICAL UPDATE FOR SAAS ✨
// Ek specific school (tenantId) mein koi bhi email duplicate nahi hoga.
// 🔥 PRO FIX: 'partialFilterExpression' ensure karta hai ki 'unique' rule sirf tab chale jab email exist karta ho. 
// Isse Support Staff (bina email wale) infinite number me save ho payenge bina database crash kiye!
userSchema.index(
  { email: 1, tenantId: 1 }, 
  { 
    unique: true, 
    partialFilterExpression: { email: { $exists: true, $type: "string", $ne: "" } } 
  }
);

module.exports = mongoose.model('User', userSchema);