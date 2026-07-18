const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Student = require('./models/Student');
const Fleet = require('./models/Fleet');

// Configuration setups
dotenv.config();

// =========================================================================
// 📝 EXTENDED STUDENT SEED DATA MATRIX (BINA PURANI ENTRIES CHEDE EXTRA ADD KIYA)
// =========================================================================
const mockStudents = [
  // 1️⃣ GNIOT Shard Core Node (Apka Existing Parameter Retained)
  {
    name: 'Himanshu Tripathi',
    rollNumber: '2201321630022',
    branch: 'AI & Data Science',
    parentName: 'Santosh Kumar Tiwari',
    parentEmail: 'santosh@domain.com',
    attendance: 88,
    feeStatus: 'Pending',
    totalFee: 30000,
    paidFee: 0,
    classAllocation: 'B.Tech',
    sectionAllocation: 'A',
    tenantMapping: 'GNIOT-AI-DS' // Match with Login matrix keys
  },
  {
    name: 'Rishab yadav',
    rollNumber: '220132163025',
    branch: 'AI and Data Science',
    parentName: 'M.S. Yadav',
    parentEmail: 'yadav@domain.com',
    attendance: 81,
    feeStatus: 'Pending',
    totalFee: 45000,
    paidFee: 0,
    classAllocation: 'B.Tech',
    sectionAllocation: 'A',
    tenantMapping: 'GNIOT-AI-DS'
  },
  
  // 2️⃣ LLOYD Shard Core Nodes (Extra Added for testing Sameer Khan and Rohan Joshi)
  {
    name: 'Sameer Khan',
    rollNumber: 'LLD-CSE-560',
    branch: 'Information Tech.',
    parentName: 'A. Khan',
    parentEmail: 'khan@lloyd.in',
    attendance: 89,
    feeStatus: 'Pending',
    totalFee: 50000,
    paidFee: 0,
    classAllocation: 'B.Tech',
    sectionAllocation: 'B',
    tenantMapping: 'LLOYD-CSE'
  },
  {
    name: 'Rohan Joshi',
    rollNumber: 'LLD-CSE-552',
    branch: 'Computer Science Eng.',
    parentName: 'K.K. Joshi',
    parentEmail: 'joshi@lloyd.in',
    attendance: 71,
    feeStatus: 'Pending',
    totalFee: 50000,
    paidFee: 0,
    classAllocation: 'B.Tech',
    sectionAllocation: 'A',
    tenantMapping: 'LLOYD-CSE'
  },

  // 3️⃣ DPS Shard Core Node (Extra Added for multi-tenancy verification)
  {
    name: 'Aarav Mehta',
    rollNumber: 'DPS-2026-102',
    branch: 'XII-A Science',
    parentName: 'Sanjay Mehta',
    parentEmail: 'mehta@dps.edu',
    attendance: 94,
    feeStatus: 'Pending',
    totalFee: 65000,
    paidFee: 0,
    classAllocation: '12th',
    sectionAllocation: 'A',
    tenantMapping: 'DPS-CORE-SAAS'
  }
];

// =========================================================================
// 🚌 EXTENDED FLEET SEED DATA MATRIX (BINA PURANI DATA CHEDE EXTRA ADD KIYA)
// =========================================================================
const mockFleets = [
  // GNIOT Bus (Existing Data Shard)
  {
    busNo: 'UP-16-AT-9921',
    route: 'Delhi (Nizamuddin) ➔ GNIOT Campus',
    driver: 'Satish Kumar',
    currentStop: 'Noida Sector 62 Interchange',
    telemetryStatus: 'In Transit',
    tenantId: 'GNIOT-AI-DS'
  },
  // LLOYD Bus (Extra added for live testing)
  {
    busNo: 'BUS-LLOYD-05',
    route: 'Pari Chowk ➔ LLOYD Campus',
    driver: 'Madan Lal',
    currentStop: 'ALPHA 1 COMMERCIAL BELT',
    telemetryStatus: 'In Transit',
    tenantId: 'LLOYD-CSE'
  }
];

// =========================================================================
// 🚀 RUN CENTRAL SEED INJECTOR ENGINE
// =========================================================================
const seedDatabase = async () => {
  try {
    console.log("⏳ Connecting database for data dump operation...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("🗄️ Connected. Flushing existing old records...");

    // Clear collections to avoid indexing conflicts
    await Student.deleteMany();
    await Fleet.deleteMany();

    // Insertion execution
    await Student.insertMany(mockStudents);
    await Fleet.insertMany(mockFleets);

    console.log(`=========================================`);
    console.log(`🎉 DATABASE SEEDING COMPLETED SUCCESSFULLY!`);
    console.log(`📝 Loaded Multi-Tenant Students Data`);
    console.log(`🚌 Loaded Multi-Tenant Fleet Transits`);
    console.log(`=========================================`);
    
    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error(`❌ Seeding failure error instance: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();