// Author: Himanshu Tripathi
// Department: AI and DS

const mongoose = require('mongoose');

const facultySchema = new mongoose.Schema({
  tenantId: { type: String, required: true, index: true },
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  phone: { type: String, required: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, required: true, lowercase: true },
  
  // 🔥 FIX: Enum array mein frontend waale values ('Entry-Level', 'Mid-Level', etc.) add kar diye hain.
  experienceType: { 
      type: String, 
      enum: ['Fresher', 'Experienced', 'Entry-Level', 'Mid-Level', 'Senior-Level'], 
      default: 'Fresher' 
  },
  previousSchool: { type: String, default: '' },
  
  assignedClass: { type: String, default: 'Global' },
  subject: { type: String, default: '' },
  status: { type: String, enum: ['Active', 'Blocked', 'Terminated'], default: 'Active' }
}, {
  timestamps: true
});

facultySchema.index({ email: 1, tenantId: 1 }, { unique: true });
module.exports = mongoose.models.Faculty || mongoose.model('Faculty', facultySchema);