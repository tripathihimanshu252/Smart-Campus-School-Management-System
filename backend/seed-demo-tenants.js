const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const Tenant = require('./models/Tenant');
const User = require('./models/User');
const Faculty = require('./models/Faculty'); // 🔥 Dashboard staff ke liye add kiya

const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smartcampus';

const demoTenants = [
  {
    name: 'GNIOT Academy',
    tenantId: 'GNIOT-AI-DS',
    tenantCode: 'GNIOT-01', // 🔥 FIX: Missing required field
    adminEmail: 'admin@gniot.edu'
  },
  {
    name: 'Delhi Public School',
    tenantId: 'DPS-CORE-SAAS',
    tenantCode: 'DPS-01', // 🔥 FIX: Missing required field
    adminEmail: 'admin@dps.edu'
  },
  {
    name: 'LLOYD Group of Institutions',
    tenantId: 'LLOYD-CSE',
    tenantCode: 'LLOYD-01', // 🔥 FIX: Missing required field
    adminEmail: 'lloyd@gmail.com'
  },
  {
    name: 'Test Campus',
    tenantId: 'test-01',
    tenantCode: 'test-01', // 🔥 Dashboard testing ke liye
    adminEmail: 'admin@test.edu'
  }
];

const seed = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    for (const tenant of demoTenants) {
      const existingTenant = await Tenant.findOne({ tenantId: tenant.tenantId });
      if (!existingTenant) {
        await Tenant.create({
          name: tenant.name,
          tenantId: tenant.tenantId,
          tenantCode: tenant.tenantCode, // 🔥 FIXED
          adminEmail: tenant.adminEmail,
          status: 'Active'
        });
      }

      const existingUser = await User.findOne({ email: tenant.adminEmail });
      if (!existingUser) {
        const passwordHash = await bcrypt.hash('123456', 10);
        await User.create({
          tenantId: tenant.tenantId,
          tenantMapping: tenant.tenantId,
          branchCode: tenant.tenantId,
          name: tenant.name,
          email: tenant.adminEmail,
          password: passwordHash,
          role: 'admin',
          status: 'Active',
          createdBy: 'seed-script'
        });
      }
    }

    // 🔥 DIRECTOR DASHBOARD KE LIYE STAFF DATA ADD KAR RAHE HAIN
    await Faculty.deleteMany({ tenantId: 'test-01' });
    const staffList = [
        { name: "Piyush Principal", email: "piyush@school.edu", password: "123", role: "principal", tenantId: "test-01", status: "Active" },
        { name: "Rahul Director", email: "dir@test.edu", password: "Test@123", role: "director", tenantId: "test-01", status: "Active" },
        { name: "Amit Accountant", email: "acc@test.edu", password: "123", role: "accountant", tenantId: "test-01", status: "Active" },
        { name: "Neha Receptionist", email: "recep@test.edu", password: "123", role: "receptionist", tenantId: "test-01", status: "Active" },
        { name: "Ravi Faculty", email: "teach@test.edu", password: "123", role: "faculty", tenantId: "test-01", status: "Active" }
    ];
    await Faculty.insertMany(staffList);

    console.log('✅ BOOM! Demo tenants aur STAFF sab create ho gaye!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    process.exit(1);
  }
};

seed();