const mongoose = require('mongoose');

// ✅ Complete Student Schema exactly matching Frontend Payload
const studentSchema = new mongoose.Schema({
  // 1. Core Identification (Tenant & Roll No)
  tenantId: { 
    type: String, 
    required: true,
    index: true // Fast searching for specific school/college
  },
  rollNumber: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true // Parent/Student Portal Login ke liye
  },

  // 2. Student Basic Details
  name: { 
    type: String, 
    required: true 
  },
  classAllocation: { 
    type: String, 
    required: true // Department ya Class (e.g., 'Class 10' ya 'B.Tech CSE')
  },
  branch: { 
    type: String, 
    default: 'General' 
  },
  previousInstitute: { 
    type: String, 
    default: 'N/A' 
  },

  // 3. Parent / Guardian Contact Info
  parentName: { 
    type: String, 
    required: true 
  },
  parentEmail: { 
    type: String, 
    required: true 
  },
  parentPhone: { 
    type: String, 
    required: true 
  },

  // 4. Financial / Fee Ledger
  totalFee: { 
    type: Number, 
    default: 145000 
  },
  feePaid: { 
    type: Boolean, 
    default: false 
  },
  discountTag: { 
    type: String, 
    default: 'None' 
  },

  // 5. Academic Performance & Vitals
  attendance: { 
    type: Number, 
    default: 85 
  },
  assignmentRate: { 
    type: String, 
    default: '92%' 
  },
  
  // -- College/B.Tech Specific Fields --
  semesterGPA: { 
    type: String, 
    default: '8.50 CGPA' 
  },
  labScore: { 
    type: String, 
    default: 'A' 
  },

  // -- School Specific Fields --
  halfYearly: { 
    type: String, 
    default: '90%' 
  },
  annualExam: { 
    type: String, 
    default: '91%' 
  },
  grade: { 
    type: String, 
    default: 'A' 
  }
}, {
  timestamps: true // Ye automatically 'createdAt' aur 'updatedAt' time save karega
});

// ✅ FIX: Bas ye ek line use karo, purana 'const Student = ...' delete kar do
const Student = mongoose.models.Student || mongoose.model('Student', studentSchema);

module.exports = Student;